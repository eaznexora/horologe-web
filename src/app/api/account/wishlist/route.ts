import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Timepiece } from '@/models/Timepiece';
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

    // Ensure Timepiece model is registered for populate
    void Timepiece;

    const user = await User.findById(payload.id)
      .populate({
        path: 'wishlist',
        model: 'Timepiece',
        select: 'name slug price images tagline minorSpecs status',
      })
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Collector profile not found' },
        { status: 404 }
      );
    }

    if (user.status === 'blocked') {
      return NextResponse.json(
        { success: false, error: 'Your vault privileges have been suspended by the Salon Directorate.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      wishlist: user.wishlist || [],
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to retrieve wishlist';
    console.error('[API_ACCOUNT_WISHLIST_GET_ERROR]:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { timepieceId } = body;

    if (!timepieceId) {
      return NextResponse.json(
        { success: false, error: 'Timepiece ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    void Timepiece;

    const user = await User.findById(payload.id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Collector profile not found' },
        { status: 404 }
      );
    }

    if (user.status === 'blocked') {
      return NextResponse.json(
        { success: false, error: 'Your vault privileges have been suspended by the Salon Directorate.' },
        { status: 403 }
      );
    }

    const strTargetId = String(timepieceId);
    const existingIndex = user.wishlist.findIndex(
      (id) => String(id) === strTargetId
    );

    if (existingIndex > -1) {
      // Pull from wishlist
      user.wishlist.splice(existingIndex, 1);
    } else {
      // Push to wishlist
      user.wishlist.push(new mongoose.Types.ObjectId(strTargetId));
    }

    await user.save();

    // Re-populate to return clean enriched objects
    await user.populate({
      path: 'wishlist',
      model: 'Timepiece',
      select: 'name slug price images tagline minorSpecs status',
    });

    return NextResponse.json({
      success: true,
      wishlist: user.wishlist || [],
      action: existingIndex > -1 ? 'removed' : 'added',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update wishlist';
    console.error('[API_ACCOUNT_WISHLIST_POST_ERROR]:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
