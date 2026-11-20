import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { InsightCategory } from '@/models/InsightCategory';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET: Retrieve all Insight Categories
export async function GET() {
  try {
    await connectToDatabase();
    const categories = await InsightCategory.find()
      .sort({ rank: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: any) {
    console.error('Error fetching insight categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST: Create a new Insight Category
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, rank } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category name is required.' },
        { status: 400 }
      );
    }

    const normalizedName = name.trim().toUpperCase();
    const slug = slugify(normalizedName);

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Invalid category name provided.' },
        { status: 400 }
      );
    }

    // Check for existing duplicate name or slug
    const existing = await InsightCategory.findOne({
      $or: [{ name: normalizedName }, { slug }],
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Category "${normalizedName}" already exists.`,
        },
        { status: 409 }
      );
    }

    const category = await InsightCategory.create({
      name: normalizedName,
      slug,
      rank: typeof rank === 'number' ? rank : 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully.',
        category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating insight category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

// DELETE: Remove an Insight Category
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid category ID is required.' },
        { status: 400 }
      );
    }

    const deleted = await InsightCategory.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Category not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category removed successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting insight category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}

