import { canLevelUp, xpRange } from '../lib/levelling.js'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    let img = await (await fetch(`https://telegra.ph/file/b97148e2154508f63d909.jpg`)).buffer()
    let name = conn.getName(m.sender)
    let user = global.db.data.users[m.sender]
    
    if (!canLevelUp(user.level, user.exp, global.multiplier)) {
        let { min, xp, max } = xpRange(user.level, global.multiplier)
        let txt = `🍟 *الاسم:* ${name}\n\n`
        txt += `🚩 *المستوى:* ${user.level}\n`
        txt += `🍭 *الخبرة (XP):* ${user.exp - min} / ${xp}\n\n`
        txt += `🐢 ليس لديك خبرة كافية *${max - user.exp}* لمستوى جديد! ✨`
        await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, null, rcanal)
    }

    let before = user.level * 1
    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++

    if (before !== user.level) {
        let txt = `🎊 مـبـروك 🎊\n\n`
        txt += `*${before}* ➔ *${user.level}* [ ${user.role} ]\n\n`
        txt += `• 🧬 المستوى السابق : ${before}\n`
        txt += `• 🧬 المستوى الجديد : ${user.level}\n`
        txt += `• 📅 التاريخ : ${new Date().toLocaleString('ar-EG')}\n\n`
        txt += `🚩 *ملاحظة:* _كلما تفاعلت أكثر مع *Megumin-Bot*، زاد مستواك_`
        await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, null, rcanal)
    }
}

handler.help = ['levelup']
handler.tags = ['rpg']
handler.command = ['لفل', 'لفل-جديد', 'levelup', 'level'] 
handler.group = true
handler.register = true

export default handler