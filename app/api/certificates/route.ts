import { NextResponse } from 'next/server';
import { db } from '../../lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    // Sertifikatları və aid olduqları qrupun adını bazadan çəkirik
    const result = await db.execute(`
      SELECT certificates.*, categories.name as category_name 
      FROM certificates 
      LEFT JOIN categories ON certificates.category_id = categories.id 
      ORDER BY certificates.id DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, image, rank, category_id } = await req.json();
    
    // Əgər qrup seçilməyibsə (Fərdi sertifikatdırsa), bazaya NULL göndəririk
    const finalCategoryId = category_id === 'none' ? null : category_id;

    await db.execute({
      sql: 'INSERT INTO certificates (title, image, rank, category_id) VALUES (?, ?, ?, ?)',
      args: [title, image, rank, finalCategoryId]
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
