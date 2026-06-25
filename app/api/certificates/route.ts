import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // ZİREHLİ MƏNTİQ: Sertifikatları çəkəndə aid olduqları kataloqun adını da birlikdə çəkirik!
    const result = await db.execute(`
      SELECT certificates.*, categories.name AS category_name 
      FROM certificates 
      LEFT JOIN categories ON certificates.category_id = categories.id
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, image, rank, category_id } = await req.json();
    await db.execute({
      sql: 'INSERT INTO certificates (title, image, rank, category_id) VALUES (?, ?, ?, ?)',
      args: [title, image, rank, category_id === 'none' ? null : category_id]
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
      sql: 'DELETE FROM certificates WHERE id = ?',
      args: [id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

// DÜZƏLİŞ ETMƏK ÜÇÜN (PUT) FUNKSİYASI
export async function PUT(req: Request) {
  try {
    const { id, title, image, rank, category_id } = await req.json();
    await db.execute({
      sql: 'UPDATE certificates SET title = ?, image = ?, rank = ?, category_id = ? WHERE id = ?',
      args: [title, image, rank, category_id === 'none' ? null : category_id, id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}
