console.log('✅ ㅤstarting...')
import { join, dirname } from 'path'
import { createRequire } from "module";
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts';
import { createInterface } from 'readline'
import yargs from 'yargs'
//import '/storage/BFF6-1E12/code/Blueday-Bot/index.js'
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname) 
const { name, author } = require(join(__dirname, './package.json')) 
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

say('Beaming-Fenile\nBot-MD', {
    font: 'chrome',
    align: 'center',
    gradient: ['red', 'magenta']
})

var isRunning = false
/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
    if (isRunning) return
    isRunning = true
    let args = [join(__dirname, file), ...process.argv.slice(2)]

    say('Scan the qr code to active bot', {
        font: 'console',
        align: 'center',
        gradient: ['red', 'magenta']
    })

    setupMaster({
        exec: args[0],
        args: args.slice(1),
    })
    let p = fork()
    p.on('message', data => {
        console.log('[RECEIVED]', data)
        switch (data) {
            case 'reset':
                p.process.kill()
                isRunning = false
                start.apply(this, arguments)
                break
            case 'stop':
                p.process.kill()
                break
            case 'uptime':
                p.send(process.uptime())
                break
        }
    })
    p.on('exit', (_, code) => {
        isRunning = false
        console.error('[❗] Exited with code:', code)
        if (code === 0) return
        p.process.kill()
    })
    let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
    if (!opts['test'])
        if (!rl.listenerCount()) rl.on('line', line => {
            p.emit('message', line.trim())
        })
}
start('main.js')