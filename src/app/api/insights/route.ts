import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { InsightCategory } from '@/models/InsightCategory';
import { InsightArticle } from '@/models/InsightArticle';
import { INSIGHTS_ARTICLES } from '@/data/insightsArticles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // 1. One-Time Auto-Seed Check
    const [categoryCount, articleCount] = await Promise.all([
      InsightCategory.countDocuments(),
      InsightArticle.countDocuments(),
    ]);

    if (categoryCount === 0 && articleCount === 0) {
      console.log('[AUTO-SEED] Seeding default insight categories and articles...');
      const defaultCategories = [
        { name: 'WATCH GUIDES', slug: 'watch-guides', rank: 1 },
        { name: 'CRAFTSMANSHIP', slug: 'craftsmanship', rank: 2 },
        { name: 'BRAND JOURNAL', slug: 'brand-journal', rank: 3 },
        { name: 'COLLECTORS', slug: 'collectors', rank: 4 },
      ];
      await InsightCategory.insertMany(defaultCategories);

      const defaultArticles = INSIGHTS_ARTICLES.map((art) => ({
        title: art.title,
        slug: art.slug,
        category: art.category,
        date: art.date,
        readTime: art.readTime,
        excerpt: art.excerpt,
        image: art.image,
        author: art.author,
        pullQuote: art.pullQuote,
        content: art.content,
        featured: !!art.featured,
        status: 'published',
      }));
      await InsightArticle.insertMany(defaultArticles);
    }

    // 2. Fetch Categories
    const categories = await InsightCategory.find()
      .sort({ rank: 1, createdAt: 1 })
      .lean();

    // 3. Fetch Articles (Published by default, or all if includeDrafts=1)
    const { searchParams } = new URL(request.url);
    const includeDrafts =
      searchParams.get('includeDrafts') === '1' ||
      searchParams.get('admin') === 'true';

    const filter: Record<string, any> = includeDrafts
      ? {}
      : { status: 'published' };

    const articles = await InsightArticle.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: articles.length,
        categories,
        articles,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching insights from MongoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch insights',
      },
      { status: 500 }
    );
  }
}

