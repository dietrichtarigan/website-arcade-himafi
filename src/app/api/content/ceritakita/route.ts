import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'ceritakita');
    const files = await fs.readdir(contentDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const content = await Promise.all(
      markdownFiles.map(async (file) => {
        const filePath = path.join(contentDir, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        return {
          slug: file.replace('.md', ''),
          data,
          content
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error reading ceritakita content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read content' },
      { status: 500 }
    );
  }
}
