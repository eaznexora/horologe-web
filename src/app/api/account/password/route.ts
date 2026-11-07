import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
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
    const { currentPassword, newPassword } = body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(payload.id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Collector profile not found' },
        { status: 404 }
      );
    }

    // Verify current password if user has one set
    if (user.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password is required' },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: 'Current password does not match' },
          { status: 400 }
        );
      }
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update security credentials';
    console.error('[API_ACCOUNT_PASSWORD_PUT_ERROR]:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
