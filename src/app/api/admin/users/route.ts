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
    const { userId, role } = body;

    if (!userId || !role || !['customer', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Valid userId and role ("customer" | "admin") are required' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { role } },
      { new: true }
    )
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
      user: updatedUser,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update collector role';
    console.error('[API_ADMIN_USERS_PATCH_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
