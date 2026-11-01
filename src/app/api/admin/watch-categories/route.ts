import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { WatchCategory } from '@/models/WatchCategory';

const SEED_WATCH_CATEGORIES = [
  { name: 'ROLEX', slug: 'rolex', rank: 1, status: 'active' },
  { name: 'OMEGA', slug: 'omega', rank: 2, status: 'active' },
  { name: 'CASIO', slug: 'casio', rank: 3, status: 'active' },
  { name: 'EAZ NEXORA', slug: 'eaz-nexora', rank: 4, status: 'active' },
];

// GET: Returns active categories ordered by rank (or all if ?admin=true)
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Auto-seed initial watch categories if collection is empty
    const count = await WatchCategory.countDocuments();
    if (count === 0) {
      await WatchCategory.insertMany(SEED_WATCH_CATEGORIES);
    }

    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true' || searchParams.get('all') === 'true';

    const filter: any = isAdmin ? {} : { status: 'active' };
    const categories = await WatchCategory.find(filter).sort({ rank: 1, createdAt: 1 }).lean();

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error('Error fetching watch categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch watch categories' },
      { status: 500 }
    );
  }
}

// POST: Creates new watch category with auto-slug
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, rank } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const existing = await WatchCategory.findOne({ slug: baseSlug });
    const slug = existing ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

    const newCategory = await WatchCategory.create({
      name: name.trim(),
      slug,
      rank: isNaN(Number(rank)) ? 0 : Math.max(0, Number(rank)),
      status: 'active',
    });

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating watch category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Update rank, status, or name
export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const { id, rank, status, name } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof rank === 'number') updateData.rank = Math.max(0, rank);
    if (status) updateData.status = status;
    if (name) updateData.name = name.trim();

    const updated = await WatchCategory.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, category: updated }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating watch category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove watch category
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }

    await WatchCategory.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Watch category removed' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting watch category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
