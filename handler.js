import { generateWAMessageFromContent } from "@adiwajshing/baileys"
import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import fs from 'fs'
import chalk from 'chalk'

/**
 * @type {import('@adiwajshing/baileys')}
 */
const { proto } = (await import('@adiwajshing/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function() {
    clearTimeout(this)
    resolve()
}, ms))

/**
 * Handle messages upsert
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate 
 */
export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return
    if (global.db.data == null) await global.loadDatabase()
    /* Credits from Regle (https://wa.me/6288286623228) */

    /*------------------------------------------------*/
    try {
        m = smsg(this, m) || m
        if (!m)
            return
        m.exp = 0
        m.money = false
        m.limit = false
        try {
            // TODO: use loop to insert data instead of this
            let user = global.db.data.users[m.sender]

            /*------------------------------------------------*/
            if (typeof user !== 'object')
                global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.exp)) user.exp = 0
                if (!isNumber(user.expshards)) user.expshards = 0
                if (!isNumber(user.level)) user.level = 0
                if (!('premium' in user)) user.premium = false
                if (!isNumber(user.commandActions)) user.commandActions = 0
                if (!isNumber(user.commandActionsTotal)) user.commandActionsTotal = 0
                if (!isNumber(user.wintergem)) user.wintergem = 0
                if (!isNumber(user.limit)) user.limit = 20
                if (!isNumber(user.money)) user.money = 20000
                if (!isNumber(user.creditscore)) user.creditscore = 100
                if (!user.registered) {
                    if (!('registered' in user)) user.registered = false
                    if (!('name' in user)) user.name = m.name
                    if (!isNumber(user.age)) user.age = -1
                    if (!isNumber(user.premiumDate)) user.premiumDate = -1
                    if (!isNumber(user.regTime)) user.regTime = -1
                }
                if (!isNumber(user.afk)) user.afk = -1
                if (!isNumber(user.atm)) user.atm = 0
                if (!isNumber(user.fullatm)) user.fullatm = 0
                if (!isNumber(user.bank)) user.bank = 0
                if (!('autolevelup' in user)) user.autolevelup = false
                if (!('role' in user)) user.role = 'None'
                if (!isNumber(user.health)) user.health = 100
                if (!isNumber(user.potion)) user.exp = 10
                if (!user.premium) user.premium = false
                if (!user.premium) user.premiumTime = 0
                if (!isNumber(user.roti)) user.roti = 10
                if (!isNumber(user.stamina)) user.stamina = 100
            } else
                global.db.data.users[m.sender] = {
                    afk: -1,
                    afkReason: '',
                    age: -1,
                    autolevelup: false,
                    atm: 0,
                    bank: 0,
                    banned: false,
                    BannedReason: '',
                    lastBanned: -1,
                    creditscore: 100,
                    commandActions: 0,
                    commandActionsTotal: 0,
                    exp: 0,
                    expshards: 0,
                    fullatm: 0,
                    health: 100,
                    lastcreditscore: -1,
                    limit: 20,
                    level: 0,
                    money: 20000,
                    name: m.name,
                    potion: 10,
                    premium: false,
                    premiumDate: -1,
                    premiumTime: 0,
                    registered: false,
                    regTime: -1,
                    role: 'None',
                    roti: 10,
                    stamina: 100,
                    warn: 0,
                    wintergem: 0
                }
            delete global.db.data.users["undefined"]
            //RPG items
            let items = global.db.data.users[m.sender].items
		    if (typeof items !== 'object')
			global.db.data.users[m.sender].items = {}
		    if (items) {
		        if (!isNumber(items.coal)) items.coal = 0
		        if (!isNumber(items.copper)) items.copper = 0
		        if (!isNumber(items.diamond)) items.diamond = 5
		        if (!isNumber(items.emerald)) items.emerald = 0
		        if (!isNumber(items.gold)) items.gold = 0
		        if (!isNumber(items.iron)) items.iron = 0
		        if (!isNumber(items.lapislazuli)) items.lapislazuli = 0
		        if (!isNumber(items.stone)) items.stone = 0
		        if (!isNumber(items.wood)) items.wood = 0
		        if (!isNumber(items.trash)) items.trash = 0
		        if (!isNumber(items.string)) items.string = 0
	        } else
		        global.db.data.users[m.sender].items = {
		            coal: 0,
		            copper: 0,
		            diamond: 5,
		            emerald: 0,
		            gold: 0,
		            iron: 0,
		            lapislazuli: 0,
		            stone: 0,
		            wood: 0,
		            trash: 0,
		            string: 0
				}
            //Some code not used
            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object')
                global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat)) chat.isBanned = false
                if (!('gcMode' in chat)) chat.gcMode = false
                if (!('cPrefix' in chat)) chat.cPrefix = ''
                if (!('welcome' in chat)) chat.welcome = false
                if (!('delete' in chat)) chat.delete = true
                if (!('nsfw' in chat)) chat.nsfw = false
                if (!('autosticker' in chat)) chat.autosticker = false
                if (!('antiLink' in chat)) chat.antiLink = false
                if (!('antiviewonce' in chat)) chat.antiviewonce = false
                if (!('antiToxic' in chat)) chat.antiToxic = false
                if (!isNumber(chat.expired)) chat.expired = 0
            } else
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    gcMode: false,
                    cPrefix: '',
                    welcome: false,
                    delete: true,
                    nsfw: false,
                    autosticker: false,
                    antiLink: false,
                    antiviewonce: false,
                    antiToxic: false,
                    expired: 0,
                }
            delete global.db.data.chats["undefined"]
            //This code is not used, but change in 'config.js'
            let settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('composing' in settings)) settings.composing = false
                if (!('restrict' in settings)) settings.restrict = true
                if (!('autorestart' in settings)) settings.autorestart = true
                if (!isNumber(settings.restartDB)) settings.restartDB = 0
                if (!('backup' in settings)) settings.backup = false
                if (!isNumber(settings.backup4)) settings.backupDB = 0
                if (!('cleartmp' in settings)) settings.cleartmp = false
                if (!isNumber(settings.lastcleartmp)) settings.lastcleartmp = 0
                if (!isNumber(settings.status)) settings.status = 0
                if (!('anticall' in settings)) settings.anticall = true
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                composing: false,
                restrict: true,
                autorestart: true,
                restartDB: 0,
                backup: false,
                backupDB: 0,
                cleartmp: false,
                lastcleartmp: 0,
                status: 0,
                anticall: true,
            }
        } catch (e) {
            console.error(e)
        }
        if (opts['nyimak'])
            return
        if (!m.fromMe && opts['self'])
            return
        if (opts['pconly'] && m.chat.endsWith('g.us'))
            return
        if (opts['gconly'] && !m.chat.endsWith('g.us'))
            return
        if (opts['swonly'] && m.chat !== 'status@broadcast')
            return
        if (typeof m.text !== 'string')
            m.text = ''

        const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isPrems = isROwner || isOwner || isMods || global.db.data.users[m.sender].premiumTime > 0 //|| global.db.data.users[m.sender].premium = 'true'

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque,
                time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function() {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {} // User Data
        const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == this.user.jid) : {}) || {} // Your Data
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false // Is User Admin?
        const isBotAdmin = bot?.admin || false // Are you Admin?

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    // if (typeof e === 'string') continue
                    console.error(e)
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    // global.dfail('restrict', m, this)
                    continue
                }
            let chat = global.db.data.chats[m.chat] || {}
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            const cprefix2 = new RegExp(chat.cPrefix || conn.prefix)
            let _prefix = plugin.customPrefix ? plugin.customPrefix : chat.cPrefix ? cprefix2 : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [
                    [_prefix.exec(m.text), _prefix]
                ] :
                Array.isArray(_prefix) ? // Array?
                _prefix.map(p => {
                    let re = p instanceof RegExp ? // RegExp in Array?
                        p :
                        new RegExp(str2Regex(p))
                    return [re.exec(m.text), re]
                }) :
                typeof _prefix === 'string' ? // String?
                [
                    [new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]
                ] : [
                    [
                        [], new RegExp
                    ]
                ]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                        match,
                        conn: this,
                        participants,
                        groupMetadata,
                        user,
                        bot,
                        isROwner,
                        isOwner,
                        isRAdmin,
                        isAdmin,
                        isBotAdmin,
                        isPrems,
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                if (global.setting.nyimak) return
                if (m.text == usedPrefix) return
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                    plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                        cmd.test(command) :
                        cmd === command
                    ) :
                    typeof plugin.command === 'string' ? // String?
                    plugin.command === command :
                    false

                if (!isAccept)
                    continue
                name = await name.split('\\').pop().split('/').pop()
                m.plugin = name
                m.isHasCommand = true
                if (typeof plugin.tags == "undefined") plugin.tags = ["unknown"]
                console.log(plugin)
                await conn.sendPresenceUpdate('composing', m.chat)
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    let botSpam = global.db.data.settings[this.user.jid]
                    if (name != '_-creditscore.js' && name != 'exp-profile.js' && name != '_cmdnotfound.js' && user?.banned && !isOwner)
                        return conn.reply(m.chat, `You has Banned to use Bot for ${((user.lastBanned) - new Date()).toTimeString()}. ${user.BannedReason ? `*Reason:* ${user.BannedReason}` : ''}`, m, {
                            contextInfo: {
                                externalAdReply: {
                                    title: global.wm,
                                    body: '404 Access denied ✘',
                                    sourceUrl: global.sgh,
                                    thumbnail: global.iconBot
                                }
                            }
                        })
                    
                    //Admin Mode
                    let adminMode = global.db.data.chats[m.chat].gcMode
                    if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin) {
                        conn.sendPresenceUpdate('paused', m.chat)
                        return
                    }
                    
                    //Required from User
                    //if (name.match("game-") && !isOwner) return dfail("mtnc", m, conn)
                    if (!plugin.tags.includes("main") && !m.isGroup && user.registered == false)
                        return dfail("You need permission from *Owner* to use bot!", m, this)
                    if (name.match("rpg2-") && !isOwner)
                        return dfail("Command *RPG* not available for now!", m, this)
                    if (!name.match("exp-") && user.registered == false && !isOwner)
                        return dfail("unreg", m, this)
                    /*if (m.sender.match("82181537882") && m.isGroup && name.match("pin"))
                        return dfail("You cannot use command *.pin* in Group!", m, this)*/
                    if (global.filterWord.test(text)) {
                        console.log(global.filterWord.exec(text))
                        if (plugin.tags.includes("image") && !chat.nsfw) {
                            if (!m.isGroup) {
                                dfail("Bad Word has detect, please activate nsfw using command *.on nsfw*!", m, this)
                                return
                            } else {
                                if (isAdmin) return dfail("Bad Word has detect!!\n> Jika kamu Admin, 🧩 Creditscore tidak di kurangi.", m, this)
                                dfail("Bad Word has detect!!\n🧩 Creditscore -5", m, this)
                                user.creditscore -= 5
                                return
                            }
                        }
                    }
                    
                    //Group Mode    
                    //    if (chat && chat.gcMode && !isAdmin) return // Except this
                    //    if (chat?.gcMode && !isAdmin) return 

                    if (m.text && user && user.lastCommandTime && (Date.now() - user.lastCommandTime) < 5000 && !isROwner) {
                        if (user.commandCount === 5) {
                            const remainingTime = Math.ceil((user.lastCommandTime + 5000 - Date.now()) / 1000)
                            if (remainingTime > 0) {
                                const messageText = `*[ ⚠ ] Wait ${remainingTime} seconds before using another command*`
                                m.reply(messageText)
                                return
                            } else {
                                user.commandCount = 0
                            }
                        } else {
                            user.commandCount += 1
                        }
                    } else {
                        user.lastCommandTime = Date.now()
                        user.commandCount = 1
                    }
                user.commandActionsTotal += 1
                }
                let hl = _prefix

                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Premium
                    fail('premium', m, this)
                    continue
                }
                /*if (plugin.tags.includes('premium') && global.db.data.users[m.sender].creditscore > 999 * 1) {
                    fail('nsfw', m, this)
                    continue
                }*/
                if (plugin.nsfw && !global.db.data.chats[m.chat].nsfw == true) { // Nsfw
                    fail('nsfw', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { // Butuh daftar?
                    fail('unreg', m, this)
                    continue
                }
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
                if (xp > 200)
                    m.reply('Ngecit -_-') // Hehehe
                else
                    m.exp += xp
                if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
                    this.reply(m.chat, `Limit kamu habis. Silahkan beli melalui *.buy limit*`, m)
                    continue // Limit habis
                }
                if (plugin.level > _user.level) {
                    this.reply(m.chat, `diperlukan level ${plugin.level} untuk menggunakan perintah ini. Level kamu ${_user.level}`, m)
                    continue // If the level has not been reached
                }
                if (plugin.credits > global.db.data.users[m.sender].creditscore) {
                    this.reply(m.chat, `🧩 Creditscore kamu dibawah ${plugin.credits} untuk menggunakan Command ini!!`, m, {
                        contextInfo: {
                            externalAdReply: {
                                title: global.wm,
                                body: '404 Access denied ✘',
                                sourceUrl: global.sgh,
                                thumbnail: global.iconBot
                            }
                        }
                    })
                    continue // If the creditscore has not been reached
                }
                m.isCommand = true
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    //await this.readMessages([m.key])
                    if (!isPrems)
                        m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    conn.sendPresenceUpdate('paused', m.chat)
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        //required DiscordBot
                        if (global.isDiscordBot && e.name) {
                            let str = `
**🗂️ Plugin:** ${m.plugin}
**👤 Sender:** ${m.sender}
**💬 Chat:** ${m.chat}
**💻 Command:** ${usedPrefix}${command} ${args.join(' ')}
`.trim()
                            let avt = await conn.profilePictureUrl(conn.user.jid, 'image').catch(_ => client.user.displayAvatarURL())
                            let whs = await client.channels.cache.get("1287254480005627926").fetchWebhooks()
                            let web = whs.find(wh => wh.token)
                            
                            web.send({
                                username: "エズ・Kanako 『 Starlight 』",
                                avatarURL: avt,
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor("#FFF14B")
                                    .setDescription(`${str}\n\n📄 Error Logs: ${text.substring(0, 4000)}`)
                                    .setTimestamp()
                                    .setAuthor({
                                        name: _user.name,
                                        iconURL: "https://telegra.ph/file/e4fbe5aef3c06d3d9e6b2.jpg"
                                    })
                                    .setFooter({
                                        text: "Created by Kanako Bot",
                                        iconURL: avt
                                    })
                                ],
                            })
                        }
                        m.reply(text)
                        //await this.readMessages([m.key])
                    }
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === 'function') {
                        try {
                            //await this.readMessages([m.key])
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                            conn.sendPresenceUpdate('paused', m.chat)
                            await this.readMessages([m.key])
                        }
                    }
                    if (m.limit)
                        m.exp = 10
                }
                break
            }
        }
        let adminMode = global.db.data.chats[m.chat].gcMode
        if (usedPrefix && typeof m.isHasCommand === "undefined") {
            if (usedPrefix == "/") return
            if (adminMode) return
            await conn.sendPresenceUpdate('composing', m.chat)
            let resultcmd = global.findCommand(m.text.slice(1))
            if (resultcmd.length) {
                dfail("Command not found!, You mean:\n\n> "+resultcmd.join(" \n> ").replace(/[\^|]/g, ', '), m, conn)
            } else dfail("Command not found!!", m, conn)
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        //console.log(global.db.data.users[m.sender])
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.expshards += m.exp
                user.limit -= m.limit * 1
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        if (global.setting.autoread) await this.readMessages([m.key])

        if (!m.fromMem && m.text.match(/(loli)/gi)) {
            this.sendMessage(m.chat, {
                react: {
                    text: '🍭',
                    key: m.key
                }
            })
        }

        if (!m.fromMem && m.text.match(/(@6288276549486|kanako)/gi)) {
            let emot = pickRandom(["😂", "😨", "🗿", "😁", "💀", "😮", "😋", "😅", "🔥"])
            this.sendMessage(m.chat, {
                react: {
                    text: emot,
                    key: m.key
                }
            })
        }

        function pickRandom(list) {
            return list[Math.floor(Math.random() * list.length)]
        }
    }
}

