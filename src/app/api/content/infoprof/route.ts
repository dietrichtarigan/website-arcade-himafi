import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'infoprof');
    
    // Ensure directory exists
    try {
      await fs.access(contentDir);
    } catch {
      await fs.mkdir(contentDir, { recursive: true });
    }
    
    const files = await fs.readdir(contentDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const content = await Promise.all(
      markdownFiles.map(async (file) => {
        const filePath = path.join(contentDir, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        return {
          slug: file.replace('.md', ''),
          ...data,
          content,
          filePath: file
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error reading infoprof content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read content' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Add proper error handling and logging
    console.log('[API] Starting POST request to infoprof');
    
    let body;
    try {
      body = await request.json();
      console.log('[API] Request body parsed:', Object.keys(body));
    } catch (parseError) {
      console.error('[API] Failed to parse JSON:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const {
      judul,
      kategori,
      deskripsi,
      konten,
      link_utama,
      kontak_email,
      sumber,
      tags,
      deadline,
      poster_url,
      arsip = false
    } = body;

    // Validate required fields (kontak dan sumber sekarang opsional)
    if (!judul || !kategori || !deskripsi) {
      console.log('[API] Missing required fields');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: judul, kategori, deskripsi are required',
          received: { judul: !!judul, kategori: !!kategori, deskripsi: !!deskripsi }
        },
        { status: 400 }
      );
    }

    const contentDir = path.join(process.cwd(), 'content', 'infoprof');
    console.log('[API] Content directory:', contentDir);
    
    // Ensure directory exists
    try {
      await fs.access(contentDir);
    } catch {
      console.log('[API] Creating directory:', contentDir);
      await fs.mkdir(contentDir, { recursive: true });
    }

    // Create filename from title and current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const slug = judul.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    const filename = `${slug}-${dateStr}.md`;
    const filePath = path.join(contentDir, filename);
    
    console.log('[API] Generated filename:', filename);

    // Create frontmatter
    const frontmatter = {
      judul,
      kategori,
      tanggal_post: now.toISOString(),
      deskripsi,
      ...(sumber && { sumber }),
      ...(link_utama && { link_utama }),
      ...(kontak_email && { kontak_email }),
      ...(poster_url && { poster_url }),
      ...(tags && Array.isArray(tags) && tags.length > 0 && { tags }),
      ...(deadline && { deadline }),
      arsip
    };

    console.log('[API] Frontmatter created:', Object.keys(frontmatter));

    // Create markdown content
    const markdownContent = matter.stringify(konten || '', frontmatter);

    // Write file
    try {
      await fs.writeFile(filePath, markdownContent, 'utf8');
      console.log('[API] File written successfully:', filePath);
    } catch (writeError) {
      console.error('[API] Failed to write file:', writeError);
      return NextResponse.json(
        { success: false, error: 'Failed to write file to disk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Content created successfully',
      filename,
      slug,
      data: frontmatter
    });

  } catch (error) {
    console.error('[API] Unexpected error in POST /api/content/infoprof:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
