import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Timepiece } from '@/models/Timepiece';
import { Category } from '@/models/Category';
import { WatchCategory } from '@/models/WatchCategory';

// Helper to generate a clean URL-friendly slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET: Retrieve list of products with filters, sorting, and real-time metrics
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Ensure models are registered in mongoose instance
    void Category;
    void WatchCategory;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const watchCategory = searchParams.get('watchCategory');

    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (watchCategory && watchCategory !== 'all') {
      filter.watchCategory = watchCategory;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'price_high') sortOption = { price: -1 };
    if (sort === 'price_low') sortOption = { price: 1 };

    const [products, total, active, draft, sold] = await Promise.all([
      Timepiece.find(filter)
        .populate('category', 'name slug')
        .populate('subCategory', 'name slug')
        .populate('watchCategory', 'name slug')
        .sort(sortOption)
        .lean(),
      Timepiece.countDocuments({}),
      Timepiece.countDocuments({ status: 'active' }),
      Timepiece.countDocuments({ status: 'draft' }),
      Timepiece.countDocuments({ status: 'sold' }),
    ]);

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
      metrics: { total, active, lowStock: draft, outOfStock: sold },
    });
  } catch (error: any) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST: Create or register a new timepiece
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    void Category;
    void WatchCategory;

    const body = await req.json();

    const {
      name,
      slug: customSlug,
      images,
      minorSpecs,
      category,
      subCategory,
      watchCategory,
      conditionBadge,
      gradeBadge,
      scopeBadge,
      tagline,
      price,
      originalPrice,
      heritageHeadline,
      heritageStory,
      pillars,
      keySpecs,
      seo,
      status,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Product name is required' },
        { status: 400 }
      );
    }

    if (price === undefined || price === null || isNaN(Number(price))) {
      return NextResponse.json(
        { success: false, error: 'Valid selling price is required' },
        { status: 400 }
      );
    }

    // Calculate unique slug
    let baseSlug = (customSlug && customSlug.trim())
      ? generateSlug(customSlug)
      : generateSlug(name);
    
    if (!baseSlug) {
      baseSlug = `timepiece-${Date.now()}`;
    }

    let finalSlug = baseSlug;
    let counter = 1;
    while (await Timepiece.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Normalize images: exactly 4 slots, fallback missing or empty entries to '/logo.png'
    const rawImages: string[] = Array.isArray(images) ? images : [];
    const normalizedImages: string[] = [];
    for (let i = 0; i < 4; i++) {
      const url = rawImages[i]?.trim();
      normalizedImages.push(url && url.length > 0 ? url : '/logo.png');
    }

    // Normalize minor specs (up to 3 items)
    const normalizedMinorSpecs: string[] = (
      Array.isArray(minorSpecs) ? minorSpecs : []
    )
      .map((s: string) => s?.trim())
      .filter((s: string) => Boolean(s))
      .slice(0, 3);

    // Normalize pillars (up to 3 items)
    const normalizedPillars = (Array.isArray(pillars) ? pillars : [])
      .map((p: any) => ({
        title: (p.title || '').trim(),
        description: (p.description || '').trim(),
      }))
      .filter((p: any) => p.title || p.description)
      .slice(0, 3);

    // Normalize key specs
    const normalizedKeySpecs = (Array.isArray(keySpecs) ? keySpecs : [])
      .map((k: any) => ({
        label: (k.label || '').trim(),
        value: (k.value || '').trim(),
      }))
      .filter((k: any) => k.label && k.value);

    // Normalize SEO
    const normalizedSeo = {
      metaTitle: seo?.metaTitle?.trim() || `${name} | Horologe Royale`,
      metaDescription:
        seo?.metaDescription?.trim() ||
        tagline ||
        `Discover the ${name} at Horologe Royale. Certified luxury timepieces with verified provenance.`,
      canonicalUrl: seo?.canonicalUrl?.trim() || `/timepiece/${finalSlug}`,
      keywords: Array.isArray(seo?.keywords)
        ? seo.keywords
        : typeof seo?.focusKeywords === 'string'
        ? seo.focusKeywords
            .split(',')
            .map((k: string) => k.trim())
            .filter(Boolean)
        : [],
    };

    // If category is not provided or invalid ObjectId, fall back to first active Category
    let assignedCategory = category;
    if (!assignedCategory) {
      const defaultCategory = await Category.findOne({ parentId: null, status: 'active' });
      if (defaultCategory) {
        assignedCategory = defaultCategory._id;
      }
    }

    const timepiece = await Timepiece.create({
      name: name.trim(),
      slug: finalSlug,
      images: normalizedImages,
      minorSpecs: normalizedMinorSpecs,
      category: assignedCategory,
      subCategory: subCategory || null,
      watchCategory: watchCategory || null,
      conditionBadge: (conditionBadge || 'Preowned').trim(),
      gradeBadge: (gradeBadge || 'Excellent Condition').trim(),
      scopeBadge: (scopeBadge || 'Full Set').trim(),
      tagline: (tagline || '').trim(),
      price: Number(price),
      originalPrice:
        originalPrice && !isNaN(Number(originalPrice))
          ? Number(originalPrice)
          : undefined,
      heritageHeadline: (heritageHeadline || '').trim(),
      heritageStory: (heritageStory || '').trim(),
      pillars: normalizedPillars,
      keySpecs: normalizedKeySpecs,
      seo: normalizedSeo,
      status: ['active', 'draft', 'sold'].includes(status) ? status : 'active',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Timepiece successfully registered in vault',
        timepiece,
        slug: finalSlug,
        href: `/timepiece/${finalSlug}`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in POST /api/admin/products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a timepiece from the vault
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Valid timepiece ID is required' },
        { status: 400 }
      );
    }

    const deleted = await Timepiece.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Timepiece not found in vault' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Timepiece removed from vault' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
