import { NextResponse } from 'next/server';
import { db } from '../../lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM projects ORDER BY id DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, image, speed, weight, tech_stack } = await req.json();
    await db.execute({
      sql: 'INSERT INTO projects (title, description, image, speed, weight, tech_stack) VALUES (?, ?, ?, ?, ?, ?)',
      args: [title, description, image, speed, weight, tech_stack]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.execute({
      sql: 'DELETE FROM projects WHERE id = ?',
      args: [id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}
