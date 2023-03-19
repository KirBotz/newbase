const { baileys, proto, generateWAMessageFromContent, getContentType } = require("@adiwajshing/baileys")
const { getGroupAdmins, fetchJson } = require("./functions.js")
const { exec } = require("child_process")
const cheerio = require("cheerio")
const chalk = require("chalk")
const util = require("util")
const axios = require("axios")
const fs = require("fs")

module.exports = async (client, mek, msg) => {
try {
const type = getContentType(msg.message)
const content = JSON.stringify(msg.message)
const from = msg.key.remoteJid
const quoted = type == 'extendedTextMessage' && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
const body = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : ''
const prefix = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/.test(body) ? body.match(/^[°zZ#$@*+,.?=''():√%¢£¥€π¤ΠΦ_&><!`™©®Δ^βα~¦|/\\©^]/gi) : '.'
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const botNumber = client.user.id.split(':')[0]
const sender = msg.key.fromMe ? (client.user.id.split(':')[0]+'@s.whatsapp.net' || client.user.id) : (msg.key.participant || msg.key.remoteJid)
const isGroup = from.endsWith('@g.us')
const groupMetadata = isGroup ? await client.groupMetadata(from).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false
const senderNumber = sender.split('@')[0]
const pushname = msg.pushName || `${senderNumber}`
const nomorOwner = [`6287705048235`]
const isBot = botNumber.includes(senderNumber)
const isOwner = nomorOwner.includes(senderNumber) || isBot

if (isCmd && msg.isGroup) { 
console.log(chalk.bold.rgb(255, 178, 102)('\x1b[1;31m~\x1b[1;37m> [\x1b[1;32mCMD\x1b[1;37m]'), chalk.bold.rgb(153, 255, 153)(command), chalk.bold.rgb(204, 204, 0)("from"), chalk.bold.rgb(153, 255, 204)(pushname), chalk.bold.rgb(204, 204, 0)("in"), chalk.bold.rgb(255, 178, 102)("Group Chat"), chalk.bold('[' + args.length + ']')); 
}
if (isCmd && !msg.isGroup) { 
console.log(chalk.bold.rgb(255, 178, 102)('\x1b[1;31m~\x1b[1;37m> [\x1b[1;32mCMD\x1b[1;37m]'), chalk.bold.rgb(153, 255, 153)(command), chalk.bold.rgb(204, 204, 0)("from"), chalk.bold.rgb(153, 255, 204)(pushname), chalk.bold.rgb(204, 204, 0)("in"), chalk.bold.rgb(255, 178, 102)("Private Chat"), chalk.bold('[' + args.length + ']')); 
}

const reply = (teks) => {
client.sendMessage(from, { text : teks }, { quoted : msg })
}

if (/whatsapp.com/g.test(body)) {
if (!isGroup) return
if (isAdmins) return reply(`Admin Mah Bebas Bro`)
if (isOwner) return reply(`Owner Mah Bebas Bro`)
reply(`*「 GROUP LINK DETECTOR 」*\n\nBot Mendeteksi Anda Telah Mengirim Link Group\nMaaf Anda Akan Di Kick & Pesan Anda Akan Di Hapus Oleh Bot`)
const sianj = sender
await client.groupParticipantsUpdate(from, [sianj], 'remove')
client.sendMessage(from, { delete: msg.key })
}

switch (command) {
case "tes":{
reply("Iya Kak?")
}
break
case "cleardbuser":{
if (!isOwner) return reply(`Khusus Owner Kak`)
const userbot = JSON.parse(fs.readFileSync('./user.json'))
const clearAllList = (_dir) => {
    Object.keys(_dir).forEach((i) => {
        _dir.splice(_dir[i], 1)
        fs.writeFileSync('./user.json', JSON.stringify(_dir))
    })
    reply("sukses")
}
return clearAllList(userbot)
}
break
default:
}
if (/A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|0|1|2|3|4|5|6|7|8|9/g.test(body)) {
const user = JSON.parse(fs.readFileSync('./user.json'))
const isUser = user.includes(sender)
if (!isGroup) return
if (isUser) return
user.push(sender)
fs.writeFileSync('./user.json', JSON.stringify(user))
let teksucapan = `ASSALAMUALAIKUM

wa.me/6287705048235
*_SAVE NOMOR DI ATAS MAS_*

*===DENGAN NAMA _KIRBOTZ STORE_===*

*SVBCK? SEBUT NAMA*`
client.sendMessage(sender, { text: teksucapan })
}
} catch (err) {
console.log(util.format(err))
let e = String(err)
client.sendMessage("6287705048235@s.whatsapp.net", {text:e})
}
}

let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})