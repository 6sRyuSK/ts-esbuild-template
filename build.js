const fs = require('fs')
const path = require('path')
const esbuild = require('esbuild')

const watching = process.argv.includes('-w')
const name = path.basename(__dirname)

const build = async () => {
  const startedAt = Date.now()
  const entry = path.resolve(__dirname, './src/main.ts')
  const outfile = path.resolve(__dirname, `./public/dist/bundle.js`)
  console.log(`Bundling ${entry}`)
  try {
    await esbuild.build({
      entryPoints: [entry],
      outfile,
      minify: true,
      bundle: true,
      define: { 'process.env.NODE_ENV': '"production"' },
      sourcemap: watching,
    })
  } catch (error) {
    console.error(error)
    if (!watching) {
      process.exit(1)
    }
  }
  console.log(`Bundled ${path.resolve(__dirname, `./public/dist/bundle.js`)} in ${Date.now() - startedAt} [ms]`)
}

build().then(() => {
  if (watching) {
    console.log('Watching...')
    const sane = require('sane')
    sane('./src', { glob: ['**/*.ts', '**/*.jsx'] }).on('change', build)
  }
})