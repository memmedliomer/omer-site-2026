import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM settings WHERE id = 1');
    return NextResponse.json(result.rows[0] || {});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { home_image, contact_image, bio, cv_link } = await req.json();
    await db.execute({
      sql: 'UPDATE settings SET home_image = ?, contact_image = ?, bio = ?, cv_link = ? WHERE id = 1',
      args: [home_image, contact_image, bio, cv_link]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}
