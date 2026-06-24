import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Əlaqə Formundan gələn mesajlar üçün cədvəl
    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Qruplar/Kataloqlar üçün cədvəl
    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);

    // 3. Sertifikatlar üçün cədvəl
    await db.execute(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        image TEXT NOT NULL,
        rank TEXT NOT NULL,
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    // 4. Proyektlər cədvəli
    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        speed TEXT,
        weight TEXT,
        tech_stack TEXT
      )
    `);

    // 5. Sayt Ayarları (Şəkillər, Bio və YENİ CV sütunu)
    await db.execute('DROP TABLE IF EXISTS settings');
    
    await db.execute(`
      CREATE TABLE settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        home_image TEXT,
        contact_image TEXT,
        bio TEXT,
        cv_link TEXT
      )
    `);

    // İlkin defolt məlumatları yeni cv_link xanası ilə bərabər yazırıq
    await db.execute(`
      INSERT INTO settings (id, home_image, contact_image, bio, cv_link) 
      VALUES (
        1, 
        'https://via.placeholder.com/600x800', 
        'https://via.placeholder.com/200x200', 
        'Mən Ömər Məmmədli, müasir veb texnologiyalar və FPV dron sistemləri üzrə ixtisaslaşmış mühəndisəm. Rəqəmsal dünyada sürətli, təhlükəsiz və innovativ həllər qururam.',
        ''
      )
    `);

    return NextResponse.json({ 
      success: true, 
      message: "Mükəmməl! CV dəstəyi daxil olmaqla bütün cədvəllər sıfırdan və xətasız quruldu!" 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Cədvəllər yaradılanda xəta baş verdi." }, { status: 500 });
  }
}
