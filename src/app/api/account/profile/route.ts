import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { verifyUserToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function PUT(req: NextRequest) {
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
    const { name, phone, country, addresses } = body;

    await connectToDatabase();

    const updateData: Record<string, unknown> = {};

    if (name && typeof name === 'string' && name.trim()) {
      updateData.name = name.trim();
    }

    if (phone !== undefined && typeof phone === 'string') {
      updateData.phone = phone.trim();
    }

    if (country !== undefined && typeof country === 'string') {
      updateData.country = country.trim();
    }

    if (addresses !== undefined && Array.isArray(addresses)) {
      updateData.addresses = addresses;
    }

    const updatedUser = await User.findByIdAndUpdate(
      payload.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select('-passwordHash')
      .lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Collector profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    console.error('[API_ACCOUNT_PROFILE_PUT_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

