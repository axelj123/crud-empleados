import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {
  authMiddleware,
  redirectToHome,
  redirectToLogin
} from 'next-firebase-auth-edge';
 
const PUBLIC_PATHS = ['/register', '/login', '/reset-password'];
 
export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: '/api/login',
    logoutPath: '/api/logout',
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    cookieName: 'AuthToken',
    cookieSignatureKeys: (process.env.COOKIE_SIGNATURE_KEYS || 'seguridad123').split(','),
    cookieSerializeOptions: {
      path: '/',
      httpOnly: true,
      secure: false, 
      sameSite: 'lax' as const,
      maxAge: 12 * 60 * 60 * 24 
    },
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID|| '',
      clientEmail:
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL || '',
      privateKey:(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
       
    },
    enableMultipleCookies: true,
    enableCustomToken: true,
    debug: true,
    checkRevoked: false,
    authorizationHeaderName: 'Authorization',
    handleValidToken: async ({token, decodedToken}, headers) => {
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request);
      }
 
      return NextResponse.next({
        request: {
          headers
        }
      });
    },
    handleInvalidToken: async (reason) => {
      console.info('Missing or malformed credentials', {reason});
 
      return redirectToLogin(request, {
        path: '/login',
        publicPaths: PUBLIC_PATHS
      });
    },
    handleError: async (error) => {
      console.error('Unhandled authentication error', {error});
 
      return redirectToLogin(request, {
        path: '/login',
        publicPaths: PUBLIC_PATHS
      });
    }
  });
}
 
export const config = {
  matcher: [
    '/api/login',
    '/api/logout',
    '/',
    '/((?!_next|favicon.ico|api|.*\\.).*)'
  ]
};