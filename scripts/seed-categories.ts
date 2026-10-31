import mongoose from 'mongoose';
import dns from 'node:dns';
import { Category } from '../src/models/Category';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  console.log("Clearing existing categories...");
  await Category.deleteMany({});

  const seedData = [
    {
      name: "Pre-Owned",
      slug: "pre-owned",
      rank: 1,
      isTopCategory: true,
      status: "active" as const,
      subcategories: ["Men's Collection", "Women's Collection"],
    },
    {
      name: "New Watches",
      slug: "new-watches",
      rank: 2,
      isTopCategory: false,
      status: "active" as const,
      subcategories: ["Men's Collection", "Women's Collection"],
    },
    {
      name: "Vintage Watches",
      slug: "vintage-watches",
      rank: 3,
      isTopCategory: false,
      status: "active" as const,
      subcategories: ["Men's Collection", "Women's Collection"],
    },
    {
      name: "Jewellery",
      slug: "jewellery",
      rank: 4,
      isTopCategory: false,
      status: "active" as const,
      subcategories: [],
    },
    {
      name: "Sold Watches",
      slug: "sold-watches",
      rank: 5,
      isTopCategory: false,
      status: "active" as const,
      subcategories: [],
    },
  ];

  for (const item of seedData) {
    const parent = await Category.create({
      name: item.name,
      slug: item.slug,
      parentId: null,
      rank: item.rank,
      isTopCategory: item.isTopCategory,
      status: item.status,
    });
    console.log(`Created parent category: ${parent.name}`);

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
      console.log(`  - Created subcategory: ${subName}`);
    }
  }

  const total = await Category.countDocuments();
  console.log(`Seeding complete. Total categories: ${total}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
