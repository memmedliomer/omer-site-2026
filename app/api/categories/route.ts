import { NextResponse } from 'next/server';
import { db } from '../../lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM categories ORDER BY id DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    await db.execute({
      sql: 'INSERT INTO categories (name) VALUES (?)',
      args: [name]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}
