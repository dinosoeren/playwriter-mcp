import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')

const SELECTOR_GENERATOR_URL = 'https://esm.sh/@mizchi/selector-generator@1.50.0-next/es2022/selector-generator.bundle.mjs'

async function main() {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
  }

  console.log('Downloading selector-generator from esm.sh...')
  const response = await fetch(SELECTOR_GENERATOR_URL)
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`)
  }

  let esmScript = await response.text()

  const exportMatch = esmScript.match(/export\s*\{([^}]+)\}\s*;?\s*(\/\/.*)?$/)
  if (!exportMatch) {
    throw new Error('Could not find export statement in bundle')
  }

  const exports = exportMatch[1].split(',').map((e) => {
    const parts = e.trim().split(/\s+as\s+/)
    return { local: parts[0].trim(), exported: (parts[1] || parts[0]).trim() }
  })

  const createSelectorGenerator = exports.find((e) => e.exported === 'createSelectorGenerator')
  const toLocator = exports.find((e) => e.exported === 'toLocator')

  if (!createSelectorGenerator || !toLocator) {
    throw new Error('Could not find createSelectorGenerator or toLocator exports')
  }

  esmScript = esmScript.replace(/export\s*\{[^}]+\}\s*;?\s*(\/\/.*)?$/, '')

  const wrappedScript = `(function() {
${esmScript}
globalThis.__selectorGenerator = { createSelectorGenerator: ${createSelectorGenerator.local}, toLocator: ${toLocator.local} };
})();`

  const outputPath = path.join(distDir, 'selector-generator.js')
  fs.writeFileSync(outputPath, wrappedScript)
  console.log(`Saved to ${outputPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
