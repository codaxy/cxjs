let { existsSync, mkdirSync, writeFile } = require('fs')
let { dirname } = require('path');
let  { createFilter } = require('rollup-pluginutils');

module.exports = function css (options = {}) {
   const filter = createFilter(options.include || ['**/*.css', '**/*.scss', '**/*.sass'], options.exclude)
   let dest = options.output

   const styles = {}
   let includePaths = options.includePaths || []
   includePaths.push(process.cwd())

   return {
      name: 'css',
      transform (code, id) {
         if (!filter(id)) {
            return
         }

         // When output is disabled, the stylesheet is exported as a string
         if (options.output === false) {
            return {
               code: 'export default ' + JSON.stringify(code),
               map: { mappings: '' }
            }
         }

         // Map of every stylesheet
         styles[id] = code
         includePaths.push(dirname(id))

         return ''
      },
      ongenerate (opts) {
         // No stylesheet needed
         if (options.output === false) {
            return
         }

         // Combine all stylesheets
         let css = ''
         for (const id in styles) {
            css += styles[id] || ''
         }

         // Compile SASS to CSS
         if (css.length) {
            includePaths = includePaths.filter((v, i, a) => a.indexOf(v) === i)
            try {
               css = require('node-sass').renderSync(Object.assign({
                  data: css,
                  includePaths
               }, options)).css.toString()
            } catch (e) {
               if (options.failOnError) {
                  throw e
               }
               console.log()
               console.log(red('Error:\n\t' + e.message))
               if (e.message.includes('Invalid CSS')) {
                  console.log(green('Solution:\n\t' + 'fix your Sass code'))
                  console.log('Line:   ' + e.line)
                  console.log('Column: ' + e.column)
               }
               if (e.message.includes('node-sass') && e.message.includes('find module')) {
                  console.log(green('Solution:\n\t' + 'npm install --save node-sass'))
               }
               if (e.message.includes('node-sass') && e.message.includes('bindigs')) {
                  console.log(green('Solution:\n\t' + 'npm rebuild node-sass --force'))
               }
               console.log()
            }
         }

         // Possibly process CSS (e.g. by PostCSS)
         if (typeof options.processor === 'function') {
            css = options.processor(css, styles)
         }

         // Resolve if porcessor returned a Promise
         Promise.resolve(css).then(css => {
            // Emit styles through callback
            if (typeof options.output === 'function') {
               options.output(css, styles)
               return
            }

            if (typeof dest !== 'string') {
               // Don't create unwanted empty stylesheets
               if (!css.length) {
                  return
               }

               // Guess destination filename
               dest = opts.dest || 'bundle.js'
               if (dest.endsWith('.js')) {
                  dest = dest.slice(0, -3)
               }
               dest = dest + '.css'
            }

            // Ensure that dest parent folders exist (create the missing ones)
            ensureParentDirsSync(dirname(dest))

            // Emit styles to file
            writeFile(dest, css, (err) => {
               if (opts.verbose !== false) {
                  if (err) {
                     console.error(red(err))
                  } else {
                     console.log(green(dest), getSize(css.length))
                  }
               }
            })
         })
      }
   }
}

function red (text) {
   return '\x1b[1m\x1b[31m' + text + '\x1b[0m'
}

function green (text) {
   return '\x1b[1m\x1b[32m' + text + '\x1b[0m'
}

function getSize (bytes) {
   return bytes < 10000
      ? bytes.toFixed(0) + ' B'
      : bytes < 1024000
         ? (bytes / 1024).toPrecision(3) + ' kB'
         : (bytes / 1024 / 1024).toPrecision(4) + ' MB'
}

function ensureParentDirsSync (dir) {
   if (existsSync(dir)) {
      return
   }

   try {
      mkdirSync(dir)
   } catch (err) {
      if (err.code === 'ENOENT') {
         ensureParentDirsSync(dirname(dir))
         ensureParentDirsSync(dir)
      }
   }
}