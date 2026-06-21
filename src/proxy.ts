import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const UNAUTHORIZED_RESPONSE = new NextResponse('Autenticação necessária.', {
  status: 401,
  headers: { 'WWW-Authenticate': 'Basic realm="Área interna"' },
});

export function proxy(request: NextRequest) {
  const expectedUser = process.env.ADMIN_BASIC_AUTH_USER;
  const expectedPassword = process.env.ADMIN_BASIC_AUTH_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return new NextResponse('ADMIN_BASIC_AUTH_USER/PASSWORD não configurados no .env.', { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) {
    return UNAUTHORIZED_RESPONSE;
  }

  const decoded = atob(authHeader.slice('Basic '.length));
  const separatorIndex = decoded.indexOf(':');
  const user = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  if (user !== expectedUser || password !== expectedPassword) {
    return UNAUTHORIZED_RESPONSE;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/internal/:path*',
};
