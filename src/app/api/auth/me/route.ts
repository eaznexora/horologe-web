import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyUserToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { User } from '@/models/User';
// CRITICAL: Must import Timepiece so Mongoose can populate 'wishlist'
import { Timepiece } from '@/models/Timepiece';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No active session' },
        { status: 401 }
      );
    }

    const payload = await verifyUserToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Ensure Timepiece model is registered before populate
    if (!Timepiece) {
      console.warn('Timepiece model registered');
    }

    const user = await User.findById(payload.id)
      .select('-passwordHash')
      .populate({
        path: 'wishlist',
        model: 'Timepiece',
        select: 'name slug price images brand model conditionBadge',
      })
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    console.error('[API_AUTH_ME_ERROR]:', error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
