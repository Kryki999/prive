const html = await (await fetch('https://www.clinicana.com/pl/')).text();
const zoneBlocks = [...html.matchAll(/<g[^>]*class="zone"[^>]*data-zone="(zone-\d)"[^>]*>([\s\S]*?)<\/g>/g)];
const result = zoneBlocks.map((m) => {
  const paths = [...m[2].matchAll(/<path[^>]*d="([^"]+)"/g)].map((p) => p[1]);
  return { zone: m[1], paths };
});
console.log(JSON.stringify(result, null, 2));
