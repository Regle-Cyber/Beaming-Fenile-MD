import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'


/*=========== MODULES ===========*/
import yts from 'yt-search'
import { toAudio, ffmpeg } from './lib/converter.js'
import booru from 'booru'
import { Pixiv } from '@ibaraki-douji/pixivts'
const pixiv = new Pixiv()


/*=========== API ===========*/
global.openai_key = 'sk-0'
global.openai_org_id = 'org-3'
global.APIs = {
        amel: "https://melcanz.com",
        bg: "http://bochil.ddns.net",
        dhnjing: "https://dhnjing.xyz",
        dzx: "https://api.dhamzxploit.my.id",
        fdci: "https://api.fdci.se",
        hardianto: "https://hardianto.xyz",
        lolhuman: "https://api.lolhuman.xyz",
        neoxr: "https://api.neoxr.my.id",
        pencarikode: "https://pencarikode.xyz",
        xteam: "https://api.xteam.xyz",
        xyro: "https://api.xyroinee.xyz",
        zeks: "https://api.zeks.xyz",
        zenz: "https://api.zahwazein.xyz",
        btchx: "https://api.botcahx.biz.id"
    }

    /*Apikey*/
global.APIKeys = {
        "https://api.neoxr.my.id": "lucycat",
        "https://api.lolhuman.xyz": pickRandom(["e1a815979e6adfc071b7eafc", "ed78c137a46873c5b8e5fe3b"]),
        "https://api.xteam.xyz": "HIRO",
        "https://api.xyroinee.xyz": "yqiBQF86F4",
        "https://api.zeks.xyz": "apivinz",
        "https://hardianto.xyz": "hardianto",
        "https://melcanz.com": "manHkmst",
        "https://pencarikode.xyz": "pais",
        "https://api.zahwazein.xyz": "zenzkey_1ec92f71d3bb",
        "https://api.botcahx.biz.id": "Admin"
}
/* Randomizer */
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
/*=========== RPG ICON ===========*/
global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment	

global.rpg = { //Solo emojis 
emoticon(string) {
string = string.toLowerCase()
    let emott = {
      level: '🧬',
      wintergem: '❄️',
      limit: '💳',
      exp: '⚡',
      bank: '🏦',
      diamond: '💎',
      health: '❤️',
      kyubi: '🌀',
      joincount: '🪙',
      emerald: '❇️',
      stamina: '☕',
      role: '🎖️',
      premium: '🎟️',
      pointxp: '📧',
      gold: '✴️',
      trash: '🗑',
      chip: '⚛️',
      crystal: '🔮',
      copper: '🔶',
      stone: '🪨',
      lapislazuli: '🔷',
      intelligence: '🧠',
      string: '🧵',
      keygold: '🔑',
      keyiron: '🗝️',
      emas: '🪅',
      fishingrod: '🎣',
      gems: '🍀',
      magicwand: '⚕️',
      mana: '🪄',
      agility: '🤸‍♂️',
      darkcrystal: '♠️',
      iron: '🔩',
      coal: '🕳️',
      rock: '🪨',
      roti: '🍞',
      potion: '🥤',
      superior: '💼',
      robo: '🚔',
      upgrader: '🧰',
      wood: '🪵',
      strength: '🦹‍ ♀️',
      arc: '🏹',
      armor: '🥼',
      bow: '🏹',
      pickaxe: '⛏️',
      axe: '🪓',
      sword: '⚔️',
      common: '📦',
      uncommon: '🥡',
      mythic: '🗳️',
      legendary: '🎁',
      petfood: '🍖',
      pet: '🍱',
      anggur: '🍇',
      apel: '🍎',
      jeruk: '🍊',
      mangga: '🥭',
      pisang: '🍌',
      bibitanggur: '🌾',
      bibitapel: '🌾',
      bibitjeruk: '🌾',
      bibitmangga: '🌾',
      bibitpisang: '🌾',
      ayam: '🐓',
      babi: '🐖',
      Jabali: '🐗',
      bull: '🐃',    
      buaya: '🐊',    
      cat: '🐈',      
      centaur: '🐐',
      chicken: '🐓',
      cow: '🐄', 
      dog: '🐕',
      dragon: '🐉',
      elephant: '🐘',
      fox: '🦊',
      giraffe: '🦒',
      griffin: '🦅', 
      horse: '🐎',
      kambing: '🐐',
      kerbau: '🐃',
      lion: '🦁',
      money: '💰',
      monyet: '🐒',
      panda: '🐼',
      snake: '🐍',
      phonix: '🕊️',
      rhinoceros: '🦏',
      wolf: '🐺',
      tiger: '🐅',
      cumi: '🦑',
      udang: '🦐',
      ikan: '🐟',
      orca: '🐳',
      paus: '🐋',
      lumba: '🐬',
      hiu: '🦈',
      lele: '🐟',
      bawal: '🐟',
      nila: '🐟',
      lobster: '🦞',
      kepiting: '🦀',
      gurita: '🐙',
      fideos: '🍝',
      ramuan: '🧪',
      knife: '🔪',
      umpan: '🪱',
      skata: '🧩',
      creditscore: '🧩'
    }
let results = Object.keys(emott).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
if (!results.length) return ''
else return emott[results[0][0]]
}}

/*=========== Modules ===========*/
global.ytc = yts
global.toAudio = toAudio
global.ffmpeg = ffmpeg
global.booru = booru

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright("Update 'api.js'"))
import(`${file}?update=${Date.now()}`)})
