import didyoumean from 'didyoumean'
import similarity from 'similarity'

export async function before(m, { conn, match, usedPrefix, command }) {
	
if ((usedPrefix = (match[0] || '')[0])) {
let noPrefix = m.text.replace(usedPrefix, '')
let args = noPrefix.trim().split` `.slice(1)
let text = args.join` `
let help = Object.values(plugins).filter(v => v.help && !v.disabled).map(v => v.help).flat(1)
if (help.includes(noPrefix)) return
let mean = didyoumean(noPrefix, help)
let sim = similarity(noPrefix, mean)
let som = sim * 100
await conn.sendPresenceUpdate('composing', m.chat)
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let name = await conn.getName(who)
let caption = `*🍧  مرحبا* @${who.split('@')[0]}
الامر الذي كتبته غير موجود، لكن تم العثور على أوامر مشابهة 
✔️ *${usedPrefix + mean}*
 ❗ *نسبه التشابه:* _${parseInt(som)}%_`
if (mean) conn.reply(m.chat, caption, m, { mentions: [who]})
}
}