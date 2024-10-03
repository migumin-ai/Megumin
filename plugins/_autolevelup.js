import { canLevelUp, xpRange } from '../lib/levelling.js'
import { levelup } from '../lib/canvas.js'

export function before(m, { conn }) {

    let user = global.db.data.users[m.sender]
    let chat = global.db.data.chats[m.chat]
    if (!chat.autolevelup)
        return !0

    let before = user.level * 1
    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++

    if (before !== user.level) {
        conn.reply(m.chat, `🚩 *لقد ارتقيت إلى مستوى جديد*\n\n🍟 *المستوى الجديد:* ${user.level}\n✨️ *المستوى السابق:* ${before}\n🍭 *الرتبة:* ${user.role}\n🗓 *التاريخ:* ${new Date().toLocaleString('ar-EG')}`.trim(), m, rcanal)
    }
}