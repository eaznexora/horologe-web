import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { AbandonedCheckout } from '@/models/AbandonedCheckout';
import { verifyUserToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check optional active user session
    let authenticatedUserId: string | null = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      if (token) {
        const payload = await verifyUserToken(token);
        if (payload?.id) {
          authenticatedUserId = payload.id;
        }
      }
    } catch {
      // Guest user
    }

    const body = await req.json();
    const {
      sessionKey,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      timepieceId,
      timepieceSlug,
      timepieceTitle,
      timepieceBrand,
      timepieceReference,
      timepieceImage,
      timepiecePrice,
      shippingCity,
      shippingCountry,
    } = body;

    const effectiveUserId = userId || authenticatedUserId || null;
    const cleanEmail = typeof customerEmail === 'string' ? customerEmail.trim().toLowerCase() : '';
    const cleanSlug = typeof timepieceSlug === 'string' ? timepieceSlug.trim() : '';
    const cleanSessionKey =
      sessionKey?.trim() || effectiveUserId || cleanEmail || `guest_session_${Date.now()}`;

    // Filter criteria: match by sessionKey OR (email + timepieceSlug when email is present)
    const matchFilter: Record<string, unknown> = {
      status: 'abandoned',
    };

    if (cleanEmail && cleanSlug) {
      matchFilter.$or = [
        { sessionKey: cleanSessionKey },
        { customerEmail: cleanEmail, timepieceSlug: cleanSlug },
        ...(effectiveUserId && mongoose.Types.ObjectId.isValid(effectiveUserId)
          ? [{ userId: new mongoose.Types.ObjectId(effectiveUserId) }]
          : []),
      ];
    } else {
      matchFilter.sessionKey = cleanSessionKey;
    }

    const updateDoc: Record<string, unknown> = {
      lastActiveAt: new Date(),
      status: 'abandoned',
      sessionKey: cleanSessionKey,
    };

    if (effectiveUserId && mongoose.Types.ObjectId.isValid(effectiveUserId)) {
      updateDoc.userId = new mongoose.Types.ObjectId(effectiveUserId);
    }
    if (customerName?.trim()) updateDoc.customerName = customerName.trim();
    if (cleanEmail) updateDoc.customerEmail = cleanEmail;
    if (customerPhone?.trim()) updateDoc.customerPhone = customerPhone.trim();
    if (timepieceId && mongoose.Types.ObjectId.isValid(timepieceId)) {
      updateDoc.timepieceId = new mongoose.Types.ObjectId(timepieceId);
    }
    if (cleanSlug) updateDoc.timepieceSlug = cleanSlug;
    if (timepieceTitle?.trim()) updateDoc.timepieceTitle = timepieceTitle.trim();
    if (timepieceBrand?.trim()) updateDoc.timepieceBrand = timepieceBrand.trim();
    if (timepieceReference?.trim()) updateDoc.timepieceReference = timepieceReference.trim();
    if (timepieceImage?.trim()) updateDoc.timepieceImage = timepieceImage.trim();
    if (timepiecePrice !== undefined && timepiecePrice !== null) {
      updateDoc.timepiecePrice = Number(timepiecePrice) || 0;
    }
    if (shippingCity?.trim()) updateDoc.shippingCity = shippingCity.trim();
    if (shippingCountry?.trim()) updateDoc.shippingCountry = shippingCountry.trim();

    const record = await AbandonedCheckout.findOneAndUpdate(
      matchFilter,
      {
        $set: updateDoc,
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      checkoutId: record?._id,
      lastActiveAt: record?.lastActiveAt,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to record checkout activity';
    console.error('[API_CHECKOUT_TRACK_ERROR]:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

