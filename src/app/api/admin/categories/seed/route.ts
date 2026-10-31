import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Category } from '@/models/Category';

export async function POST() {
  try {
    await connectToDatabase();

    // Clear existing to re-seed exact structure
    await Category.deleteMany({});

    const seedData = [
      {
        name: "Pre-Owned",
        slug: "pre-owned",
        rank: 1,
        isTopCategory: true,
        status: "active",
        subcategories: ["Men's Collection", "Women's Collection"],
      },
      {
        name: "New Watches",
        slug: "new-watches",
        rank: 2,
        isTopCategory: false,
        status: "active",
        subcategories: ["Men's Collection", "Women's Collection"],
      },
      {
        name: "Vintage Watches",
        slug: "vintage-watches",
        rank: 3,
        isTopCategory: false,
        status: "active",
        subcategories: ["Men's Collection", "Women's Collection"],
      },
      {
        name: "Jewellery",
        slug: "jewellery",
        rank: 4,
        isTopCategory: false,
        status: "active",
        subcategories: [],
      },
      {
        name: "Sold Watches",
        slug: "sold-watches",
        rank: 5,
        isTopCategory: false,
        status: "active",
        subcategories: [],
      },
    ];

    for (const item of seedData) {
      const parent: any = await Category.create({
        name: item.name,
        slug: item.slug,
        parentId: null,
        rank: item.rank,
        isTopCategory: item.isTopCategory,
        status: item.status as "active" | "inactive",
      });

      let subRank = 1;
      for (const subName of item.subcategories) {
        const subSlug = `${parent.slug}-${subName
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')}`;

        await Category.create({
          name: subName,
          slug: subSlug,
          parentId: parent._id,
          rank: subRank++,
          isTopCategory: false,
          status: "active",
        });
      }
    }

    const totalCount = await Category.countDocuments();

    return NextResponse.json({
      success: true,
      message: "Categories seeded successfully",
      count: totalCount,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
