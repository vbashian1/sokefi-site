// Pre-push check (Veronica, 2026-10-28): before anything is pushed, type-check exactly the
// commits being pushed, in a clean copy of the repo, and block the push on any error. A
// clean copy catches what the working folder hides, e.g. a file that was renamed or edited
// but never committed (the cause of the failed Vercel build of 81fadf8).
//
// Run by .husky/pre-push, which passes git's list of refs being pushed on stdin.
//   node scripts/pre-push-check.mjs < "<local ref> <local sha> <remote ref> <remote sha>" lines
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = process.cwd();
const ZERO = /^0+$/;

const input = fs.readFileSync(0, 'utf8');
const shas = [
  ...new Set(
    input
      .split('\n')
      .map((line) => line.trim().split(/\s+/))
      .filter((parts) => parts.length === 4 && !ZERO.test(parts[1]))
      .map((parts) => parts[1]),
  ),
];
if (shas.length === 0) process.exit(0);

const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

let failed = false;
for (const sha of shas) {
  const short = sha.slice(0, 7);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `sokefi-prepush-${short}-`));
  console.log(`pre-push: type-checking ${short} in a clean copy…`);
  try {
    git('worktree', 'add', '--quiet', '--detach', dir, sha);
    // The clean copy uses the project's installed packages (a junction on Windows).
    fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(dir, 'node_modules'), 'junction');
    const run = spawnSync('npx', ['astro', 'check'], {
      cwd: dir,
      encoding: 'utf8',
      shell: true,
    });
    const output = `${run.stdout ?? ''}${run.stderr ?? ''}`;
    const errors = output.match(/- (\d+) errors?/);
    if (run.status !== 0 || !errors || errors[1] !== '0') {
      failed = true;
      console.error(output.split('\n').slice(-40).join('\n'));
      console.error(`pre-push: ${short} does not type-check — push blocked.`);
    } else {
      console.log(`pre-push: ${short} OK (0 errors).`);
    }
  } finally {
    // Remove the link first so the project's own node_modules is never touched.
    fs.rmSync(path.join(dir, 'node_modules'), { force: true });
    try {
      git('worktree', 'remove', '--force', dir);
    } catch {
      fs.rmSync(dir, { recursive: true, force: true });
      git('worktree', 'prune');
    }
  }
}
process.exit(failed ? 1 : 0);
