import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import axios from 'axios'
import cron from "node-cron"
import { toVideo } from "./lib/converter.js"

import savetube from "./lib/downloader/savetube.js"
import * as NodeID3 from "node-id3"

//Special Function
global.findCommand = function(commandString) {
    const matchingCommands = [];
    // Iterate through all plugins
    for (const pluginName in global.plugins) {
        const plugin = global.plugins[pluginName];

        // Skip plugins that don't exist or don't have a command property
        if (!plugin || !(plugin.command instanceof RegExp)) {
            continue;
        }

        // Check if the command string matches the plugin's command RegExp
        const regex = plugin.command.toString()
        if (regex.match(commandString)) {
            let result = plugin.command.source
            matchingCommands.push(result.replace(/[\^$()]/g, ''));
        }
    }

    return matchingCommands;
};

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

global.generateOTP = function(length) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

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
    if (res.status !== 200) {
        throw Error(`Error: Something went wrong while fetching the audio file. (${response.error.code || response.text || response.statusText || ''})`);
    }
    return res.data.url
}
global.addMp3 = async function(path, title, author, album) {
    const tags = {
        title: title,
        artist: author,
        album: album || ""
    }
    await NodeID3.default.write(tags, path)
}
global.instagramdl = async (link) => {
    try {
        const data = await axios("https://fastdl.app/api/convert", {
            method: "POST",
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            data: {
                "url": link,
                "ts": 1717886361080,
                "_ts": 1717498039111,
                "_tsc": 2178064,
                "_s": "881325deb3a090678823ebc67026858605bca3f91df3f3b96e0eaac7965a9754"
            }
        })
        let result = {
            status: 200,
            creator: "DitzOfc",
            result: data.data
        }
        return result;
    } catch (er) {
        console.error(er)
    }
}

//Grow A Garden API
global.checkStock = async function() {
    try {
        const url = "https://www.vulcanvalues.com/grow-a-garden/stock";
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const stockData = [];

        // Find all stock sections (similar to gardenscraper.py)
        const stockSections = $('.grid-cols-1').first().children('div');

        stockSections.each((_, section) => {
            const title = $(section).find('h2').text().trim();
            const items = [];

            $(section).find('li').each((_, item) => {
                const name = $(item).find('span').first().text().split('x')[0].trim();
                const quantity = $(item).find('span.text-gray-400').text().trim();
                items.push({
                    name,
                    quantity
                });
            });

            stockData.push({
                section: title,
                items: items
            });
        });
        let json = {
            status: true,
            code: `${stockData[2].items[0].quantity}${stockData[2].items[1].quantity}${stockData[2].items[2].quantity}`,
            seeds: stockData[2].items,
            gear: stockData[0].items,
            egg: stockData[1].items,
            event: false //stockData[3].items
        }
        return json
    } catch (error) {
        throw new Error(error)
    }
}

global.checkStock2 = async function() {
    try {
        const response = await axios.get('https://growagardenvalues.com/stock/stocks.php');
        const html = response.data;
        const $ = cheerio.load(html);

        const stockData = {};

        // Helper function tanpa image
        const extractSection = (key, selector) => {
            stockData[key] = [];
            $(selector).each((i, el) => {
                stockData[key].push({
                    name: $(el).find('.item-name').text().trim(),
                    quantity: $(el).find('.item-quantity').text().trim()
                });
            });
        };

        extractSection('seeds', '#seeds-section .stock-item');
        extractSection('gear', '#gears-section .stock-item');
        extractSection('egg', '#eggs-section .stock-item');
        extractSection('event', '#event-shop-stock-section .stock-item');
        extractSection('cosmetics', '#cosmetics-section .stock-item');

        return {
            status: true,
            code: `${stockData.seeds[0].quantity}${stockData.seeds[1].quantity}${stockData.seeds[2].quantity}`,
            ...stockData
        }
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        throw new Error('Failed to scrape data.');
    }
}

function gagLogger(text) {
    return console.log(chalk.bgRed(`Grow a Garden `), "[" + Date().replace("(Western Indonesia Time)", "").trim() + `]: ${text}`)
}