/*
 * Handle groups participants update
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
/*export async function participantsUpdate({ id, participants, action }) {
    if (opts['self']) return
    if (this.isInit) return
    if (global.db.data == null) await loadDatabase()
    let chat = global.db.data.chats[id] || {}
    let botTt = global.db.data.settings[conn.user.jid] || {}
    let text = ''
    switch (action) {
        case 'add':
        case 'remove':
            if (chat.welcome) {
                let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata
                for (let user of participants) {
                    let pp = './src/avatar_contact.png'
                    try {
                        pp = await this.profilePictureUrl(user, 'image')
                    } catch (e) {
                    } finally {
                    let apii = await this.getFile(pp)            
                    const botTt2 = groupMetadata.participants.find(u => this.decodeJid(u.id) == this.user.jid) || {} 
                    const isBotAdminNn = botTt2?.admin === "admin" || false
                        text = (action === 'add' ? (chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!').replace('@subject', await this.getName(id)).replace('@desc', groupMetadata.desc?.toString() || '*Deskripsi*') :
                              (chat.sBye || this.bye || conn.bye || 'Bye, @user!')).replace('@user', '@' + user.split('@')[0])

if (botTt.restrict && isBotAdminNn && action === 'add') {
 let responseb = await this.groupParticipantsUpdate(id, [user], 'remove')
     if (responseb[0].status === "404") return 
let fkontak2 = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${user.split('@')[0]}:${user.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
return    
}
let notice = await action === 'add' ? '𝙶𝚛𝚘𝚞𝚙 𝙽𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 W' : '𝙶𝚛𝚘𝚞𝚙 𝙽𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 B'
let bg = await action === 'add' ? fs.readFileSync('./src/welcome.jpg') : fs.readFileSync('./src/bye.jpg')
this.adReply(id, text, await this.getName(id), notice, await bg, '')
                   }
                }
            }
            break
        case 'promote':
        case 'daradmin':
        case 'darpoder':
            text = (chat.sPromote || this.spromote || conn.spromote || '@user ```is now Admin```')
        case 'demote':
        case 'quitarpoder':
        case 'quitaradmin':
            if (!text)
                text = (chat.sDemote || this.sdemote || conn.sdemote || '@user ```is no longer Admin```')
            text = text.replace('@user', '@' + participants[0].split('@')[0])
            if (chat.detect)
                this.sendMessage(id, { text, mentions: this.parseMention(text) })
            break
    }
}*/
function _0x4ced(_0x19ad75, _0x808e8d) {
    const _0xf00ab5 = _0xf00a();
    return _0x4ced = function(_0x4cede1, _0x4e7cec) {
        _0x4cede1 = _0x4cede1 - 0x6c;
        let _0x327a2f = _0xf00ab5[_0x4cede1];
        return _0x327a2f;
    }, _0x4ced(_0x19ad75, _0x808e8d);
}

