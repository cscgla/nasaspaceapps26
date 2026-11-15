// Regenerates ASSETS.md: every image slot, its Figma layer, and whether it's in src/assets/figma yet.
// Run: node scripts/asset-list.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
const src = readFileSync('src/assets.ts', 'utf8')
const block = src.slice(src.indexOf('export const ASSETS'), src.indexOf('} as const'))
const have = new Set(readdirSync('src/assets/figma').map((f) => f.replace(/\.[^.]+$/, '')))
const rows = []
let group = ''
for (const line of block.split('\n')) {
  const g = line.match(/^\s*\/\/\s*(.+)/)
  if (g) group = g[1]
  const m = line.match(/^\s*'([^']+)':\s*'([^']*)'/)
  if (m) rows.push({ group, name: m[1], layer: m[2], ok: have.has(m[1]) })
}
const missing = rows.filter((r) => !r.ok)
let md = `# Image list\n\nExport each **missing** layer from Figma as **PNG, 1x**, and save it with the exact file name below.\nPut the files in \`src/assets/figma/\`. The app picks them up by name automatically.\n\n`
md += `To find a layer, open the file in Figma and paste the node id into the URL: \`?node-id=90-785\` (use \`-\` instead of \`:\`).\n\n`
md += `**${rows.length - missing.length} of ${rows.length} done.**\n\n| Status | File name | Figma layer (node id + name) | Group |\n|---|---|---|---|\n`
for (const r of [...missing, ...rows.filter((r) => r.ok)])
  md += `| ${r.ok ? '✅ done' : '⬜ needed'} | \`${r.name}.${r.name.startsWith('mood-') ? 'svg' : 'png'}\` | ${r.layer} | ${r.group} |\n`
writeFileSync('ASSETS.md', md)
console.log(`${rows.length} slots, ${missing.length} missing`)