//change "120363368482044182@g.us" to your group
global.checkStockDM = async function() {
    if (!global.setting.checkStockDM) return
    //gagLogger(global.stockTestSeeds)
    if (global.stockReloadCount == 0) gagLogger("Check stock...")
    let stock = await global.checkStock2().catch(async (_) => await global.checkStock())
    if (global.hasLostConnection) {
        global.hasLostConnection = false
        await delay(40000)
        return global.checkStockDM()
    }
    if (!stock) {
        //global.hasLostConnection = true
        return gagLogger(`Request Data API Error!`)
        /*global.stockReloadCount += 1
        return global.checkStockDM()*/
    }
    if (stock?.seeds?.length == 0) {
        gagLogger("Stock kosong, memulai ulang!")
        await delay(5000)
        return global.checkStockDM()
    }
    if (stock.code == global.stockTestSeeds && global.stockReloadCount < 5) {
        global.stockReloadCount += 1
        gagLogger(`Stock sama, memulai ulang ke ${global.stockReloadCount}/5!`)
        await delay(10000)
        return global.checkStockDM()
    }
    //if (global.stockReloadCount > 3) stock = await global.checkStock2()
    global.stockTestSeeds = stock.code
    global.stockReloadCount = 0
    let resultNameSeeds = []
    let resultNameGear = []
    let resultNameEgg = []
    let eggCodeR = []
    for (let i = 0; i < stock.seeds.length; i++) {
        let name = stock.seeds[i].name
        if (name.toLowerCase().match(/(beanstalk|ember|sugar|grape|mushroom|feijoa|loquat|pitcher plant)/gi)) {
            resultNameSeeds.push(`${gag.emoticon(name)} *${name}*`)
        }
    }
    for (let i = 0; i < stock.gear.length; i++) {
        let name = stock.gear[i].name
        if (name.toLowerCase().match(/(master sprinkler)/gi)) {
            resultNameGear.push(`${gag.emoticon(name)} *${name}*`)
        }
    }
    for (let i = 0; i < stock.egg.length; i++) {
        let name = stock.egg[i].name
        eggCodeR.push(name)
        if (name.toLowerCase().match(/(paradise|bug|bee)/gi)) {
            resultNameEgg.push(`${gag.emoticon(name)} *${name}*`)
        }
    }
    if (resultNameSeeds.length) {
        if (resultNameSeeds.join(" ").toLowerCase().match(/(beanstalk|ember|sugar apple|pitcher plant)/gi))
        await conn.reply("120363368482044182@g.us", `${resultNameSeeds.join(", ")} Seeds are in Stocks!`, 0, {
            ephemeralExpiration: 86400
        })
    }
    if (resultNameGear.length) {
        if (resultNameGear.join(" ").toLowerCase().match(/(master)/gi))
        await conn.reply("120363368482044182@g.us", `${resultNameGear.join(", ")} are in Stocks!`, 0, {
            ephemeralExpiration: 86400
        })
    }
    if (resultNameEgg.length && !(eggCodeR.join(", ") == global.eggCode)) {
        global.eggCode = eggCodeR.join(", ")
        await conn.reply("120363368482044182@g.us", `${resultNameEgg.join(", ")} are in Stocks!`, 0, {
            ephemeralExpiration: 86400
        })
    }
    gagLogger("Checking Stock successful with status code: " + stock.code)
    return true
}

global.gag = { //Solo emojis 
    emoticon(string) {
        string = string.toLowerCase()
        let emott = {
            //summer stocks
            cauliflower: "🥬",
            pineapple: "🍍",
            "green apple": "🍏",
            rafflesia: "🌺",
            banana: "🍌",
            avocado: "🥑",
            kiwi: "🥝",
            "bell pepper": "🫑",
            "prickly pear": "🍐",
            feijoa: "🫒",
            loquat: "🍊",
            "pitcher plant": "🎋",
            "common summer egg": "🟡",
            "rare summer egg": "🔵",
            "paradise egg": "⛱️",
            //common stocks
            carrot: "🥕",
            strawberry: "🍓",
            blueberry: "🫐",
            daffodil: "🪻",
            "orange tulip": "🌷",
            tomato: "🍅",
            bamboo: "🎍",
            coconut: "🥥",
            "sugar apple": "🍏",
            apple: "🍎",
            corn: "🌽",
            pumpkin: "🎃",
            watermelon: "🍉",
            "dragon fruit": "🐉",
            cactus: "🌵",
            mango: "🥭",
            mushroom: "🍄",
            grape: "🍇",
            pepper: "🌶️",
            cacao: "🍫",
            beanstalk: "🫛",
            "ember lily": "🏵️",
            //gear stocks
            "watering can": "🚿",
            trowel: "🪏",
            "basic sprinkler": "💦",
            "advanced sprinkler": "🌊",
            "godly sprinkler": "✨",
            "master sprinkler": "👑",
            "lightning rod": "⚡",
            "favorite tool": "❤️",
            "harvest tool": "🧹",
            "cleaning spray": "💧",
            "recall wrench": "🔧",
            "friendship pot": "🪴",
            "tanning mirror": "🪞",
            "magnifying glass": "🔎",
            //egg stocks
            "uncommon egg": "🟤",
            "common egg": "⚪",
            "rare egg": "🔵",
            "legendary egg": "🟠",
            "mythical egg": "🔴",
            "bug egg": "🟢",
            "bee egg": "🍯"
        }
        let results = Object.keys(emott).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
        if (!results.length) return ''
        else return emott[results[0][0]]
    }
}

/*let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.cyan("[Whatsapp Bot] Update 'function.js'"))
    import(`${file}?update=${Date.now()}`)
})*/