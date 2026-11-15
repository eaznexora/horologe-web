import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { AbandonedCheckout } from '@/models/AbandonedCheckout';
import { User } from '@/models/User';
import { Timepiece } from '@/models/Timepiece';
import { Order } from '@/models/Order';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Ensure dependent models are initialized in Mongoose registry
    void Timepiece;
    void Order;
    void User;

    // 1. Fetch Abandoned Checkouts
    const rawAbandoned = await AbandonedCheckout.find({ status: 'abandoned' })
      .sort({ lastActiveAt: -1 })
      .lean();

    // Extract identifiers to enrich from User & Order models
    const userIds = rawAbandoned
      .map((a) => a.userId)
      .filter((id): id is mongoose.Types.ObjectId => Boolean(id) && mongoose.Types.ObjectId.isValid(String(id)));

    const emails = rawAbandoned
      .map((a) => a.customerEmail?.toLowerCase().trim())
      .filter((e): e is string => Boolean(e) && e.includes('@'));

    // Fetch matching registered users to complement phone or address details
    const matchedUsers = await User.find({
      $or: [
        ...(userIds.length > 0 ? [{ _id: { $in: userIds } }] : []),
        ...(emails.length > 0 ? [{ email: { $in: emails } }] : []),
      ],
    })
      .select('-passwordHash')
      .lean();

    const userByIdMap = new Map<string, any>();
    const userByEmailMap = new Map<string, any>();
    matchedUsers.forEach((u: any) => {
      userByIdMap.set(String(u._id), u);
      if (u.email) userByEmailMap.set(u.email.toLowerCase().trim(), u);
    });

    // Orders Count Map
    const allQueryIds = Array.from(
      new Set([...userIds.map((id) => String(id)), ...matchedUsers.map((u) => String(u._id))])
    );
    const allQueryEmails = Array.from(
      new Set([...emails, ...matchedUsers.map((u) => u.email?.toLowerCase().trim()).filter(Boolean)])
    );

    const orderAggregates = await Order.aggregate([
      {
        $match: {
          $or: [
            ...(allQueryIds.length > 0
              ? [{ userId: { $in: allQueryIds.map((id) => new mongoose.Types.ObjectId(id)) } }]
              : []),
            ...(allQueryEmails.length > 0 ? [{ 'customerSnapshot.email': { $in: allQueryEmails } }] : []),
          ],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $ifNull: ['$userId', false] },
              { $toString: '$userId' },
              { $toLower: '$customerSnapshot.email' },
            ],
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const orderCountMap = new Map<string, number>();
    orderAggregates.forEach((item: any) => {
      orderCountMap.set(String(item._id), item.count);
    });

    const enrichedAbandoned = rawAbandoned.map((a: any) => {
      const u = (a.userId && userByIdMap.get(String(a.userId))) || (a.customerEmail && userByEmailMap.get(a.customerEmail.toLowerCase().trim()));
      const ordersCount = Math.max(
        a.userId ? orderCountMap.get(String(a.userId)) || 0 : 0,
        a.customerEmail ? orderCountMap.get(a.customerEmail.toLowerCase().trim()) || 0 : 0
      );

      const resolvedPhone =
        a.customerPhone?.trim() ||
        u?.phone?.trim() ||
        u?.addresses?.find((addr: any) => addr.phone)?.phone?.trim() ||
        u?.addresses?.[0]?.phone?.trim() ||
        '';

      const resolvedCity =
        a.shippingCity?.trim() ||
        u?.addresses?.find((addr: any) => addr.city)?.city?.trim() ||
        u?.addresses?.[0]?.city?.trim() ||
        'Mumbai';

      const resolvedCountry =
        a.shippingCountry?.trim() ||
        u?.country?.trim() ||
        u?.addresses?.[0]?.country?.trim() ||
        'India';

      return {
        _id: String(a._id),
        type: 'abandoned',
        sessionKey: a.sessionKey,
        userId: a.userId ? String(a.userId) : null,
        customerName: a.customerName?.trim() || u?.name?.trim() || 'Private Patron',
        customerEmail: a.customerEmail?.trim() || u?.email?.trim() || '',
        customerPhone: resolvedPhone,
        shippingCity: resolvedCity,
        shippingCountry: resolvedCountry,
        timepieceId: a.timepieceId ? String(a.timepieceId) : null,
        timepieceSlug: a.timepieceSlug || '',
        timepieceTitle: a.timepieceTitle || 'Luxury Timepiece',
        timepieceBrand: a.timepieceBrand || 'Horologe Royale Master Selection',
        timepieceReference: a.timepieceReference || 'HR-VAULT-EDITION',
        timepieceImage: a.timepieceImage || '/assets/Rolex Daytona.png',
        timepiecePrice: Number(a.timepiecePrice) || 0,
        ordersCount,
        lastActiveAt: a.lastActiveAt || a.updatedAt || a.createdAt || new Date().toISOString(),
        status: a.status || 'abandoned',
      };
    });

    // 2. Fetch Wishlist Collectors
    const rawWishlistUsers = await User.find({ 'wishlist.0': { $exists: true } })
      .populate({
        path: 'wishlist',
        model: 'Timepiece',
        select: 'name slug brand model reference sku images price tagline status',
      })
      .select('-passwordHash')
      .sort({ updatedAt: -1 })
      .lean();

    const enrichedWishlists = rawWishlistUsers
      .map((u: any) => {
        const resolvedPhone =
          u.phone?.trim() ||
          u.addresses?.find((addr: any) => addr.phone)?.phone?.trim() ||
          u.addresses?.[0]?.phone?.trim() ||
          '';

        const resolvedCity =
          u.addresses?.find((addr: any) => addr.city)?.city?.trim() ||
          u.addresses?.[0]?.city?.trim() ||
          'Mumbai';

        const resolvedCountry = u.country?.trim() || u.addresses?.[0]?.country?.trim() || 'India';

        const validWishlistItems = Array.isArray(u.wishlist)
          ? u.wishlist.filter((tp: any) => tp && typeof tp === 'object' && tp.name)
          : [];

        if (validWishlistItems.length === 0) return null;

        const items = validWishlistItems.map((tp: any) => ({
          id: String(tp._id),
          slug: tp.slug || '',
          title: tp.name || 'Certified Luxury Timepiece',
          brand: tp.brand || tp.tagline || 'Horologe Royale Master Selection',
          reference: tp.reference || tp.sku || tp.slug?.toUpperCase() || 'HR-VAULT-REF',
          price: Number(tp.price) || 0,
          image: tp.images?.[0] || '/assets/Rolex Daytona.png',
        }));

        const totalWishlistValue = items.reduce((sum: number, it: any) => sum + it.price, 0);
        const ordersCount =
          orderCountMap.get(String(u._id)) ||
          (u.email ? orderCountMap.get(u.email.toLowerCase().trim()) || 0 : 0);

        return {
          _id: String(u._id),
          type: 'wishlist',
          collectorId: String(u._id),
          customerName: u.name?.trim() || 'Distinguished Collector',
          customerEmail: u.email?.trim() || '',
          customerPhone: resolvedPhone,
          shippingCity: resolvedCity,
          shippingCountry: resolvedCountry,
          itemsCount: items.length,
          totalWishlistValue,
          items,
          ordersCount,
          lastActiveAt: u.updatedAt || u.createdAt || new Date().toISOString(),
        };
      })
      .filter(Boolean);

    // 3. Compute High-Level Metrics
    const abandonedCount = enrichedAbandoned.length;
    const abandonedPipelineValue = enrichedAbandoned.reduce(
      (sum, item) => sum + (item.timepiecePrice || 0),
      0
    );
    const wishlistCollectorsCount = enrichedWishlists.length;
    const wishlistedItemsCount = enrichedWishlists.reduce(
      (sum, col: any) => sum + (col?.itemsCount || 0),
      0
    );

    return NextResponse.json(
      {
        success: true,
        abandonedCheckouts: enrichedAbandoned,
        wishlistCollectors: enrichedWishlists,
        metrics: {
          abandonedCount,
          abandonedPipelineValue,
          wishlistCollectorsCount,
          wishlistedItemsCount,
        },
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to retrieve cart & wishlist activity';
    console.error('[API_ADMIN_CART_ACTIVITY_GET_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

