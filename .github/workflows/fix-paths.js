import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(import.meta.dirname, '../../.dist/prod')
const pth = join(dir, 'components.js')

writeFileSync(pth,
  readFileSync(pth, 'utf-8')
    .replace(/(['"]\/)/g, `$1${process.argv[2]}/`)
)
