import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import { User, IAddress } from '@/models/User';
import { verifyUserToken, SESSION_COOKIE_NAME } from '@/lib/auth';

// Helper to authenticate request
async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifyUserToken(token);
  return payload?.id || null;
}

// GET: Fetch all saved addresses for authenticated user
export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No active session' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(userId).select('addresses').lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to retrieve addresses';
    console.error('[API_ACCOUNT_ADDRESSES_GET_ERROR]:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST: Add a new address to user.addresses
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No active session' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      tag,
      isDefault,
      name,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      phone,
    } = body;

    if (!name || !line1 || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name, address line 1, and phone number are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    const shouldBeDefault = Boolean(isDefault) || user.addresses.length === 0;

    // If new address is default, unset isDefault on all existing addresses
    if (shouldBeDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const trimmedPhone = phone.trim();
    // Auto-sync phone to parent user profile if user.phone is empty or this is the default address
    if (!user.phone || shouldBeDefault) {
      user.phone = trimmedPhone;
    }

    const newAddress = {
      tag: tag || (shouldBeDefault ? 'Default Vault' : 'Vault Destination'),
      isDefault: shouldBeDefault,
      name: name.trim(),
      line1: line1.trim(),
      line2: line2?.trim() || '',
      city: city?.trim() || 'Mumbai',
      state: state?.trim() || 'Maharashtra',
      postalCode: postalCode?.trim() || '400001',
      country: country?.trim() || 'India',
      phone: trimmedPhone,
    };

    user.addresses.push(newAddress as unknown as IAddress);
    await user.save();

    return NextResponse.json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to add address';
    console.error('[API_ACCOUNT_ADDRESSES_POST_ERROR]:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// PUT: Update an existing address
export async function PUT(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No active session' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      addressId,
      tag,
      isDefault,
      name,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      phone,
    } = body;

    if (!addressId) {
      return NextResponse.json(
        { success: false, error: 'Address ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    const targetAddr = user.addresses.find(
      (a) => String(a._id) === String(addressId)
    );

    if (!targetAddr) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // If making this address default, clear isDefault on others
    if (isDefault) {
      user.addresses.forEach((addr) => {
        if (String(addr._id) !== String(addressId)) {
          addr.isDefault = false;
        }
      });
      targetAddr.isDefault = true;
    } else if (isDefault === false) {
      targetAddr.isDefault = false;
    }

    if (tag !== undefined) targetAddr.tag = tag;
    if (name !== undefined) targetAddr.name = name.trim();
    if (line1 !== undefined) targetAddr.line1 = line1.trim();
    if (line2 !== undefined) targetAddr.line2 = line2.trim();
    if (city !== undefined) targetAddr.city = city.trim();
    if (state !== undefined) targetAddr.state = state.trim();
    if (postalCode !== undefined) targetAddr.postalCode = postalCode.trim();
    if (country !== undefined) targetAddr.country = country.trim();
    if (phone !== undefined) {
      const trimmedPhone = phone.trim();
      targetAddr.phone = trimmedPhone;
      // Auto-sync phone: if user.phone is empty or this address is default
      if (!user.phone || targetAddr.isDefault) {
        user.phone = trimmedPhone;
      }
    }

    await user.save();

    return NextResponse.json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update address';
    console.error('[API_ACCOUNT_ADDRESSES_PUT_ERROR]:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE: Delete an address by query ?id=...
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No active session' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get('id');

    if (!addressId) {
      return NextResponse.json(
        { success: false, error: 'Address ID is required in query parameter' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    const initialLength = user.addresses.length;
    // Filter out the deleted address
    user.addresses = user.addresses.filter(
      (addr) => String(addr._id) !== String(addressId)
    );

    if (user.addresses.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // If deleted address was default and there are remaining addresses, ensure one is default
    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to delete address';
    console.error('[API_ACCOUNT_ADDRESSES_DELETE_ERROR]:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
