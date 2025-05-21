process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import './function.js';
import './config.js';
import './api.js';
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
import path, { join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }; global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }; global.__require = function require(dir = import.meta.url) { return createRequire(dir) }

import * as ws from 'ws';
import {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  readFileSync,
  watch
} from 'fs';
import * as glob from 'glob';
import chokidar from 'chokidar';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import ora from 'ora';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import pino from 'pino';
import {
  mongoDB,
  mongoDBV2
} from './lib/mongoDB.js';
//import store from './lib/storee.js'
const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeInMemoryStore } = await import('@adiwajshing/baileys');

const { CONNECTING } = ws
const { chain } = lodash
protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
    ...query,
    ...(apikeyqueryname ? {
        [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]
    } : {})
})) : '')
// global.Fn = function functionCallBack(fn, ...args) { return fn.call(global.conn, ...args) }
global.timestamp = {
    start: new Date
}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎\/!#.\\').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(new JSONFile(`database.json`))


global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) return new Promise((resolve) => setInterval(async function() {
        if (!global.db.READ) {
            clearInterval(this)
            resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
        }
    }, 1 * 1000))
    if (global.db.data !== null) return
    global.db.READ = true
    await global.db.read().catch(console.error)
    global.db.READ = null
    global.db.data = {
        users: {},
        chats: {},
        stats: {},
        sticker: {},
        settings: {},
        ...(global.db.data || {})
    }
    global.db.chain = chain(global.db.data)
}

//Write Database
if (!opts['test']) {
    if (global.db) {
        setInterval(async () => {
            if (global.db.data) await global.db.write();
        }, 30 * 1000);
    }
}

const logger = pino({
    level: "silent"
});
global.store = makeInMemoryStore({
    logger
})

global.authFile = `sessions`
var storeFile = `${opts._[0] || 'data'}.store.json`
store.readFromFile(storeFile)

const {
    state,
    saveState,
    saveCreds
} = await useMultiFileAuthState(global.authFile)
const msgRetryCounterMap = MessageRetryMap => {}
let {
    version
} = await fetchLatestBaileysVersion();

const connectionOptions = {
    printQRInTerminal: false,
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {}
                        },
                        ...message
                    }
                }
            };
        }
        return message;
    },
    auth: state,
    getMessage: async (key) => {
        if (store) {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        }
        return proto.Message.fromObject({});
    },
    // logger: pino({ level: 'trace' })
    logger: pino({
        level: 'silent'
    }),
    markOnlineOnConnect: global.setting.markAsOnline,
    generateHighQualityLinkPreview: true,
    fireInitQueries: false,
    shouldSyncHistoryMessage: false,
    downloadHistory: false,
    syncFullHistory: false
}

global.conn = makeWASocket(connectionOptions)
store.bind(conn.ev)
conn.isInit = false

if (global.setting.clearTmp) {
    setInterval(async () => {
        if (global.db.data) await global.db.write().catch(console.error)
        if (opts['autocleartmp']) try {
            clearTmp()

        } catch (e) {
            console.error(e)
        }
    }, 1 * 60 * 60 * 1000)
}

global.clearTmp = function() {
    const tmp = [tmpdir(), join(__dirname, './tmp')]
    const filename = []
    tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))
    return filename.map(file => {
        const stats = statSync(file)
        if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file) // 3 minutes
        return false
    })
}

async function connectionUpdate(update) {
    const {
        connection,
        lastDisconnect,
        isNewLogin,
        qr,
        isOnline,
        receivedPendingNotifications
    } = update;
    if (isNewLogin) conn.isInit = true;
    const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
    
    if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
        conn.logger.info(await global.reloadHandler(true).catch(console.error));
    }
    if (global.db.data == null) loadDatabase();
    
    if (connection === 'connecting') {
        global.connectionAttempts++
        console.log(chalk.bold.redBright('⚡ Mengaktifkan Bot, Mohon tunggu sebentar...'));
    }
    if (connection === 'open') {
        console.log(chalk.bold.cyan('Tersambung'));
    }
    if (isOnline == true) {
        console.log(chalk.bold.green('Status Aktif'));
    }
    if (isOnline == false) {
        console.log(chalk.bold.red('Status Mati'));
    }
    if (receivedPendingNotifications) {
        console.log(chalk.bold.yellow('Menunggu Pesan Baru'));
    }
    if (connection === 'close') {
        console.log(chalk.bold.red("Sambungan Terputus.."))
        global.reloadHandler(true)
    }
    if (qr !== 0 && qr !== undefined && connection === 'close') {
        conn.logger.error(chalk.bold.yellow(`\n🚩 Koneksi ditutup, harap hapus folder ${authFolder} dan pindai ulang kode QR`));
    }

    if (qr !== 0 && qr !== undefined && connection === 'close') {
        conn.logger.info(chalk.bold.yellow(`\n🚩ㅤPindai kode QR ini, kode QR akan kedaluwarsa dalam 60 detik.`));
    }
}

