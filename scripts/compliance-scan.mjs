import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const checks = [
  {
    label: 'TypeScript proibido',
    args: ['-n', String.raw`\bas\b|as const|\bany\b|@ts-ignore|eslint-disable`, 'src'],
  },
  {
    label: 'Imports relativos profundos',
    args: ['-n', String.raw`\.\./\.\./|\.\./\.\./\.\./`, 'src'],
  },
  {
    label: 'Dependência shared para features',
    args: ['-n', '@features/', 'src/shared'],
  },
  {
    label: 'MUI cru em features',
    args: ['-n', String.raw`from ['"]@mui/material`, 'src/features'],
  },
  {
    label: 'Encoding corrompido',
    args: ['-n', String.raw`�|Ã|\uFFFD`, 'src', 'src/test', '.ai-skills', 'AGENTS.md'],
  },
];

const runCheck = ({ label, args }) => {
  const paths = args.slice(2).filter((item) => existsSync(item));
  if (paths.length === 0) {
    process.stdout.write(`[compliance] ${label}: ok\n`);
    return true;
  }
  const result = spawnSync('rg', [...args.slice(0, 2), ...paths], { encoding: 'utf8' });

  if (result.status === 0) {
    process.stderr.write(`\n[compliance] ${label}: falhou\n`);
    process.stderr.write(result.stdout);
    return false;
  }

  if (result.status === 1) {
    process.stdout.write(`[compliance] ${label}: ok\n`);
    return true;
  }

  process.stderr.write(`\n[compliance] ${label}: erro ao executar rg\n`);
  process.stderr.write(result.stderr);
  return false;
};

const runTsConfigStrictCheck = () => {
  const files = ['tsconfig.app.json', 'tsconfig.node.json'];
  const failedFiles = files.filter((file) => {
    if (!existsSync(file)) return true;
    const content = readFileSync(file, 'utf8');
    return !content.includes('"strict": true');
  });

  if (failedFiles.length > 0) {
    process.stderr.write('\n[compliance] TypeScript strict: falhou\n');
    process.stderr.write(`${failedFiles.join('\n')}\n`);
    return false;
  }

  process.stdout.write('[compliance] TypeScript strict: ok\n');
  return true;
};

const passed = [...checks.map(runCheck), runTsConfigStrictCheck()].every(Boolean);

if (!passed) {
  process.exitCode = 1;
}
