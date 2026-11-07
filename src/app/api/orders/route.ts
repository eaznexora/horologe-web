import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { verifyUserToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check optional authenticated user session
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
      // Guest order
    }

    const body = await req.json();
    const {
      customerSnapshot,
      items,
      shippingAddress,
      financials,
      paymentGateway,
    } = body;

    if (!customerSnapshot?.name || !customerSnapshot?.email || !customerSnapshot?.phone) {
      return NextResponse.json(
        { success: false, error: 'Full collector contact details (name, email, phone) are required.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one certified timepiece must be present in the order.' },
        { status: 400 }
      );
    }

    if (!shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.phone) {
      return NextResponse.json(
        { success: false, error: 'Complete delivery destination address is required.' },
        { status: 400 }
      );
    }

    // Generate bespoke order reference
    const timestampStr = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `HR-VAULT-${timestampStr}-${randomSuffix}`;

    // Normalize items
    const normalizedItems = items.map((it: any) => ({
      timepieceId: it.timepieceId && mongoose.Types.ObjectId.isValid(it.timepieceId)
        ? new mongoose.Types.ObjectId(it.timepieceId)
        : new mongoose.Types.ObjectId(),
      name: it.name || 'Certified Luxury Timepiece',
      brand: it.brand || 'Horologe Royale Master Selection',
      model: it.model || it.name || 'Timepiece',
      reference: it.reference || it.slug || 'HR-REF-VAULT',
      price: Number(it.price) || 0,
      image: it.image || '/assets/admin-hero-watch.jpg',
    }));

    // Normalize financials
    const subtotal = Number(financials?.subtotal) || normalizedItems.reduce((acc: number, cur: any) => acc + cur.price, 0);
    const tax = Number(financials?.tax) || 0;
    const totalAmount = Number(financials?.totalAmount) || subtotal + tax;

    const newOrder = new Order({
      orderNumber,
      userId: authenticatedUserId,
      customerSnapshot: {
        name: customerSnapshot.name.trim(),
        email: customerSnapshot.email.trim().toLowerCase(),
        phone: customerSnapshot.phone.trim(),
      },
      items: normalizedItems,
      shippingAddress: {
        name: shippingAddress.name?.trim() || customerSnapshot.name.trim(),
        line1: shippingAddress.line1.trim(),
        line2: shippingAddress.line2?.trim() || '',
        city: shippingAddress.city.trim(),
        state: shippingAddress.state?.trim() || 'Maharashtra',
        postalCode: shippingAddress.postalCode?.trim() || '400001',
        country: shippingAddress.country?.trim() || 'India',
        phone: shippingAddress.phone.trim(),
      },
      financials: {
        subtotal,
        tax,
        totalAmount,
        currency: 'INR',
      },
      paymentGateway: {
        gateway: paymentGateway?.gateway || 'razorpay',
        razorpayOrderId: paymentGateway?.razorpayOrderId || `order_${Date.now()}`,
        razorpayPaymentId: paymentGateway?.razorpayPaymentId || `pay_${Date.now()}`,
        paymentStatus: paymentGateway?.paymentStatus || 'captured',
      },
      fulfillmentStatus: 'Processing',
    });

    await newOrder.save();

    // If authenticated and user has no phone set yet, auto-sync
    if (authenticatedUserId) {
      try {
        await User.findByIdAndUpdate(authenticatedUserId, {
          $set: {
            phone: customerSnapshot.phone.trim(),
          },
        });
      } catch (err) {
        console.error('Error auto-syncing phone to user profile:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Vault order successfully created and recorded.',
      order: newOrder,
    }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to finalize vault order';
    console.error('[API_ORDERS_POST_ERROR]:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

