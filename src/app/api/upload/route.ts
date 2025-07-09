import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('[UPLOAD API] Starting file upload');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('[UPLOAD API] File received:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}${extension}`;
    const filePath = path.join(uploadsDir, filename);

    console.log('[UPLOAD API] Saving to:', filePath);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    
    console.log('[UPLOAD API] File saved successfully:', publicUrl);

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: publicUrl,
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('[UPLOAD API] Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
