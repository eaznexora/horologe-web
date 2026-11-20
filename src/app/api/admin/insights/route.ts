import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { InsightArticle } from '@/models/InsightArticle';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatCurrentEditorialDate(): string {
  const d = new Date();
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
  ];
  const month = months[d.getMonth()];
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

// POST: Create a new Insight Article
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const {
      title,
      slug,
      category,
      date,
      readTime,
      excerpt,
      image,
      author,
      pullQuote,
      content,
      featured,
      status,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Article title is required.' },
        { status: 400 }
      );
    }

    if (!category || !category.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category is required.' },
        { status: 400 }
      );
    }

    if (!excerpt || !excerpt.trim()) {
      return NextResponse.json(
        { success: false, error: 'Article excerpt is required.' },
        { status: 400 }
      );
    }

    if (!image || !image.trim()) {
      return NextResponse.json(
        { success: false, error: 'Cover image is required.' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let targetSlug = slug ? slugify(slug) : slugify(title);
    if (!targetSlug) {
      targetSlug = `insight-${Date.now()}`;
    }

    const existingSlug = await InsightArticle.findOne({ slug: targetSlug });
    if (existingSlug) {
      targetSlug = `${targetSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Normalize content
    let normalizedContent: string[] = [];
    if (Array.isArray(content)) {
      normalizedContent = content.map((c) => String(c).trim()).filter(Boolean);
    } else if (typeof content === 'string') {
      normalizedContent = content
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
    }

    const isFeatured = Boolean(featured);

    // If marked as featured, unset previous featured articles
    if (isFeatured) {
      await InsightArticle.updateMany({}, { $set: { featured: false } });
    }

    const article = await InsightArticle.create({
      title: title.trim(),
      slug: targetSlug,
      category: category.trim().toUpperCase(),
      date: date && date.trim() ? date.trim().toUpperCase() : formatCurrentEditorialDate(),
      readTime: readTime && readTime.trim() ? readTime.trim().toUpperCase() : '5 MIN READ',
      excerpt: excerpt.trim(),
      image: image.trim(),
      author: author && author.trim() ? author.trim() : 'Horologe Royale Editorial Desk',
      pullQuote: pullQuote ? pullQuote.trim() : '',
      content: normalizedContent,
      featured: isFeatured,
      status: status === 'draft' ? 'draft' : 'published',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Insight article published successfully.',
        article,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating insight article:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create insight article' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing Insight Article
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const id = body.id || body._id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid article ID is required.' },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {};

    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.slug !== undefined) updateData.slug = slugify(String(body.slug));
    if (body.category !== undefined)
      updateData.category = String(body.category).trim().toUpperCase();
    if (body.date !== undefined)
      updateData.date = String(body.date).trim().toUpperCase();
    if (body.readTime !== undefined)
      updateData.readTime = String(body.readTime).trim().toUpperCase();
    if (body.excerpt !== undefined) updateData.excerpt = String(body.excerpt).trim();
    if (body.image !== undefined) updateData.image = String(body.image).trim();
    if (body.author !== undefined) updateData.author = String(body.author).trim();
    if (body.pullQuote !== undefined)
      updateData.pullQuote = String(body.pullQuote).trim();
    if (body.status !== undefined)
      updateData.status = body.status === 'draft' ? 'draft' : 'published';

    if (body.content !== undefined) {
      if (Array.isArray(body.content)) {
        updateData.content = body.content.map((c: any) => String(c).trim()).filter(Boolean);
      } else if (typeof body.content === 'string') {
        updateData.content = body.content
          .split(/\n\s*\n/)
          .map((p: string) => p.trim())
          .filter(Boolean);
      }
    }

    if (body.featured !== undefined) {
      const isFeatured = Boolean(body.featured);
      updateData.featured = isFeatured;
      if (isFeatured) {
        await InsightArticle.updateMany(
          { _id: { $ne: id } },
          { $set: { featured: false } }
        );
      }
    }

    const updated = await InsightArticle.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Article not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully.',
      article: updated,
    });
  } catch (error: any) {
    console.error('Error updating insight article:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE: Remove an Insight Article
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid article ID is required.' },
        { status: 400 }
      );
    }

    const deleted = await InsightArticle.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Article not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Article removed successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting insight article:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete article' },
      { status: 500 }
    );
  }
}

