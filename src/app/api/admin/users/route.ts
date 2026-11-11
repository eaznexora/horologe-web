import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Order } from '@/models/Order';

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

    return NextResponse.json({
      success: true,
      users: enrichedUsers,
      metrics: {
        totalUsers,
        adminCount,
        customerCount,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve collectors';
    console.error('[API_ADMIN_USERS_GET_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { userId, action, reason, role } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Collector userId is required' },
        { status: 400 }
      );
    }

    let updateQuery: Record<string, unknown> = {};

    if (action === 'block') {
      updateQuery = {
        $set: {
          status: 'blocked',
          blockedAt: new Date(),
          blockReason: reason?.trim() || 'Administrative sanction by Salon Directorate',
        },
      };
    } else if (action === 'unblock') {
      updateQuery = {
        $set: {
          status: 'active',
          blockReason: '',
          'appealMessage.status': 'reviewed',
        },
        $unset: {
          blockedAt: 1,
        },
      };
    } else if (role && ['customer', 'admin'].includes(role)) {
      updateQuery = {
        $set: { role },
      };
    } else {
      return NextResponse.json(
        { success: false, error: 'Valid action ("block" | "unblock") or role ("customer" | "admin") is required' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateQuery, { new: true })
      .select('-passwordHash')
      .lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Collector not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: action === 'block' ? 'Collector privileges suspended' : action === 'unblock' ? 'Collector privileges reinstated' : 'Role updated successfully',
      user: updatedUser,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update collector record';
    console.error('[API_ADMIN_USERS_PATCH_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
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
        { status: 400 }
      );
    }

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Collector not found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Collector record deleted successfully',
      deletedId: userId,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete collector record';
    console.error('[API_ADMIN_USERS_DELETE_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
