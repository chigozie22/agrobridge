import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// The combo images directory doesn't change at runtime — cache at build
// instead of Next 15+'s new default of re-reading the filesystem per request.
export const dynamic = 'force-static'

export async function GET() {
  const dir = path.join(process.cwd(), 'public', 'images', 'combos')
  try {
    const files = fs.readdirSync(dir).filter(f =>
      /\.(jpg|jpeg|png|webp|gif)$/i.test(f)
    )
    return NextResponse.json({ images: files })
  } catch {
    return NextResponse.json({ images: [] })
  }
}
