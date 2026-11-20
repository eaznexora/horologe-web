import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SiteBanner } from '@/models/SiteBanner';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || 'home';

    const banners = await SiteBanner.find({ page }).lean();

    const bannerMap: Record<
      string,
      { desktopUrl: string; mobileUrl: string; linkUrl: string; mediaType: 'image' | 'video' }
    > = {};

    banners.forEach((item: any) => {
      bannerMap[item.slotKey] = {
        desktopUrl: item.desktopUrl || '',
        mobileUrl: item.mobileUrl || '',
        linkUrl: item.linkUrl || '',
        mediaType: item.mediaType || 'image',
      };
    });

    return NextResponse.json(
      {
        success: true,
        page,
        banners: bannerMap,
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (error: any) {
    console.error('Error fetching site banners:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch banners' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { page = 'home', slotKey, desktopUrl, mobileUrl, linkUrl, mediaType = 'image' } = body;

    if (!slotKey) {
      return NextResponse.json(
        { success: false, error: 'slotKey is required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const updated = await SiteBanner.findOneAndUpdate(
      { page, slotKey },
      {
        $set: {
          desktopUrl: (desktopUrl ?? '').trim(),
          mobileUrl: (mobileUrl ?? '').trim(),
          linkUrl: (linkUrl ?? '').trim(),
          mediaType: mediaType === 'video' ? 'video' : 'image',
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        banner: updated,
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (error: any) {
    console.error('Error saving site banner:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save banner' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || 'home';
    const slotKey = searchParams.get('slotKey');

    if (!slotKey) {
      return NextResponse.json(
        { success: false, error: 'slotKey is required to reset a banner' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    await SiteBanner.findOneAndDelete({ page, slotKey });

    return NextResponse.json(
      {
        success: true,
        message: `Banner slot ${slotKey} reset to default`,
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (error: any) {
    console.error('Error resetting site banner:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset banner' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
