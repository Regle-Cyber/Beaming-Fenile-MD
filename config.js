import {watchFile, unwatchFile} from 'fs'
import chalk from 'chalk'
import {fileURLToPath} from 'url'
import fs from 'fs' 
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'


/*============= USER =============*/
global.botnumber = "6288268132898"
global.nomorowner = "6288286623228"
global.owner = [
  ['6288286623228', 'Creator', false],
  ['6285841854544', 'Creator', false]
]
global.mods = []
global.suittag = []
global.prems = []

global.setting = { markAsOnline: true, autoread: true, nyimak: false, clearTmp: false }
/*============= WAKTU =============*/
let wibh = moment.tz('Asia/Jakarta').format('HH')
    let wibm = moment.tz('Asia/Jakarta').format('mm')
    let wibs = moment.tz('Asia/Jakarta').format('ss')
    let wktuwib = `${wibh} H ${wibm} M ${wibs} S`
    
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

/*============== WATERMARK ==============*/
global.packname = 'Alamak 😨'
global.wm = 'Kanako - Bot'
global.wm2 = `▸ ${date}\n▸ Beaming Fenile - Bot`
global.wm3 = '⫹⫺ Kanako 𝗕𝗢𝗧'
global.botdate = `⫹⫺ 𝗗𝗮𝘁𝗲: ${week} ${date}`
global.bottime = `𝗧 𝗜 𝗠 𝗘 : ${wktuwib}`
global.titlebot = '🌱 ┊ 𝗥𝗣𝗚 Whatsapp ʙᴏᴛ'
global.author = 'Created by Kanako - Bot'
global.iconBot = fs.readFileSync('./thumbnail.png')
/*============== SOCIAL ==============*/

global.sig = ' '
global.sgh = ' '
global.sgc = ' '
global.snh = 'https://nhentai.net/g/365296/'

/*============== NOMOR ==============*/
global.nomorbot = '6288276549486'
global.nomorown = '6285841854544'
global.namebot = 'Kanako - Bot'
global.nameown = 'Regleツ'
global.dm = []

/*=========== FAKE SIZE ===========*/
global.fsizedoc = '99999999999999' // default 10TB
global.fpagedoc = '999'

/*============== LOGO ==============*/
global.thumb = 'https://lh3.googleusercontent.com/pw/AP1GczMDUtvV3ZyRIwBIzvBur7uM-pP3cS0OG0yjqidhUhVX0jWkwAwKr93Ci6zmdL1OeCKIFRdbRgliw0vPVoIgrKwtmnypIjarOZm-8fifJBHyHxxM-W-HtenuzWrvabXxxcljX5x6asUxkvp4cWkYRTCh=w642-h478-s-no-gm?authuser=0' //Main Thumbnail
global.thumb2 = 'https://telegra.ph/file/327311140621feef10e65.png'
global.thumbbc = 'https://telegra.ph/file/d389f4acafac741f6592c.jpg' //For broadcast
global.giflogo = 'https://telegra.ph/file/a46ab7fa39338b1f54d5a.mp4'

global.fla = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text='
global.hwaifu = 'https://api.lolhuman.xyz/api/random/art?apikey=IchanZX'

/*=========== HIASAN ===========*/
// DEFAULT MENU
global.dmenut = '❏═┅═━–〈' //top
global.dmenub = '┊•' //body
global.dmenub2 = '┊' //body for info cmd on Default menu
global.dmenuf = '┗––––––––––✦' //footer

// COMMAND MENU
global.dashmenu = '┅━━━━━═┅═❏ *DASHBOARD* ❏═┅═━━━━━┅'
global.cmenut = '❏––––––『'                       //top
global.cmenuh = '』––––––'                        //header
global.cmenub = '┊✦ '                            //body
global.cmenuf = '┗━═┅═━––––––๑\n'                //footer
global.cmenua = '\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n     ' //after
global.pmenus = '┊'                              //pembatas menu selector

global.htki = '––––––『' // Hiasan Titile (KIRI)
global.htka = '』––––––' // Hiasan Title  (KANAN)
global.lopr = 'Ⓟ' //LOGO PREMIUM ON MENU.JS
global.lolm = 'Ⓛ' //LOGO FREE ON MENU.JS
global.htjava = '⫹⫺'    //hiasan Doang :v
global.hsquere = ['⛶','❏','⫹⫺']

/*============== OTHER ==============*/
global.gt = 'Beaming Fenile - Bot'
global.hello = 'Niga'
global.wait = '_🕚 Mohon tunggu, dalam proses!_'
global.pdoc = ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/msword', 'application/pdf', 'text/rtf']
global.fgif = {key: {participant: '0@s.whatsapp.net'}, message: {'videoMessage': {'title': wm, 'h': `Hmm`, 'seconds': '999999999', 'gifPlayback': 'true', 'caption': bottime, 'jpegThumbnail': global.iconBot}}}
global.multiplier = 99
global.maxwarn = 10
global.flaaa = [
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=',
  'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
  'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text=',
]
global.pixivCookie = "login_ever=yes; first_visit_datetime=2025-05-01%2001%3A51%3A05; webp_available=1; cc1=2025-05-01%2001%3A51%3A05; __cf_bm=1xiyoGIGQw2Rcwm.zSNRaYnsn9dLPFVE5hQDn.fN2OQ-1746031865-1.0.1.1-Oa1Qa7pOnByrRh9ahZdqUrM0BEaXdIbUi4AKx3RTzjXcCN2sXtLrEHh5xezAG0RHZdXPPOsdX4AaNzbJLjMhTfQcFVzkhHeYXzxdbe.eQ45j0xz9n4pYJnUpsTzQKXIC; p_ab_id=7; p_ab_id_2=6; p_ab_d_id=1115790721; street_tutorial=1; _ga=GA1.1.1126413534.1746031871; first_visit_datetime_pc=2025-05-01%2001%3A51%3A40; _ga_MZ1NL4PHH0=GS1.1.1746031906.1.0.1746031912.0.0.0; PHPSESSID=93681191_BI9I5Fj4DlRnfWXX3OXHK8lzTWu5DpTz; device_token=730d88d7b1d29703e9633c203717ea65; c_type=24; privacy_policy_agreement=0; privacy_policy_notification=0; a_type=0; b_type=0; _ga_75BBYNYN9J=GS1.1.1746031871.1.1.1746031920.0.0.0;"

global.filterWord = /nigga|boobs|hentai|nude|(ass)|fuck|dick|niga|niger|annal|furry|femboy|(gay)|kontol|pussy|vagina/i

const file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright('Update \'config.js\''))
  import(`${file}?update=${Date.now()}`)
})
