import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM categories');
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

// YENİ: KATALOQ SİLMƏK ÜÇÜN DELETE FUNKSİYASI
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    
    // 1. Öncə bu kataloqa bağlı olan sertifikatların category_id-sini NULL (Fərdi) edirik ki, sistem çökməsin
    await db.execute({
      sql: 'UPDATE certificates SET category_id = NULL WHERE category_id = ?',
      args: [id]
    });

    // 2. İndi isə kataloqun özünü tamamilə silirik
    await db.execute({
      sql: 'DELETE FROM categories WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}
