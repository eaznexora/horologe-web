import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'video/mp4',
  'video/webm',
]);

const EXTENSION_MAP: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file payload provided.' }, { status: 400 });
    }

    const mimeType = file.type;
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid media format (${mimeType || 'unknown'}). Permitted formats: PNG, JPG, WEBP, MP4, WEBM.`,
        },
        { status: 400 }
      );
    }

    // Support subfolder: 'insights' or default 'banners'
    const folderParam = (formData.get('folder') as string | null)?.toLowerCase().trim();
    const subfolder = folderParam === 'insights' ? 'insights' : 'banners';

    // Ensure public/uploads/[subfolder] directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subfolder);
    await fs.mkdir(uploadDir, { recursive: true });

    // Sanitize file name
    const originalName = file.name || `${subfolder}_upload`;
    const originalExt = path.extname(originalName).toLowerCase();
    const resolvedExt = originalExt || EXTENSION_MAP[mimeType] || '.bin';
    const baseName = path.basename(originalName, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFilename = `${Date.now()}-${baseName}${resolvedExt}`;

    const targetPath = path.join(uploadDir, safeFilename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(targetPath, buffer);

    const mediaUrl = `/api/media/${subfolder}/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: mediaUrl,
      filename: safeFilename,
      mimeType,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Failed to process banner media upload:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Media upload failed' },
      { status: 500 }
    );
  }
}

