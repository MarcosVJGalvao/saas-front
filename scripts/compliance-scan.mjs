import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

// ─── file scanner ────────────────────────────────────────────────────────────

/**
 * @param {string} dir
 * @param {string[]} [exts] - allowed extensions (e.g. ['.ts', '.tsx'])
 * @param {RegExp[]} [excludePatterns] - path patterns to exclude
 * @returns {string[]}
 */
const walk = (dir, exts, excludePatterns = []) => {
  if (!existsSync(dir)) return [];
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (excludePatterns.some((p) => p.test(fullPath.replaceAll('\\', '/')))) continue;
    if (entry.isDirectory()) {
      results.push(...walk(fullPath, exts, excludePatterns));
    } else if (!exts || exts.includes(extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
};

/**
 * @param {string|string[]} dirs
 * @param {{ exts?: string[], exclude?: RegExp[] }} [opts]
 */
const files = (dirs, opts = {}) => {
  const dirList = Array.isArray(dirs) ? dirs : [dirs];
  return dirList.flatMap((d) => walk(d, opts.exts, opts.exclude ?? []));
};

/**
 * Search files for a pattern.
 * @param {RegExp} pattern
 * @param {string[]} filePaths
 * @returns {{ file: string, line: number, text: string }[]}
 */
const grep = (pattern, filePaths) => {
  const matches = [];
  for (const fp of filePaths) {
    const lines = readFileSync(fp, 'utf8').split('\n');
    lines.forEach((text, i) => {
      if (pattern.test(text)) {
        matches.push({ file: relative('.', fp).replaceAll('\\', '/'), line: i + 1, text: text.trim() });
      }
    });
  }
  return matches;
};

// ─── reporter ────────────────────────────────────────────────────────────────

let passed = true;
const results = [];

const fail = (label, matches) => {
  passed = false;
  process.stderr.write(`\n[compliance] FALHOU — ${label}\n`);
  if (matches?.length) {
    for (const m of matches.slice(0, 10)) {
      process.stderr.write(`  ${m.file}:${m.line}: ${m.text}\n`);
    }
    if (matches.length > 10) process.stderr.write(`  ... e mais ${matches.length - 10} ocorrência(s)\n`);
  }
};

const ok = (label) => process.stdout.write(`[compliance] ok — ${label}\n`);

/**
 * @param {string} label
 * @param {RegExp} pattern
 * @param {string[]} filePaths
 * @param {{ excludeFiles?: RegExp[] }} [opts]
 */
const check = (label, pattern, filePaths, opts = {}) => {
  const paths = opts.excludeFiles
    ? filePaths.filter((f) => !opts.excludeFiles.some((ex) => ex.test(f.replaceAll('\\', '/'))))
    : filePaths;
  const matches = grep(pattern, paths);
  if (matches.length > 0) {
    fail(label, matches);
    results.push(false);
  } else {
    ok(label);
    results.push(true);
  }
};

// ─── file sets ───────────────────────────────────────────────────────────────

const TS_EXT = ['.ts', '.tsx'];
const testExclude = [/\/test\//, /\.test\./, /\.spec\./];

const srcAll      = files('src', { exts: TS_EXT });
const srcNonTest  = files('src', { exts: TS_EXT, exclude: testExclude });
const srcShared   = files('src/shared', { exts: TS_EXT });
const srcFeatures = files('src/features', { exts: TS_EXT });
const hooks       = files('src', { exts: TS_EXT, exclude: [...testExclude, /\/components\//, /\/pages\//] })
  .filter((f) => f.replaceAll('\\', '/').includes('/hooks/'));
const hooksTsx    = hooks.filter((f) => f.endsWith('.tsx'));
const hooksTs     = hooks.filter((f) => f.endsWith('.ts'));
const endpoints   = srcAll.filter((f) => f.replaceAll('\\', '/').endsWith('/services/endpoints.ts'));
const serviceTsFiles = srcAll.filter((f) => f.replaceAll('\\', '/').endsWith('/services/service.ts'));
const pages       = files('src', { exts: TS_EXT, exclude: testExclude })
  .filter((f) => f.replaceAll('\\', '/').includes('/pages/'));
const featurePages = pages.filter((f) => f.replaceAll('\\', '/').includes('/features/'));

// ─── verificações ───────────────────────────────────────────────────────────

// TypeScript strict nos tsconfigs
(() => {
  const cfgFiles = ['tsconfig.app.json', 'tsconfig.node.json'];
  const missing = cfgFiles.filter((f) => !existsSync(f) || !readFileSync(f, 'utf8').includes('"strict": true'));
  if (missing.length > 0) {
    fail('TypeScript strict nos tsconfigs', missing.map((f) => ({ file: f, line: 0, text: 'falta "strict": true' })));
    results.push(false);
  } else {
    ok('TypeScript strict nos tsconfigs');
    results.push(true);
  }
})();

// TypeScript — proibições globais
check(
  'TypeScript: proibido @ts-ignore / @ts-expect-error / eslint-disable',
  /@ts-ignore|@ts-expect-error|eslint-disable/,
  srcNonTest,
);

check(
  'TypeScript: proibido cast `as Type` e `as const`',
  /(?<!\*\s)\bas\s+(?:const\b|[A-Z<(])/,
  srcNonTest,
);

check(
  'TypeScript: proibido tipo `any` explícito',
  /:\s*any\b|<any>|as\s+any\b/,
  srcNonTest,
);

// Imports relativos profundos (../../ ou mais)
check(
  'Imports relativos profundos (../../)',
  /from ['"]\.\.\/\.\.\//,
  srcAll,
);

// shared não pode importar de features
check(
  'shared importando de features (violação de camada)',
  /@features\//,
  srcShared,
);

// MUI cru em features (sem wrapper compartilhado)
check(
  'MUI cru em features (usar shared components)',
  /from ['"]@mui\/material/,
  srcFeatures,
);

// console.log em código de produção
check(
  'console.log em src (usar console.warn ou console.error)',
  /console\.log\(/,
  srcNonTest,
);

// ─── ANTI-PADRÕES DE HOOKS ──────────────────────────────────────────────────

// Hooks exportando componentes React (export const PascalCase)
check(
  'Hook exportando componente React (export const PascalCase em hooks/)',
  /export\s+const\s+[A-Z][a-zA-Z]+\s*=/,
  [...hooks],
);

// JSX dentro de hooks — detecta tags JSX reais (return <Component> ou <tag>)
check(
  'JSX dentro de hooks (mover para components/)',
  /return\s*\(<|=>\s*\(<|(?:^\s*|\)\s*)<[A-Z][a-zA-Z]*[\s/>]|<\/[A-Z][a-zA-Z]*>/m,
  hooksTsx,
);

// hooks importando endpoints diretamente
check(
  'hooks importando endpoints diretamente (usar service.ts)',
  /from ['"].*\/endpoints/,
  [...hooks],
);

// ─── ANTI-PADRÕES DE SERVICES ───────────────────────────────────────────────

// endpoints.ts usando await
check(
  'await dentro de endpoints.ts (endpoints só retornam Promise — sem await)',
  /\bawait\b/,
  endpoints,
);

// endpoints.ts acessando .data
check(
  '.data dentro de endpoints.ts (endpoints não processam resposta)',
  /\.data\b/,
  endpoints,
);

// service.ts importando httpClient diretamente
check(
  'httpClient importado em service.ts (usar endpoints.ts)',
  /from ['"].*httpClient/,
  serviceTsFiles,
);

// pages chamando services diretamente
check(
  'pages chamando services diretamente (usar hooks)',
  /from ['"].*\/service['"]|from ['"].*\/services['"]/,
  featurePages,
);

// ─── ANTI-PADRÕES DE FORMS ──────────────────────────────────────────────────

// isEditMode em qualquer arquivo de feature
check(
  'isEditMode em formulários (create e edit devem ter pages/hooks separados)',
  /isEditMode/,
  srcFeatures,
);

// payload montado diretamente na page
check(
  'payload montado na page (mover para normalizer)',
  /\bpayload\s*[=:]\s*\{/,
  featurePages,
);

// ─── QUALIDADE GERAL ─────────────────────────────────────────────────────────

// Encoding corrompido
const allDocs = [
  ...files('src', { exts: TS_EXT }),
  ...files('.ai-skills', { exts: ['.md'] }),
  ...(existsSync('AGENTS.md') ? ['AGENTS.md'] : []),
  ...(existsSync('README.md') ? ['README.md'] : []),
];

check(
  'Encoding corrompido (caractere U+FFFD ou sequências ISO-8859)',
  /�|Ã©|Ã£|Ã§|Ã¡|Ã­|Ãº/,
  allDocs,
);

// ─── resultado final ─────────────────────────────────────────────────────────

const total = results.length;
const failedCount = results.filter((r) => !r).length;

process.stdout.write('\n');
if (failedCount === 0) {
  process.stdout.write(`[compliance] Todas as ${total} verificações passaram.\n`);
} else {
  process.stderr.write(`[compliance] ${failedCount} de ${total} verificações falharam.\n`);
  process.exitCode = 1;
}
