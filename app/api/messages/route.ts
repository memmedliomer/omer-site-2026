import { NextResponse } from 'next/server';
import { db } from '../../lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM messages ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, phone, message } = await req.json();
    await db.execute({
      sql: 'INSERT INTO messages (name, phone, message) VALUES (?, ?, ?)',
      args: [name, phone, message]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

// (Yuxarıdakı GET və POST funksiyalarına toxunma, bu ikisini onların altına əlavə et)

// MESAJI SİLMƏK ÜÇÜN
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.execute({
      sql: 'DELETE FROM messages WHERE id = ?',
      args: [id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

// MESAJDA DÜZƏLİŞ ETMƏK ÜÇÜN
export async function PUT(req: Request) {
  try {
    const { id, message } = await req.json();
    await db.execute({
      sql: 'UPDATE messages SET message = ? WHERE id = ?',
      args: [message, id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}
