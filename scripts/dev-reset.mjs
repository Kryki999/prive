/**
 * Zatrzymuje procesy na portach dev, czyści .next i uruchamia świeży serwer.
 * Użyj gdy strona traci CSS/JS (404 na layout.css, page.js, chunki webpack).
 */
import { rmSync } from 'fs';
import { spawn } from 'child_process';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nextDir = join(root, '.next');
const ports = [3000, 3001];

function killPortWindows(port) {
  try {
    const out = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const pids = new Set();
    for (const line of out.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const pid = trimmed.split(/\s+/).pop();
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    }
    for (const pid of pids) {
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
      console.log(`Zatrzymano PID ${pid} (port ${port})`);
    }
  } catch {
    // brak procesu na porcie
  }
}

if (process.platform === 'win32') {
  for (const port of ports) killPortWindows(port);
} else {
  for (const port of ports) {
    try {
      execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null`, { stdio: 'ignore', shell: true });
    } catch {
      // ignore
    }
  }
}

rmSync(nextDir, { recursive: true, force: true });
console.log('Usunięto folder .next');
console.log('Uruchamiam next dev (Turbopack)…\n');

const child = spawn('npx', ['next', 'dev', '--turbo'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => process.exit(code ?? 0));
