/**
 * Blokuje `npm run build`, gdy działa `next dev` — równoległy build+dev psuje .next
 * i powoduje 404 na CSS/JS (strona bez stylów).
 */
import { execSync } from 'child_process';

const ports = [3000, 3001];

function isPortListening(port) {
  if (process.platform === 'win32') {
    try {
      const out = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      return out.trim().length > 0;
    } catch {
      return false;
    }
  }
  try {
    execSync(`lsof -iTCP:${port} -sTCP:LISTEN`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const busy = ports.filter(isPortListening);

if (busy.length > 0) {
  console.error('\n❌ npm run build przerwany — działa serwer dev (port(y): ' + busy.join(', ') + ').');
  console.error('   Równoległy build + dev psuje cache .next → 404 na CSS/JS.\n');
  console.error('   Zatrzymaj dev (Ctrl+C) i uruchom build ponownie,');
  console.error('   albo użyj: npm run build:force (świadomie, po zatrzymaniu dev).\n');
  process.exit(1);
}
