import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyUserToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    let userId: string | null = null;
    let sessionEmail: string | null = null;

    if (token) {
      const payload = await verifyUserToken(token);
      if (payload?.id) {
        userId = payload.id;
        sessionEmail = payload.email || null;
      }
    }

    const body = await req.json();
    const { message, email } = body;

    const appealText = typeof message === 'string' ? message.trim() : '';
    if (!appealText) {
      return NextResponse.json(
        { success: false, error: 'Appeal message is required' },
        { status: 400 }
      );
    }

    const lookupEmail = email?.trim().toLowerCase() || sessionEmail;

    let user = null;
    if (userId) {
      user = await User.findById(userId);
    } else if (lookupEmail) {
      user = await User.findOne({ email: lookupEmail });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Collector account not found' },
        { status: 404 }
      );
    }

    user.appealMessage = {
      message: appealText,
      submittedAt: new Date(),
      status: 'pending',
    };

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Appeal submitted to Salon Director',
      appeal: user.appealMessage,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit appeal';
    console.error('[API_ACCOUNT_APPEAL_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

