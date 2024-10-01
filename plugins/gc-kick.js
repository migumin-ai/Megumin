var handler = async (m, { conn, participants, usedPrefix, command }) => {
    if (!m.mentionedJid[0] && !m.quoted) {
        return conn.reply(m.chat, '🚩 *يرجى الإشارة إلى الشخص أو الرد على رسالته لتتمكن من طرده*', m);
    }

    // التحقق من الشخص المستهدف
    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

    // الحصول على معلومات المجموعة
    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    // التحقق من أن المستخدم ليس البوت نفسه
    if (user === conn.user.jid) {
        return conn.reply(m.chat, '🚩 لا يمكنني طرد البوت من المجموعة', m);
    }

    // التحقق من أن المستخدم ليس مالك المجموعة
    if (user === ownerGroup) {
        return conn.reply(m.chat, '🚩 لا يمكنني طرد مالك المجموعة', m);
    }

    // التحقق من أن المستخدم ليس مالك البوت
    if (user === ownerBot) {
        return conn.reply(m.chat, '🚩 لا يمكنني طرد مالك البوت', m);
    }

    // طرد المستخدم
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
};

handler.help = ['kick']; // تعليمات المساعدة
handler.tags = ['grupo']; // تصنيفات الأوامر
handler.command = ['kick','echar','طرد','sacar','ban']; // الأوامر المتاحة للطرد
handler.admin = true; // يجب أن يكون المسؤول قادرًا على استخدام الأمر
handler.group = true; // يجب أن يتم استخدام الأمر داخل مجموعة
handler.register = true; // يجب أن يكون المستخدم مسجلاً
handler.botAdmin = true; // يجب أن يكون البوت مسؤولاً في المجموعة

export default handler;