function _0xf00a() {
    const _0x4f2ab5 = ['bye', '8265618KJDqQg', 'add', '@subject', 'readFileSync', 'getName', '𝙶𝚛𝚘𝚞𝚙\x20𝙽𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗', '@desc', '@user\x20```is\x20now\x20Admin```', 'sDemote', 'split', 'sPromote', 'sBye', 'desc', 'https://telegra.ph/file/c50a76d251cdd6883cf5d.jpg', 'remove', 'sWelcome', 'Bye,\x20@user!', '1933036iskEvB', './src/avatar_contact.png', '3sfankE', '18008020Lvjvek', 'profilePictureUrl', '5BPQpbv', 'sdemote', 'fromCharCode', 'repeat', 'demote', 'sendMessage', '102877oUqiGS', '88DBQwNL', '6529698ayrxSS', 'promote', 'https://telegra.ph/file/cea030b8a2a357b9775f9.jpg', '@user', 'spromote', 'replace', 'data', 'groupMetadata', 'metadata', '295786mHQyoZ', '623588DPbiCQ', 'welcome', 'image', 'chats', '@user\x20```is\x20no\x20longer\x20Admin```'];
    _0xf00a = function() {
        return _0x4f2ab5;
    };
    return _0xf00a();
}(function(_0x2328bc, _0xa36189) {
    const _0x5bd0b1 = _0x4ced,
        _0x48fae8 = _0x2328bc();
    while (!![]) {
        try {
            const _0x566951 = parseInt(_0x5bd0b1(0x80)) / 0x1 + -parseInt(_0x5bd0b1(0x8b)) / 0x2 * (parseInt(_0x5bd0b1(0x77)) / 0x3) + parseInt(_0x5bd0b1(0x75)) / 0x4 * (-parseInt(_0x5bd0b1(0x7a)) / 0x5) + parseInt(_0x5bd0b1(0x92)) / 0x6 + -parseInt(_0x5bd0b1(0x8c)) / 0x7 * (-parseInt(_0x5bd0b1(0x81)) / 0x8) + parseInt(_0x5bd0b1(0x82)) / 0x9 + -parseInt(_0x5bd0b1(0x78)) / 0xa;
            if (_0x566951 === _0xa36189) break;
            else _0x48fae8['push'](_0x48fae8['shift']());
        } catch (_0x574646) {
            _0x48fae8['push'](_0x48fae8['shift']());
        }
    }
}(_0xf00a, 0xb8134));
export async function participantsUpdate({
    id: _0x4e9dc1,
    participants: _0x576501,
    action: _0x2c8055
}) {
    const _0x5150b3 = _0x4ced;
    if (opts['self']) return;
    if (this['isInit']) return;
    let _0x15ba20 = global['db'][_0x5150b3(0x88)][_0x5150b3(0x8f)][_0x4e9dc1] || {},
        _0x206164 = '';
    switch (_0x2c8055) {
        case _0x5150b3(0x93):
        case _0x5150b3(0x72):
            if (_0x15ba20[_0x5150b3(0x8d)]) {
                let _0x29d480 = await this[_0x5150b3(0x89)](_0x4e9dc1) || (conn[_0x5150b3(0x8f)][_0x4e9dc1] || {})[_0x5150b3(0x8a)];
                for (let _0x5eb666 of _0x576501) {
                    let _0x45fce0 = fs[_0x5150b3(0x95)](_0x5150b3(0x76));
                    try {
                        _0x45fce0 = await this[_0x5150b3(0x79)](_0x5eb666, _0x5150b3(0x8e));
                    } catch (_0x53de13) {} finally {
                        _0x206164 = (_0x2c8055 === 'add' ? (_0x15ba20[_0x5150b3(0x73)] || this[_0x5150b3(0x8d)] || conn[_0x5150b3(0x8d)] || 'Welcome,\x20@user!')['replace'](_0x5150b3(0x94), await this[_0x5150b3(0x96)](_0x4e9dc1))[_0x5150b3(0x87)](_0x5150b3(0x98), _0x29d480[_0x5150b3(0x70)] ? String[_0x5150b3(0x7c)](0x200e)[_0x5150b3(0x7d)](0xfa1) + _0x29d480[_0x5150b3(0x70)] : '') : _0x15ba20[_0x5150b3(0x6f)] || this[_0x5150b3(0x91)] || conn[_0x5150b3(0x91)] || _0x5150b3(0x74))['replace']('@user', '@' + _0x5eb666[_0x5150b3(0x6d)]('@')[0x0]);
                        let _0x4cb6db = _0x5150b3(0x71),
                            _0x4421d6 = _0x5150b3(0x84);
                        await this[_0x5150b3(0x7f)](_0x4e9dc1, {
                            'text': _0x206164,
                            'contextInfo': {
                                'mentionedJid': [_0x5eb666],
                                'externalAdReply': {
                                    'title': await this['getName'](_0x4e9dc1),
                                    'body': _0x5150b3(0x97),
                                    'thumbnailUrl': _0x2c8055 === _0x5150b3(0x93) ? _0x4cb6db : _0x4421d6,
                                    'sourceUrl': '',
                                    'mediaType': 0x1,
                                    'renderLargerThumbnail': !![]
                                }
                            }
                        }, {
                            'quoted': null
                        });
                    }
                }
            }
            break;
        case _0x5150b3(0x83):
            _0x206164 = _0x15ba20[_0x5150b3(0x6e)] || this[_0x5150b3(0x86)] || conn[_0x5150b3(0x86)] || _0x5150b3(0x99);
        case _0x5150b3(0x7e):
            if (!_0x206164) _0x206164 = _0x15ba20[_0x5150b3(0x6c)] || this[_0x5150b3(0x7b)] || conn[_0x5150b3(0x7b)] || _0x5150b3(0x90);
            _0x206164 = _0x206164[_0x5150b3(0x87)](_0x5150b3(0x85), '@' + _0x576501[0x0][_0x5150b3(0x6d)]('@')[0x0]);
            if (_0x15ba20['detect']) this[_0x5150b3(0x7f)](_0x4e9dc1, {
                'text': _0x206164,
                'mentions': this['parseMention'](_0x206164)
            });
            break;
    }
}

