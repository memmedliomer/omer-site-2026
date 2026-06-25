import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT,
        os TEXT,
        device TEXT,
        browser TEXT,
        isp TEXT,
        screen TEXT,
        current_page TEXT,
        first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const result = await db.execute('SELECT * FROM visitors ORDER BY last_active DESC LIMIT 100');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT,
        os TEXT,
        device TEXT,
        browser TEXT,
        isp TEXT,
        screen TEXT,
        current_page TEXT,
        first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Xətaya düşməmək üçün body-ni təhlükəsiz oxuyuruq
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }
    
    const { screen, page } = body;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Gizli IP';
    const ua = req.headers.get('user-agent') || '';
    
    let os = 'Naməlum';
    let device = 'Kompüter';

    if (ua.includes('Win')) {
      os = 'Windows';
    } else if (ua.includes('Macintosh')) {
      os = 'MacOS';
    } else if (ua.includes('Android')) {
      os = 'Android';
      device = 'Mobil';
      const match = ua.match(/Android\s([0-9\.]+);\s([^;)]+)/);
      if (match && match[2]) device = match[2]; 
    } else if (ua.includes('iPhone')) {
      os = 'iOS';
      device = 'iPhone';
    } else if (ua.includes('iPad')) {
      os = 'iOS';
      device = 'iPad';
    } else if (ua.includes('Linux')) {
      os = 'Linux';
    }

    let browser = 'Naməlum';
    if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Chrome') && !ua.includes('Chromium')) browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';

    // TAM TƏHLÜKƏSİZ HTTPS ISP SORĞUSU
    let isp = 'Yüklənir...';
    try {
      const cleanIp = ip.split(',')[0].trim();
      if (cleanIp !== 'Gizli IP' && cleanIp !== '::1' && cleanIp !== '127.0.0.1' && !cleanIp.startsWith('192.168')) {
        // Təhlükəsiz HTTPS linkindən istifadə edirik (Mixed Content xətası verməyəcək)
        const ispRes = await fetch(`https://ipapi.co/${cleanIp}/json/`, { signal: AbortSignal.timeout(2000) });
        const ispData = await ispRes.json();
        if (ispData && ispData.org) isp = ispData.org;
      } else {
        isp = 'Localhost / Dev';
      }
    } catch (e) {
      isp = 'Naməlum Provayder';
    }

    const existing = await db.execute({
      sql: 'SELECT id FROM visitors WHERE ip = ? ORDER BY id DESC LIMIT 1',
      args: [ip]
    });

    if (existing.rows.length > 0) {
      await db.execute({
        sql: 'UPDATE visitors SET last_active = CURRENT_TIMESTAMP, screen = ?, current_page = ?, isp = ? WHERE id = ?',
        args: [screen || 'Bilinmir', page || '/', isp, existing.rows[0].id]
      });
    } else {
      await db.execute({
        sql: 'INSERT INTO visitors (ip, os, device, browser, isp, screen, current_page) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [ip, os, device, browser, isp, screen || 'Bilinmir', page || '/']
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}