global.loggedErrors = new Set();

process.on('uncaughtException', err => {
    if (!global.loggedErrors.has(err)) {
        console.error(chalk.bold.red.bold('Uncaught Exception:'), err);
        global.loggedErrors.add(err);
    }
});

process.on('rejectionHandled', promise => {
    if (!global.loggedErrors.has(promise)) {
        console.error(chalk.bold.red.bold('Rejection Handled:'), promise);
        global.loggedErrors.add(promise);
    }
});

process.on('warning', warning => console.warn(chalk.bold.yellow.bold('Warning:'), warning));

process.on('unhandledRejection', (reason, promise) => {
    if (!global.loggedErrors.has(reason)) {
        console.error(chalk.bold.red.bold('Unhandled Rejection:'), reason);
        global.loggedErrors.add(reason);
    }
});

let isInit = true;
let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn) {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler
    } catch (e) {
        console.error(e)
    }
    if (restatConn) {
        const oldChats = global.conn.chats
        try {
            global.conn.ws.close()
        } catch {}
        conn.ev.removeAllListeners()
        global.conn = makeWASocket(connectionOptions, {
            chats: oldChats
        })
        isInit = true
    }
    if (!isInit) {
        conn.ev.off('messages.upsert', conn.handler);
        conn.ev.off('group-participants.update', conn.participantsUpdate);
        conn.ev.off('groups.update', conn.groupsUpdate);
        conn.ev.off('message.delete', conn.onDelete);
        conn.ev.off('connection.update', conn.connectionUpdate);
        conn.ev.off('creds.update', conn.credsUpdate);
    }

    conn.handler = handler.handler.bind(global.conn);
    conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
    conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
    conn.onDelete = handler.deleteUpdate.bind(global.conn);
    conn.connectionUpdate = connectionUpdate.bind(global.conn);
    conn.credsUpdate = saveCreds.bind(global.conn, true)

    conn.ev.on('messages.upsert', conn.handler);
    conn.ev.on('group-participants.update', conn.participantsUpdate);
    conn.ev.on('groups.update', conn.groupsUpdate);
    conn.ev.on('message.delete', conn.onDelete);
    conn.ev.on('connection.update', conn.connectionUpdate);
    conn.ev.on('creds.update', conn.credsUpdate);

    isInit = false
    return true
}

const pluginFolder = path.resolve(__dirname, 'plugins');
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = new Object();

async function filesInit() {
    const CommandsFiles = glob.sync(path.resolve(pluginFolder, '**/*.js'), {
        ignore: ['**/node_modules/**']
    });

    const importPromises = CommandsFiles.map(async (file) => {
        const moduleName = path.join('/plugins', path.relative(pluginFolder, file));

        try {
            const {
                default: module
            } = await import(file);
            global.plugins[moduleName] = (module || (await import(file)));
            return moduleName;
        } catch (e) {
            conn.logger.error(e);
            delete global.plugins[moduleName];
            return {
                moduleName,
                filePath: file,
                message: e.message
            };
        }
    });

    const results = await Promise.all(importPromises);
    
    const successMessages = results
        .filter(result => typeof result === 'string')
        .sort((a, b) => a.localeCompare(b));

    const errorMessages = results
        .filter(result => typeof result === 'object')
        .sort((a, b) => a.moduleName.localeCompare(b.moduleName));

    global.plugins = Object.fromEntries(
        Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
    );

    conn.logger.warn(`🔧 Loaded ${CommandsFiles.length} JS Files total.`);
    conn.logger.info(`✅ Success Plugins: ${successMessages.length} total.`);
    conn.logger.error(`❌ Error Plugins: ${errorMessages.length} total`);
}

