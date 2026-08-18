import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? '.');
const pages = fs.readdirSync(root).filter((name) => name.endsWith('.html'));
const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'ncs-inline-js-'));
let failures = 0;

try {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
    scripts.forEach((match, index) => {
      const attributes = match[1];
      const source = match[2].trim();
      if (!source) return;
      const extension = /type\s*=\s*["']module["']/i.test(attributes) ? '.mjs' : '.js';
      const target = path.join(tempDirectory, `${path.basename(page, '.html')}-${index + 1}${extension}`);
      fs.writeFileSync(target, source);
      const result = spawnSync(process.execPath, ['--check', target], { encoding: 'utf8' });
      if (result.status !== 0) {
        failures += 1;
        process.stderr.write(`Syntax error in ${page}, inline script ${index + 1}:\n${result.stderr}`);
      }
    });
  }
} finally {
  fs.rmSync(tempDirectory, { recursive: true, force: true });
}

if (failures > 0) process.exit(1);
console.log(`Validated inline JavaScript in ${pages.length} HTML pages.`);