/**
 * Handle groups update
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate) {
    if (opts['self'])
        return
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id],
            text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (!text) continue
        await this.sendMessage(id, {
            text,
            mentions: this.parseMention(text)
        })
    }
}

export async function deleteUpdate(message) {
    try {
        const {
            fromMe,
            id,
            participant
        } = message
        if (fromMe)
            return
        let msg = this.serializeM(this.loadMessage(id))
        if (!msg)
            return
        let chat = global.db.data.chats[msg.chat] || {}
        if (chat.delete)
            return
        /*await this.reply(msg.chat, `Terdeteksi *@${participant.split`@`[0]}* telah menghapus pesan.
Untuk mematikan fitur ini, ketik
*.off antidelete*

Untuk menghapus pesan yang dikirim BOT, reply pesan dengan perintah
*.on delete*`.trim(), msg, {
            mentions: [participant]
        })
        this.copyNForward(msg.chat, msg).catch(e => console.log(e, msg))*/
    } catch (e) {
        console.error(e)
    }
}

global.dfail = (type, m, conn) => {
    let msg = {
        mtnc: "Command sedang Maintenance",
        rowner: 'Perintah ini hanya dapat digunakan oleh _*Pemilik Bot*_',
        owner: 'Perintah ini hanya dapat digunakan oleh _*Pemilik Bot*_',
        mods: 'Perintah ini hanya dapat digunakan oleh _*Moderator Bot*_',
        premium: 'Perintah ini hanya untuk pengguna _*Premium*_',
        nsfw: 'Akses di tolak',
        group: 'Perintah ini hanya dapat digunakan di grup',
        private: 'Perintah ini hanya dapat digunakan di Chat Pribadi',
        admin: 'Perintah ini hanya untuk *Admin* grup',
        botAdmin: 'Jadikan bot sebagai *Admin* untuk menggunakan perintah ini',
        unreg: 'Silahkan daftar untuk menggunakan fitur ini dengan cara mengetik:\n\n*.reg nama.umur*\n\nContoh: *.reg raja jawa.17*'
    } [type]
    if (!msg) msg = type
    if (msg) return conn.reply(m.chat, msg, m, {
        contextInfo: {
            externalAdReply: {
                title: global.wm,
                body: '404 Access denied ✘',
                sourceUrl: global.sgh,
                thumbnail: global.iconBot
            }
        }
    })
}

/*let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})*/