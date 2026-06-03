import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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
