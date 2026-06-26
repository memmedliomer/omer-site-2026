import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT, os TEXT, device TEXT, browser TEXT, isp TEXT, screen TEXT, 
        current_page TEXT, gpu TEXT, ram TEXT, cpu TEXT, timezone TEXT, 
        referrer TEXT, is_touch TEXT, exact_gps TEXT,
        first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    const result = await db.execute('SELECT * FROM visitors ORDER BY last_active DESC LIMIT 100');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Xəta' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.execute({ sql: 'DELETE FROM visitors WHERE id = ?', args: [id] });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Xəta' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS visitors ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT, ip TEXT, os TEXT, device TEXT, browser TEXT, isp TEXT, screen TEXT, current_page TEXT, gpu TEXT, ram TEXT, cpu TEXT, timezone TEXT, referrer TEXT, is_touch TEXT, exact_gps TEXT, first_visit DATETIME DEFAULT CURRENT_TIMESTAMP, last_active DATETIME DEFAULT CURRENT_TIMESTAMP 
      )
    `);

    let body: any = {};
    try { body = await req.json(); } catch (e) { body = {}; }
    
    const { screen, page, gpu, ram, cpu, timezone, referrer, exactModel, isTouch, exactGPS } = body;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Gizli IP';
    const ua = req.headers.get('user-agent') || '';
    
    let os = 'Naməlum', device = 'Kompüter';
    if (/windows nt 10/i.test(ua)) os = 'Windows 10/11';
    else if (/windows nt 6\.1/i.test(ua)) os = 'Windows 7';
    else if (/mac os x/i.test(ua)) { const macMatch = ua.match(/Mac OS X (\d+[_.]\d+)/); os = macMatch ? `MacOS ${macMatch[1].replace(/_/g, '.')}` : 'MacOS'; } 
    else if (/android/i.test(ua)) {
      os = 'Android';
      // Əgər yeni API-dən dəqiq model gəlibsə onu yaz, yoxdursa köhnə üsulla axtar
      if (exactModel) device = exactModel;
      else {
        const match = ua.match(/Android\s[0-9\.]+;\s([^;)]+)/);
        device = match && match[1] ? match[1].trim() : 'Android Mobil';
      }
    } 
    else if (/iphone/i.test(ua)) { os = 'iOS'; device = 'iPhone'; } 
    else if (/ipad/i.test(ua)) { os = 'iOS'; device = 'iPad'; } 
    else if (/linux/i.test(ua)) os = 'Linux';

    let browser = 'Naməlum';
    if (/edg/i.test(ua)) browser = 'Edge';
    else if (/opr\//i.test(ua)) browser = 'Opera';
    else if (/chrome|crios|crmo/i.test(ua)) { const bMatch = ua.match(/Chrome\/(\d+)/i); browser = bMatch ? `Chrome v${bMatch[1]}` : 'Chrome'; } 
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) { const bMatch = ua.match(/Version\/(\d+)/i); browser = bMatch ? `Safari v${bMatch[1]}` : 'Safari'; } 
    else if (/firefox/i.test(ua)) { const bMatch = ua.match(/Firefox\/(\d+)/i); browser = bMatch ? `Firefox v${bMatch[1]}` : 'Firefox'; }

    let isp = 'Yüklənir...';
    try {
      const cleanIp = ip.split(',')[0].trim();
      if (cleanIp !== 'Gizli IP' && cleanIp !== '::1' && cleanIp !== '127.0.0.1' && !cleanIp.startsWith('192.168')) {
        const ispRes = await fetch(`https://ipapi.co/${cleanIp}/json/`, { signal: AbortSignal.timeout(2000) });
        const ispData = await ispRes.json();
        if (ispData && ispData.country_name) isp = `${ispData.country_name}, ${ispData.city || ''} (${ispData.org || 'Bilinmir'})`;
      } else isp = 'Localhost / Dev';
    } catch (e) { isp = 'Naməlum Lokasiya'; }

    const existing = await db.execute({ sql: 'SELECT id FROM visitors WHERE ip = ? ORDER BY id DESC LIMIT 1', args: [ip] });

    if (existing.rows.length > 0) {
      await db.execute({
        sql: 'UPDATE visitors SET last_active = CURRENT_TIMESTAMP, screen = ?, current_page = ?, isp = ?, os = ?, device = ?, browser = ?, gpu = ?, ram = ?, cpu = ?, timezone = ?, referrer = ?, is_touch = ?, exact_gps = ? WHERE id = ?',
        args: [screen || 'Bilinmir', page || '/', isp, os, device, browser, gpu || 'Gizli', ram || 'Bilinmir', cpu || 'Bilinmir', timezone || 'Bilinmir', referrer || 'Bilinmir', isTouch || 'Bilinmir', exactGPS || 'Bilinmir', existing.rows[0].id]
      });
    } else {
      await db.execute({
        sql: 'INSERT INTO visitors (ip, os, device, browser, isp, screen, current_page, gpu, ram, cpu, timezone, referrer, is_touch, exact_gps) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [ip, os, device, browser, isp, screen || 'Bilinmir', page || '/', gpu || 'Gizli', ram || 'Bilinmir', cpu || 'Bilinmir', timezone || 'Bilinmir', referrer || 'Bilinmir', isTouch || 'Bilinmir', exactGPS || 'Bilinmir']
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: 'Xəta' }, { status: 500 }); }
}
