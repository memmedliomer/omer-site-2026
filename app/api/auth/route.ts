import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // .env.local faylındakı məlumatlarla tutuşdururuq
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true, message: "Giriş uğurludur!" });
    }
    
    return NextResponse.json({ success: false, message: "İstifadəçi adı və ya şifrə yanlışdır!" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Sistem xətası baş verdi." }, { status: 500 });
  }
}
