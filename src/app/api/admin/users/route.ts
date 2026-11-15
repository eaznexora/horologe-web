import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Order } from '@/models/Order';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    void Order;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();
    const roleFilter = searchParams.get('role')?.trim();

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { 'addresses.phone': { $regex: search, $options: 'i' } },
      ];
    }

    if (roleFilter && roleFilter !== 'all') {
      query.role = roleFilter;
    }

    const [rawUsers, totalUsers, adminCount, customerCount] = await Promise.all([
      User.find(query)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .lean(),
      User.countDocuments({}),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'customer' }),
    ]);

    const userIds = rawUsers.map((u) => u._id);
    const userEmails = rawUsers.map((u) => u.email?.toLowerCase()).filter(Boolean);

    // Aggregate orders count per user
    const orderAggregates = await Order.aggregate([
      {
        $match: {
          $or: [
            { userId: { $in: userIds } },
            { 'customerSnapshot.email': { $in: userEmails } },
          ],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $ifNull: ['$userId', false] },
              { $toString: '$userId' },
              { $toLower: '$customerSnapshot.email' },
            ],
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map<string, number>();
    orderAggregates.forEach((item: any) => {
      countMap.set(String(item._id), item.count);
    });

    const enrichedUsers = rawUsers.map((u: any) => {
      const byId = countMap.get(String(u._id)) || 0;
      const byEmail = u.email ? countMap.get(u.email.toLowerCase()) || 0 : 0;
      const resolvedPhone = u.phone || u.addresses?.find((a: any) => a.phone)?.phone || u.addresses?.[0]?.phone || '';
      return {
        ...u,
        phone: resolvedPhone,
        ordersCount: Math.max(byId, byEmail),
        status: u.status || 'active',
        blockedAt: u.blockedAt || null,
        blockReason: u.blockReason || '',
        appealMessage: u.appealMessage || { message: '', submittedAt: null, status: 'none' },
      };
    });

    return NextResponse.json(
      {
        success: true,
        users: enrichedUsers,
        metrics: {
          totalUsers,
          adminCount,
          customerCount,
        },
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve collectors';
    console.error('[API_ADMIN_USERS_GET_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { userId, action, reason, role } = body;

    if (!userId || (!action && !role)) {
      return NextResponse.json(
        { success: false, error: 'User ID and action are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const updateFields: Record<string, unknown> = {};

    if (action === 'block' || action === 'unblock') {
      const isBlocking = action === 'block';

      updateFields.status = isBlocking ? 'blocked' : 'active';
      updateFields.blockReason = isBlocking
        ? (reason || 'Administrative review and portfolio verification in progress.')
        : '';
      updateFields.blockedAt = isBlocking ? new Date() : null;

      if (!isBlocking) {
        // Clear or update appeal status when unblocked
        updateFields['appealMessage.status'] = 'reviewed';
      }
    } else if (role && ['customer', 'admin'].includes(role)) {
      updateFields.role = role;
    } else {
      return NextResponse.json(
        { success: false, error: 'Valid action ("block" | "unblock") or role ("customer" | "admin") is required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    console.log(`[ADMIN_USERS_PATCH] Target user ${userId} -> New status: ${updateFields.status || updateFields.role}`);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, strict: false }
    )
      .select('-passwordHash')
      .lean();

    if (!updatedUser) {
      console.error(`[ADMIN_USERS_PATCH] User not found: ${userId}`);
      return NextResponse.json(
        { success: false, error: 'Collector not found in database' },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    // Direct collection write fallback to guarantee persistence if status mismatch occurs
    if (updateFields.status && (updatedUser as any).status !== updateFields.status) {
      console.warn(`[ADMIN_USERS_PATCH] Fallback: Executing direct collection updateOne for user ${userId}`);
      const objId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
      await User.collection.updateOne(
        { _id: objId as any },
        { $set: updateFields }
      );
      (updatedUser as any).status = updateFields.status;
      if (updateFields.blockReason !== undefined) {
        (updatedUser as any).blockReason = updateFields.blockReason;
      }
      if (updateFields.blockedAt !== undefined) {
        (updatedUser as any).blockedAt = updateFields.blockedAt;
      }
    }

    console.log(`[ADMIN_USERS_PATCH] Successfully updated in MongoDB:`, {
      id: updatedUser._id,
      email: updatedUser.email,
      status: (updatedUser as any).status,
    });

    return NextResponse.json(
      {
        success: true,
        user: updatedUser,
        message: `Collector status updated to ${updatedUser.status}`,
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('[ADMIN_USERS_PATCH_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database update failed' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    let userId = searchParams.get('id');

    if (!userId) {
      try {
        const body = await req.json();
        userId = body.userId || body.id;
      } catch {
        // query param is primary
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Collector ID is required for deletion' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Collector not found in database' },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Collector record deleted successfully',
        deletedId: userId,
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete collector record';
    console.error('[API_ADMIN_USERS_DELETE_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
