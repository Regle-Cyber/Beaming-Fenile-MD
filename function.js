import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import fetch from 'node-fetch'
import cp, { exec as _exec, spawn } from 'child_process';
global.cp = cp
global.exc = (cmd) => spawn(cmd, [], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
});

import * as stiker from './lib/sticker.js'
global.stikerjs = stiker
import savetube from "./lib/downloader/savetube.js"
import * as NodeID3 from "node-id3"
import nhentai from "nhentai"
global.nhentai = new nhentai.API();
global.Test = await global.nhentai.search("lolicon")

//Special Function
global.reloadCmd = function() {
    let cmd = []
    for (let name in global.plugins) {
        let plugin = global.plugins[name]
        if (!plugin)
            continue
        if (plugin.command instanceof RegExp) cmd.push(plugin.command)
    }
    return cmd
}

global.generateUID = function() {
  return Date.now() + Math.random();
}
global.generateNumericUID = function(length) {
  let uid = '';
  for (let i = 0; i < length; i++) {
    uid += Math.floor(Math.random() * 10).toString();
  }
  return parseInt(uid);
}


//Other Function
function getHeaders() {
    return {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://www.youtube.com/',
        Origin: 'https://www.youtube.com',
    };
}

global.delay = time => new Promise(res => setTimeout(res, time))
global.pickRandom = function(list) {
    return list[Math.floor(Math.random() * list.length)];
}
global.getRandomHexColor = function() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}
Number.prototype.toNominal = function(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Add to String prototype
String.prototype.formatNumber = function() {
    return this.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Add to Number prototype
Number.prototype.formatNumber = function() {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

//global.Test = await conn.getFile("/storage/emulated/0/Pictures/100PINT/Pins/cd59e6600ddb9e40b309603b50dd890e.jpg")

//Downloader
global.toAudio = async function(url) {
    let res = await savetube.download(url, "mp3")
    console.log(res)
    return res.result
}
global.cobaltAudio = async function(videoUrl) {
    const res = await axios({
        method: 'POST',
        url: 'https://nachos.imput.net/',
        data: JSON.stringify({
            url: videoUrl,
            videoQuality: '720',
            youtubeVideoCodec: 'h264',
            audioFormat: 'mp3',
            filenameStyle: 'classic',
            disableMetadata: false,
            downloadMode: 'audio'
        }),
        headers: getHeaders()
    })
    console.log(res.data)
    return res.data.url
    if (res.status !== 200) {
        throw Error(`Error: Something went wrong while fetching the audio file. (${response.error.code || response.text || response.statusText || ''})`);
    }
}
global.addMp3 = async function(path, title, author, album) {
    const tags = {
        title: title,
        artist: author,
        album: album || ""
    }
    await NodeID3.default.write(tags, path)
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.cyan("[Whatsapp Bot] Update 'function.js'"))
    import(`${file}?update=${Date.now()}`)
})