import { routes, type VercelConfig } from '@vercel/config/v1';

const apiUrl = process.env.API_URL ?? process.env.VERCEL_API_URL;

if (!apiUrl) {
  throw new Error('Missing API_URL (or VERCEL_API_URL) in the Vercel environment.');
}

const normalizedApiUrl = apiUrl.replace(/\/+$/, '');

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite('/api/:path*', `${normalizedApiUrl}/api/:path*`),
    routes.rewrite('/socket.io/:path*', `${normalizedApiUrl}/socket.io/:path*`),
    routes.rewrite('/(.*)', '/index.html'),
  ],
};
