import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM settings WHERE id = 1');
    return NextResponse.json(result.rows[0] || {});
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { home_image, contact_image, bio } = await req.json();
    await db.execute({
      sql: 'UPDATE settings SET home_image = ?, contact_image = ?, bio = ? WHERE id = 1',
      args: [home_image, contact_image, bio]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}