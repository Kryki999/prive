import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '..', '..', 'lib', 'graft-calculator', 'snap-config.ts');

export function readSnapConfig() {
  const src = readFileSync(configPath, 'utf8');
  const num = (name) => {
    const m = src.match(new RegExp(`${name}\\s*=\\s*([\\d.]+)`));
    if (!m) throw new Error(`Missing ${name} in snap-config.ts`);
    return parseFloat(m[1]);
  };
  const zoneEdge =
    num('ZONE_EDGE_THRESHOLD') ||
    num('EDGE_THRESHOLD');
  const zonesMatch = src.match(/SNAP_ZONES[\s\S]*?\[([^\]]+)\]/);
  const SNAP_ZONES = zonesMatch
    ? (zonesMatch[1].match(/'zone-\d+'/g) ?? []).map((z) => z.replace(/'/g, ''))
    : [];
  const idxMatch = src.match(/ZONE5_SNAP_PATH_INDEX\s*=\s*(\d+)/);
  const bool = (name, fallback = true) => {
    const m = src.match(new RegExp(`${name}\\s*=\\s*(true|false)`));
    return m ? m[1] === 'true' : fallback;
  };
  const int = (name, fallback) => {
    const m = src.match(new RegExp(`${name}\\s*=\\s*(\\d+)`));
    return m ? parseInt(m[1], 10) : fallback;
  };
  return {
    ZONE_EDGE_THRESHOLD: zoneEdge,
    PROFILE_INSET: num('PROFILE_INSET'),
    TOP_EDGE_FRACTION: num('TOP_EDGE_FRACTION'),
    SNAP_ZONES,
    ZONE5_SNAP_PATH_INDEX: idxMatch ? parseInt(idxMatch[1], 10) : 0,
    SMOOTH_TRACED_PATHS: bool('SMOOTH_TRACED_PATHS'),
    SMOOTH_TENSION: num('SMOOTH_TENSION') || 0.5,
  };
}
