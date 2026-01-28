import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Route publik yang tidak memerlukan autentikasi
  const publicRoutes = ["/sarpras", "/auth/login"];
  
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Proteksi route dashboard
  if (path.startsWith('/dashboard')) {
    try {
      // Ambil token JWT dari NextAuth
      const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET 
      });

      console.log("Token exists:", !!token);
      console.log("Has accessToken:", !!token?.accessToken);

      if (!token || !token.accessToken) {
        console.log("No token/accessToken  redirecting to /sarpras");
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }

      // Token valid, lanjutkan
      console.log("Access granted to:", path);
      return NextResponse.next();
      
    } catch (err) {
      console.error("Middleware Error:", err);
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}