import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Category } from '@/models/Category';

// GET: Fetch category tree (Primary categories with populated subcategories)
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true' || searchParams.get('all') === 'true';

    const filter: any = isAdmin ? {} : { status: 'active' };
    const categories = await Category.find(filter).sort({ rank: 1, createdAt: 1 }).lean();

    // Separate into parent and subcategories
    const parents = categories.filter((c: any) => !c.parentId);
    const structured = parents.map((parent: any) => ({
      ...parent,
      subcategories: categories
        .filter((sub: any) => String(sub.parentId) === String(parent._id))
        .sort((a: any, b: any) => (a.rank || 0) - (b.rank || 0)),
    }));

    return NextResponse.json({ success: true, categories: structured, flat: categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST: Create a new Category or Sub-category
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, parentId, rank, isTopCategory } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const newCategory = await Category.create({
      name: name.trim(),
      slug: `${slug}-${Date.now().toString().slice(-4)}`, // Ensure uniqueness
      parentId: parentId || null,
      rank: isNaN(Number(rank)) ? 0 : Math.max(0, Number(rank)),
      isTopCategory: Boolean(isTopCategory),
      status: 'active',
    });

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Toggle Homepage or update rank/status/name
export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const { id, isTopCategory, rank, status, name } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof isTopCategory === 'boolean') updateData.isTopCategory = isTopCategory;
    if (typeof rank === 'number') updateData.rank = Math.max(0, rank);
    if (status) updateData.status = status;
    if (name) updateData.name = name;

    const updated = await Category.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, category: updated }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove category
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }

    // Delete category and any associated children
    await Category.deleteMany({ $or: [{ _id: id }, { parentId: id }] });

    return NextResponse.json({ success: true, message: 'Category removed' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
