import fs from 'fs';
import path from 'path';

const cdpPath =
  'C:/Users/kryki/.cursor/browser-logs/cdp-response-Runtime.evaluate-2026-06-08T08-38-12-872Z.json';
const outDir = 'c:/Users/kryki/Desktop/HoodAngel/hairclinicprive/public/hair-loss';

const labels = [
  'Brak wypadania włosów',
  'Lekko cofnięta linia włosów',
  'Lekko cofnięta linia włosów + łysiejąca tonsura',
  'Mocno zarysowane zakola + łysiejąca tonsura',
  'Półłysy',
  'Łysy',
];

const raw = JSON.parse(fs.readFileSync(cdpPath, 'utf8'));
const items = JSON.parse(raw.result.value);

fs.mkdirSync(outDir, { recursive: true });

items.forEach((item, index) => {
  const id = index + 1;
  const match = item.src.match(/^data:image\/svg\+xml;base64,(.+)$/);
  if (!match) throw new Error(`Unexpected src for item ${id}`);
  const svg = Buffer.from(match[1], 'base64').toString('utf8');
  fs.writeFileSync(path.join(outDir, `situation-${id}.svg`), svg);
  console.log(`${id}. ${labels[index]}`);
});

console.log(`\nSaved ${items.length} SVG files to public/hair-loss/`);
