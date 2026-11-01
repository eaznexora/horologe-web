import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Timepiece } from '@/models/Timepiece';
import { Category } from '@/models/Category';
import { WatchCategory } from '@/models/WatchCategory';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const timepiece = await Timepiece.findOne({ slug: slug.toLowerCase() })
      .populate('category', 'name slug')
      .populate('subCategory', 'name slug')
      .populate('watchCategory', 'name slug')
      .lean();

    if (!timepiece) {
      return NextResponse.json(
        { success: false, message: 'Timepiece not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, timepiece }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/timepiece/[slug]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
