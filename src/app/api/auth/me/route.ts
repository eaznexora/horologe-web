import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyUserToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { User } from '@/models/User';
// CRITICAL: Must import Timepiece so Mongoose can populate 'wishlist'
import { Timepiece } from '@/models/Timepiece';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No active session' },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const payload = await verifyUserToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired session' },
        { status: 401, headers: NO_CACHE_HEADERS }
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
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    if (user.status === 'blocked') {
      return NextResponse.json(
        {
          success: false,
          blocked: true,
          message: 'Vault privileges suspended',
          appeal: user.appealMessage || null,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            blockReason: user.blockReason,
            blockedAt: user.blockedAt,
            appealMessage: user.appealMessage,
          },
        },
        { status: 403, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, user },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    console.error('[API_AUTH_ME_ERROR]:', error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
