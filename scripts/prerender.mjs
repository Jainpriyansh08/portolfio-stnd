// Renders the app to static HTML inside dist/index.html so the page has
// content without JavaScript and link previews can read it.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const dist = resolve('dist')
const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const file = resolve(dist, 'index.html')
const html = await readFile(file, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('root placeholder not found')
await writeFile(file, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
await rm(resolve('dist-ssr'), { recursive: true, force: true })
console.log('prerendered dist/index.html')
