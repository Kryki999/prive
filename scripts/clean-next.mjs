/**
 * Usuwa folder .next — używaj przez npm run dev:clean lub dev:reset, NIE przy każdym zapisie pliku.
 */
import { rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nextDir = join(root, '.next');

rmSync(nextDir, { recursive: true, force: true });
console.log('Usunięto folder .next');