global.reload = async (_ev, filename) => {
    if (pluginFilter(filename)) {
        let dir = global.__filename(join(pluginFolder, filename), true)
        if (filename in global.plugins) {
            if (existsSync(dir)) conn.logger.info(`re - require plugin '${filename}'`)
            else {
                conn.logger.warn(`deleted plugin '${filename}'`)
                return delete global.plugins[filename]
            }
        } else conn.logger.info(`requiring new plugin '${filename}'`)
        let err = syntaxerror(readFileSync(dir), filename, {
            sourceType: 'module',
            allowAwaitOutsideFunction: true
        })
        if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
        else try {
            const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
            global.plugins[filename] = module.default || module
        } catch (e) {
            conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
        } finally {
            global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
        }
    }
}

const setNestedObject = (obj, path, value) => path.split('/').reduce((acc, key, index, keys) =>
    acc[key] = index === keys.length - 1 ? value : acc[key] || {}, obj);
const directoryName = global.__dirname(import.meta.url)

async function watchFiles() {
    try {
        const mainDir = path.resolve(directoryName, "");
        console.log(`Main Dir: ${mainDir}`);
        const watcher = chokidar.watch(mainDir, {
            ignored: (filePath, stats) =>
                stats?.isFile() &&
                (filePath?.match(/node_modules|#unused/) ||
                    filePath?.startsWith(".") ||
                    !filePath?.endsWith(".js")),
            persistent: true,
            ignoreInitial: true,
            alwaysState: true,
        });
        watcher
            .on("add", async (filePath) => {
                if (!filePath.endsWith(".js")) return;
                const dir = filePath.match(/plugins/) ?
                    "plugins" :
                    filePath.match(/lib/) ?
                    "lib" :
                    "main";
                const resolvedFile = path.join(
                    `/${dir}`,
                    path.relative(
                        path.dirname(path.dirname(filePath)),
                        path.dirname(filePath),
                    ),
                    path.basename(filePath),
                );
                const fileName = filePath.split('\\').pop().split('/').pop()
                try {
                    const module = await import(`${filePath}?updated=${Date.now()}`);
                    if (dir === "plugins") {
                        plugins[resolvedFile] = module.default ? module.default : module;
                        conn.logger.info(`New plugin: ${resolvedFile}`);
                    } else if (dir === "lib") {
                        setNestedObject(
                            lib,
                            resolvedFile.slice(0, -3),
                            module.default ? module.default : module,
                        );
                        conn.logger.info(`New lib detected: ${resolvedFile}`);
                    } else if (dir === "main") {
                        conn.logger.info(`Changed main: ${resolvedFile}`);
                    } else {
                        conn.logger.warn(`File added outside of recognized directories: ${filePath}`);
                    }
                } catch (e) {
                    let err = await syntaxerror(readFileSync(filePath), fileName, {
                        sourceType: 'module',
                        allowAwaitOutsideFunction: true
                    })
                    conn.logger.error(`Error handling 'add' file '${filePath}'\n${err ?? e.message}`);
                }
            })
            .on("change", async (filePath) => {
                if (!filePath.endsWith(".js")) return;
                const dir = filePath.match(/plugins/) ?
                    "plugins" :
                    filePath.match(/lib/) ?
                    "lib" :
                    "main";
                const resolvedFile = path.join(
                    `/${dir}`,
                    path.relative(
                        path.dirname(path.dirname(filePath)),
                        path.dirname(filePath),
                    ),
                    path.basename(filePath),
                );
                const fileName = filePath.split('\\').pop().split('/').pop()
                try {
                    const module = await import(`${filePath}?updated=${Date.now()}`);
                    if (dir === "plugins") {
                        plugins[resolvedFile] = module.default ? module.default : module;
                        conn.logger.info(`Changed plugin: ${resolvedFile}`);
                    } else if (dir === "lib") {
                        setNestedObject(
                            lib,
                            resolvedFile.slice(0, -3),
                            module.default ? module.default : module,
                        );
                        conn.logger.info(`Changed lib: ${resolvedFile}`);
                    } else if (dir === "main") {
                        conn.logger.info(`Changed main: ${resolvedFile}`);
                    } else {
                        conn.logger.warn(`File changed outside of recognized directories: ${filePath}`);
                    }
                } catch (e) {
                    console.log({ path: filePath, file: fileName })
                    let err = await syntaxerror(readFileSync(filePath), fileName, {
                        sourceType: 'module',
                        allowAwaitOutsideFunction: true
                    })
                    conn.logger.error(`Error handling 'change' file '${filePath}'\n${err ?? e.message}`);
                }
            })
            .on("unlink", async (filePath) => {
                if (!filePath.endsWith(".js")) return;
                const dir = filePath.match(/plugins/) ?
                    "plugins" :
                    filePath.match(/lib/) ?
                    "lib" :
                    "main";
                const resolvedFile = path.join(
                    `/${dir}`,
                    path.relative(
                        path.dirname(path.dirname(filePath)),
                        path.dirname(filePath),
                    ),
                    path.basename(filePath),
                );
                const fileName = filePath.split('\\').pop().split('/').pop()
                try {
                    if (dir === "plugins") {
                        delete plugins[resolvedFile];
                        conn.logger.warn(`Plugin deleted: ${resolvedFile}`);
                    } else if (dir === "lib") {
                        delete lib[resolvedFile.slice(0, -3)];
                        conn.logger.warn(`Lib deleted: ${resolvedFile}`);
                    } else if (dir === "main") {
                        conn.logger.info(`Processed main (delete): ${resolvedFile}`);
                    } else {
                        conn.logger.warn(`File deleted outside of recognized directories: ${filePath}`);
                    }
                } catch (e) {
                    let err = await syntaxerror(readFileSync(filePath), fileName, {
                        sourceType: 'module',
                        allowAwaitOutsideFunction: true
                    })
                    conn.logger.error(`Error handling 'unlink' file '${filePath}'\n${err ?? e.message}`);
                }
            })
            .on("error", (error) => {
                conn.logger.error(`Watcher error: ${error.message}`);
            })
            .on("ready", () => {
                conn.logger.info("Initial scan complete. Ready for changes.");
            });
    } catch (e) {
        conn.logger.error(`Error watching files: ${e}`);
    }
}

const createSpinner = (text, spinnerType) => {
    const spinner = ora({
        text,
        spinner: spinnerType,
        discardStdin: false,
    });

    return {
        start: () => spinner.start(),
        succeed: (successText) => {
            spinner.succeed(chalk.bold.green(`${successText}\n`));
            spinner.stopAndPersist({
                symbol: chalk.green.bold('✔')
            });
        },
        fail: (errorText) => spinner.fail(chalk.bold.red(`${errorText}\n`)),
        stop: () => spinner.stop(),
        render: () => spinner.render(),
    };
};

let connectionCheckSpinner = createSpinner(chalk.bold.yellow('Menunggu disambungkan...\n'), 'moon').start();

do {
    connectionCheckSpinner.text = chalk.bold.yellow('Menunggu disambungkan...\n');
    connectionCheckSpinner.render();
    await delay(3000);
} while (!conn);

connectionCheckSpinner.succeed(chalk.bold.green('Terhubung!\n'));
connectionCheckSpinner.stop();

const steps = [
    loadDatabase,
    _quickTest,
    filesInit,
    watchFiles,
    reloadHandlerStep,
    reloadDiscordBot,
    watchPluginStep
];

const mainSpinner = ora({
    text: chalk.bold.yellow('Proses sedang berlangsung...'),
    spinner: 'moon'
}).start();

const executeStep = async (step, index) => {
    mainSpinner.text = chalk.bold.yellow(`Proses ${chalk.cyan(index + 1)}/${chalk.yellow(steps.length)} sedang berlangsung...`);
    await delay(index * 3000);

    try {
        const result = await step();
        mainSpinner.succeed(chalk.bold.green(`Proses ${chalk.cyan(index + 1)}/${chalk.yellow(steps.length)} berhasil diselesaikan!`));
        return result;
    } catch (error) {
        mainSpinner.fail(chalk.bold.red(`Error in step ${chalk.cyan(index + 1)}/${chalk.yellow(steps.length)}: ${error}`));
        console.error(chalk.bold.red(`Error in step ${chalk.cyan(index + 1)}/${chalk.yellow(steps.length)}: ${error}`));
        return `Error in step ${chalk.cyan(index + 1)}/${chalk.yellow(steps.length)}: ${error}`;
    }
};

await Promise.all(steps.map(executeStep))
    .then(results => {
        results.forEach(result => {
            if (typeof result === 'string') {
                console.error(chalk.bold.red(result));
            }
        });
        mainSpinner.succeed(chalk.bold.green('Semua proses berhasil diselesaikan!'));
    })
    .catch(error => {
        mainSpinner.fail(chalk.bold.red(`${error}`));
    })
    .finally(() => {
        mainSpinner.stop();
    });

async function reloadHandlerStep() {
    try {
        await global.reloadHandler(true);
        console.log(chalk.bold.green('Reload Handler Step selesai.'));
    } catch (error) {
        throw new Error(chalk.bold.red(`Error in reload handler step: ${error}`));
    }
}

async function reloadDiscordBot() {
    try {
        await import('/storage/emulated/0/code/DiscordBot/bot.js')
        console.log(chalk.bold.green('Reload Discord Bot selesai.'));
    } catch (error) {
        throw new Error(chalk.bold.red(`Error in reload discord bot: ${error}`));
    }
}

async function watchPluginStep() {
    try {
        await watch(pluginFolder, global.reload);
        console.log(chalk.bold.green('Watch Plugin Step selesai.'));
    } catch (error) {
        throw new Error(chalk.bold.red(`Error in watch plugin step: ${error}`));
    }
}

async function _quickTest() {
    const binaries = [
        'ffmpeg',
        'ffprobe',
        ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-'],
        'convert',
        'magick',
        'gm',
        ['find', '--version'],
    ];

    try {
        const testResults = await Promise.all(binaries.map(async binary => {
            const [command, ...args] = Array.isArray(binary) ? binary : [binary];
            const process = spawn(command, args);

            try {
                const closePromise = new Promise(resolve => process.on('close', code => resolve(code !== 127)));
                const errorPromise = new Promise(resolve => process.on('error', _ => resolve(false)));

                return await Promise.race([closePromise, errorPromise]);
            } finally {
                process.kill();
            }
        }));

        const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = testResults;
        const support = {
            ffmpeg,
            ffprobe,
            ffmpegWebp,
            convert,
            magick,
            gm,
            find,
        };

        Object.freeze(global.support = support);
    } catch (error) {
        console.error(`Error in Quick Test: ${error.message}`);
    }
}

global.lib = {};

const libFiles = async (dir, currentPath = '') => {
    try {
        const files = readdirSync(dir, {
            withFileTypes: true
        });

        await Promise.all(files.map(async (file) => {
            const filePath = path.join(dir, file.name);
            const relativePath = path.join(currentPath, file.name);

            if (file.isFile() && /\.js$/i.test(file.name)) {
                try {
                    const {
                        default: module
                    } = await import(filePath);
                    setNestedObject(global.lib, relativePath.slice(0, -3), module || (await import(filePath)));
                } catch (importErr) {
                    console.error(`Error importing ${relativePath}:`, importErr);
                }
            } else if (file.isDirectory()) {
                await libFiles(filePath, relativePath);
            }
        }));
    } catch (readDirErr) {
        console.error('Error reading directory:', readDirErr);
        throw readDirErr;
    }
};

libFiles(path.join(process.cwd(), 'lib'))
    .then(() => console.log(chalk.bold.green('Created Global Lib Successfully!')))
    .catch((err) => console.error(chalk.bold.red('Unhandled error:'), err));

function clockString(ms) {
    if (isNaN(ms)) return '-- Hari -- Jam -- Menit -- Detik';
    const units = ['Hari', 'Jam', 'Menit', 'Detik'].map((label, i) => ({
        label,
        value: Math.floor(i < 2 ? ms / (86400000 / [1, 24][i]) : ms / [60000, 1000][i - 2]) % ([1, 60][i < 2 ? 0 : 1])
    }));
    return units.map(unit => `${unit.value.toString().padStart(2, '0')} ${unit.label}`).join(' ');
}