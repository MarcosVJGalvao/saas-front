import { routes, type VercelConfig } from '@vercel/config/v1';

const apiUrl = process.env.API_URL ?? process.env.VERCEL_API_URL;
const NGROK_SKIP_BROWSER_WARNING_HEADER = 'ngrok-skip-browser-warning';
const NGROK_SKIP_BROWSER_WARNING_VALUE = 'true';

if (!apiUrl) {
  throw new Error('Missing API_URL (or VERCEL_API_URL) in the Vercel environment.');
}

const normalizedApiUrl = apiUrl.replace(/\/+$/, '');
const isNgrokUrl = (url: string): boolean => /(^https?:\/\/)?([^.]+\.)*ngrok(-free)?\./i.test(url);
const SPA_FALLBACK_SOURCE =
  '/((?!api/|socket\\.io/|assets/|favicon\\.svg$|icons\\.svg$|manifest\\.webmanifest$|service-worker\\.js$|pwa/).*)';
const ngrokRewriteOptions = isNgrokUrl(normalizedApiUrl)
  ? {
      requestHeaders: {
        [NGROK_SKIP_BROWSER_WARNING_HEADER]: NGROK_SKIP_BROWSER_WARNING_VALUE,
      },
    }
  : undefined;

export const config: VercelConfig = {
  routes: [
    ngrokRewriteOptions === undefined
      ? routes.rewrite('/api/:path*', `${normalizedApiUrl}/api/:path*`)
      : routes.rewrite('/api/:path*', `${normalizedApiUrl}/api/:path*`, ngrokRewriteOptions),
    ngrokRewriteOptions === undefined
      ? routes.rewrite('/socket.io/:path*', `${normalizedApiUrl}/socket.io/:path*`)
      : routes.rewrite(
          '/socket.io/:path*',
          `${normalizedApiUrl}/socket.io/:path*`,
          ngrokRewriteOptions,
        ),
    routes.rewrite(SPA_FALLBACK_SOURCE, '/index.html'),
  ],
};
