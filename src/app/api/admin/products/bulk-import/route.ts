import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import Papa from 'papaparse';
import { connectToDatabase } from '@/lib/mongodb';
import { Timepiece, IPillar, IKeySpec } from '@/models/Timepiece';
import { Category } from '@/models/Category';
import { WatchCategory } from '@/models/WatchCategory';

export const dynamic = 'force-dynamic';
// Max execution time for large imports
export const maxDuration = 120;

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parsePrice(raw: any): number | null {
  if (raw === undefined || raw === null) return null;
  const cleaned = String(raw).replace(/[^0-9.]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

const DEFAULT_PILLARS: IPillar[] = [
  {
    title: 'AUTHENTICATED PROVENANCE',
    description: 'Every timepiece is meticulously cataloged and verified through master horological inspection.',
  },
  {
    title: 'MASTER HOROLOGIST INSPECTION',
    description: 'Multi-point mechanical calibration guaranteeing precision timing and archival authenticity.',
  },
  {
    title: 'INSURED ARMORED DELIVERY',
    description: 'Priority white-glove transport with end-to-end discrete transit security across destinations.',
  },
];

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    void Category;
    void WatchCategory;

    const formData = await req.formData();
    const csvFile = formData.get('csvFile') as File | null;
    const imagesZip = formData.get('imagesZip') as File | null;

    if (!csvFile) {
      return NextResponse.json(
        { success: false, error: 'A valid .csv spreadsheet file is required' },
        { status: 400 }
      );
    }

    // Step A: Extract images from ZIP archive into lookup map
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const zipImageMap = new Map<string, string>();
    let imagesExtractedCount = 0;

    if (imagesZip && imagesZip.size > 0) {
      try {
        const zipArrayBuffer = await imagesZip.arrayBuffer();
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(zipArrayBuffer);

        const fileEntries = Object.values(zipContent.files);
        for (const entry of fileEntries) {
          if (entry.dir) continue;
          const entryName = entry.name;

          // Ignore metadata, Mac artifacts, and hidden dotfiles
          if (
            entryName.includes('__MACOSX') ||
            entryName.startsWith('.') ||
            path.basename(entryName).startsWith('.')
          ) {
            continue;
          }

          const ext = path.extname(entryName).toLowerCase();
          if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
            continue;
          }

          const baseFilename = path.basename(entryName);
          const sanitizedBase = baseFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
          const safeFilename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${sanitizedBase}`;
          const buffer = await entry.async('nodebuffer');
          const targetPath = path.join(uploadDir, safeFilename);

          await fs.promises.writeFile(targetPath, buffer);

          const mappedUrl = `/api/media/products/${safeFilename}`;
          // Store both original case and lowercase for resilient matching
          zipImageMap.set(baseFilename.toLowerCase(), mappedUrl);
          imagesExtractedCount++;
        }
      } catch (zipErr: any) {
        console.error('Failed to parse images ZIP archive:', zipErr);
      }
    }

    // Step B: Parse CSV spreadsheet
    const csvText = await csvFile.text();
    const parsed = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });

    if (parsed.errors && parsed.errors.length > 0 && parsed.data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to parse CSV spreadsheet: ${parsed.errors[0].message}`,
        },
        { status: 400 }
      );
    }

    const rows = parsed.data;
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'The provided CSV spreadsheet contains no data rows' },
        { status: 400 }
      );
    }

    // Pre-fetch categories for fast in-memory matching
    const allCategories = await Category.find({}).lean();
    const allWatchCategories = await WatchCategory.find({}).lean();
    const defaultParentCategory =
      allCategories.find((c: any) => !c.parentId && c.status === 'active') ||
      allCategories[0];

    const unmatchedImagesSet = new Set<string>();
    const errors: Array<{ row: number; name: string; reason: string }> = [];
    const usedSlugs = new Set<string>();
    let createdCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowIndex = i + 2; // Row number in CSV editor (1-based + 1 for header)
      const rawName = (row.name || row.title || '').trim();

      if (!rawName) {
        errors.push({ row: rowIndex, name: 'Empty Name', reason: 'Missing required "name" column' });
        continue;
      }

      const parsedPrice = parsePrice(row.price);
      if (parsedPrice === null || parsedPrice <= 0) {
        errors.push({
          row: rowIndex,
          name: rawName,
          reason: `Invalid or missing price "${row.price}"`,
        });
        continue;
      }

      const parsedOriginalPrice = parsePrice(row.originalPrice);

      // Generate unique slug
      const customSlugInput = (row.canonicalSlug || row.slug || '').trim();
      let baseSlug = customSlugInput
        ? generateSlug(customSlugInput)
        : generateSlug(rawName);
      if (!baseSlug) baseSlug = `timepiece-${Date.now()}`;
      let finalSlug = baseSlug;
      let counter = 1;
      while (usedSlugs.has(finalSlug) || (await Timepiece.findOne({ slug: finalSlug }))) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      usedSlugs.add(finalSlug);

      // Resolve images column (split by pipe '|')
      const rawImageTokens = (row.images || '')
        .split('|')
        .map((t) => t.trim())
        .filter(Boolean);

      const normalizedImages: string[] = [];
      for (const token of rawImageTokens) {
        if (normalizedImages.length >= 4) break;

        const baseToken = path.basename(token).toLowerCase();
        if (zipImageMap.has(baseToken)) {
          normalizedImages.push(zipImageMap.get(baseToken)!);
        } else if (
          token.startsWith('/') ||
          token.startsWith('http://') ||
          token.startsWith('https://')
        ) {
          normalizedImages.push(token);
        } else {
          unmatchedImagesSet.add(token);
        }
      }

      // Pad missing slots up to 4 with default logo
      while (normalizedImages.length < 4) {
        normalizedImages.push('/logo.png');
      }

      // Match category triad
      let assignedCategory: any = defaultParentCategory?._id || null;
      let assignedSubCategory: any = null;
      let assignedWatchCategory: any = null;

      const rawCat = (row.category || '').trim().toLowerCase();
      if (rawCat) {
        const matched = allCategories.find(
          (c: any) =>
            (c.name && c.name.toLowerCase() === rawCat) ||
            (c.slug && c.slug.toLowerCase() === rawCat)
        );
        if (matched) {
          if (matched.parentId) {
            assignedCategory = matched.parentId;
            assignedSubCategory = matched._id;
          } else {
            assignedCategory = matched._id;
          }
        }
      }

      // Match explicit subCategory if provided
      const rawSubCat = (row.subCategory || '').trim().toLowerCase();
      if (rawSubCat) {
        let matchedSub = allCategories.find(
          (c: any) =>
            c.parentId &&
            String(c.parentId) === String(assignedCategory) &&
            ((c.name && c.name.toLowerCase() === rawSubCat) ||
              (c.slug && c.slug.toLowerCase() === rawSubCat))
        );
        if (!matchedSub) {
          matchedSub = allCategories.find(
            (c: any) =>
              c.parentId &&
              ((c.name && c.name.toLowerCase() === rawSubCat) ||
                (c.slug && c.slug.toLowerCase() === rawSubCat))
          );
        }
        if (matchedSub) {
          assignedSubCategory = matchedSub._id;
        }
      }

      // Match watchCategory (Filter Pill)
      const rawWatchCat = (row.watchCategory || '').trim().toLowerCase();
      if (rawWatchCat) {
        const matchedWatchCat = allWatchCategories.find(
          (w: any) =>
            (w.name && w.name.toLowerCase() === rawWatchCat) ||
            (w.slug && w.slug.toLowerCase() === rawWatchCat)
        );
        if (matchedWatchCat) {
          assignedWatchCategory = matchedWatchCat._id;
        } else {
          try {
            const newSlug = generateSlug(row.watchCategory.trim());
            const createdWatchCat = await WatchCategory.create({
              name: row.watchCategory.trim(),
              slug: newSlug || `watch-cat-${Date.now()}`,
              rank: allWatchCategories.length + 1,
              status: 'active',
            });
            allWatchCategories.push(createdWatchCat.toObject());
            assignedWatchCategory = createdWatchCat._id;
          } catch {
            // Silently fallback without failing row
          }
        }
      }

      // Parse minorSpecs (up to 3)
      const minorSpecs = (row.minorSpecs || '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);

      // Parse keySpecs (format: "LABEL: VALUE | LABEL: VALUE")
      const keySpecs: IKeySpec[] = [];
      const specTokens = (row.keySpecs || '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);

      for (const specToken of specTokens) {
        const colonIdx = specToken.indexOf(':');
        if (colonIdx > 0) {
          const label = specToken.slice(0, colonIdx).trim();
          const value = specToken.slice(colonIdx + 1).trim();
          if (label && value) {
            keySpecs.push({ label, value });
          }
        }
      }

      // Parse pillars
      const rowPillars: IPillar[] = [];
      if (row.pillar1Title || row.pillar1Desc) {
        rowPillars.push({
          title: (row.pillar1Title || '').trim(),
          description: (row.pillar1Desc || '').trim(),
        });
      }
      if (row.pillar2Title || row.pillar2Desc) {
        rowPillars.push({
          title: (row.pillar2Title || '').trim(),
          description: (row.pillar2Desc || '').trim(),
        });
      }
      if (row.pillar3Title || row.pillar3Desc) {
        rowPillars.push({
          title: (row.pillar3Title || '').trim(),
          description: (row.pillar3Desc || '').trim(),
        });
      }

      const finalPillars = rowPillars.length > 0 ? rowPillars : DEFAULT_PILLARS;

      // Status
      const rawStatus = (row.status || 'active').trim().toLowerCase();
      const finalStatus = ['active', 'draft', 'sold'].includes(rawStatus)
        ? (rawStatus as 'active' | 'draft' | 'sold')
        : 'active';

      // SEO
      const rawKeywords = row.focusKeywords || row.keywords || '';
      const seo = {
        metaTitle: (row.metaTitle || '').trim() || `${rawName} | Horologe Royale`,
        metaDescription: (
          (row.metaDescription || '').trim() ||
          row.tagline ||
          `Discover the ${rawName} at Horologe Royale. Certified luxury timepieces with verified provenance.`
        ).trim(),
        canonicalUrl: `/timepiece/${finalSlug}`,
        keywords: rawKeywords
          .split(',')
          .map((k: string) => k.trim())
          .filter(Boolean),
      };

      try {
        await Timepiece.create({
          name: rawName,
          slug: finalSlug,
          brand: (row.brand || '').trim(),
          model: (row.model || '').trim(),
          reference: (row.reference || '').trim(),
          sku: (row.sku || '').trim(),
          images: normalizedImages,
          minorSpecs,
          category: assignedCategory,
          subCategory: assignedSubCategory,
          watchCategory: assignedWatchCategory,
          conditionBadge: (row.conditionBadge || 'Preowned').trim(),
          gradeBadge: (row.gradeBadge || 'Excellent Condition').trim(),
          scopeBadge: (row.scopeBadge || 'Full Set').trim(),
          tagline: (row.tagline || '').trim(),
          price: parsedPrice,
          originalPrice: parsedOriginalPrice && parsedOriginalPrice > 0 ? parsedOriginalPrice : undefined,
          heritageHeadline: (row.heritageHeadline || '').trim(),
          heritageStory: (row.heritageStory || '').trim(),
          pillars: finalPillars,
          keySpecs,
          seo,
          status: finalStatus,
        });

        createdCount++;
      } catch (insertErr: any) {
        errors.push({
          row: rowIndex,
          name: rawName,
          reason: insertErr.message || 'Database insertion error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      createdCount,
      imagesExtractedCount,
      unmatchedImages: Array.from(unmatchedImagesSet),
      errors,
    });
  } catch (error: any) {
    console.error('[API_BULK_IMPORT_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Bulk import failed' },
      { status: 500 }
    );
  }
}

