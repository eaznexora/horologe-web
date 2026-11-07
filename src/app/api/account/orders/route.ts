import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { verifyUserToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No active session' },
        { status: 401 }
      );
    }

    const payload = await verifyUserToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or expired session' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(payload.id).select('email').lean();

    // Query orders by either userId or collector email
    const queryConditions: Record<string, unknown>[] = [{ userId: payload.id }];
    if (user?.email) {
      queryConditions.push({ 'customerSnapshot.email': user.email.toLowerCase() });
    }

    const orders = await Order.find({ $or: queryConditions })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders: orders || [],
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve orders';
    console.error('[API_ACCOUNT_ORDERS_GET_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

