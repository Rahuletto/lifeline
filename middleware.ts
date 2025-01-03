import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthService } from './sdk/auth';

const protectedRoutes = ['/dashboard', '/profile', '/settings'];

const auth = new AuthService();
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    let isAuthenticated = false;
    try {
        const cookie = req.cookies.get('session');
        await auth.sessionClient.setSession(cookie?.value ?? '');
        const user = await auth.sessionAccount.get();
        if (!user) isAuthenticated = false;
        else isAuthenticated = true;
    } catch (err) {
        console.log(err)
        isAuthenticated = false
    }

    if (protectedRoutes.includes(pathname) && !isAuthenticated) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (pathname.startsWith('/auth') && isAuthenticated) {
        console.log('ooo')
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}
