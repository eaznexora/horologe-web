import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { Inquiry } from '@/models/Inquiry';
import { verifyUserToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check optional active user session to link inquiry
    let authenticatedUserId: mongoose.Types.ObjectId | null = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      if (token) {
        const payload = await verifyUserToken(token);
        if (payload?.id && mongoose.Types.ObjectId.isValid(payload.id)) {
          authenticatedUserId = new mongoose.Types.ObjectId(payload.id);
        }
      }
    } catch {
      // Guest inquiry
    }

    const body = await req.json();
    const { name, email, phone, subject, message, type, timepiece } = body;

    // Strict validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Full collector name is required.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid client email address is required.' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || !phone.trim() || phone.trim().length < 8) {
      return NextResponse.json(
        { success: false, error: 'Valid contact telephone number is required.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Inquiry message or request details are required.' },
        { status: 400 }
      );
    }

    const inquiryType: 'watch' | 'general' = type === 'watch' ? 'watch' : 'general';

    let formattedTimepiece = null;
    if (inquiryType === 'watch' && timepiece) {
      formattedTimepiece = {
        timepieceId:
          timepiece.timepieceId && mongoose.Types.ObjectId.isValid(timepiece.timepieceId)
            ? new mongoose.Types.ObjectId(timepiece.timepieceId)
            : undefined,
        slug: timepiece.slug?.trim() || '',
        title: timepiece.title?.trim() || 'Certified Luxury Timepiece',
        brand: timepiece.brand?.trim() || 'Horologe Royale Master Selection',
        reference: timepiece.reference?.trim() || 'HR-VAULT',
        price: Number(timepiece.price) || 0,
        image: timepiece.image?.trim() || '/assets/Rolex Daytona.png',
      };
    }

    const newInquiry = new Inquiry({
      type: inquiryType,
      userId: authenticatedUserId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject?.trim() || (inquiryType === 'watch' ? `Timepiece Inquiry: ${formattedTimepiece?.title || 'Watch'}` : 'Private Concierge Request'),
      message: message.trim(),
      timepiece: formattedTimepiece,
      status: 'new',
    });

    await newInquiry.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been received by the Private Salon Concierge.',
        inquiry: newInquiry,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to transmit inquiry';
    console.error('[API_INQUIRIES_POST_ERROR]:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

