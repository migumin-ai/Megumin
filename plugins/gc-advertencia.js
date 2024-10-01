const handler = async (m, { conn, text, command, usedPrefix }) => {
    const pp = 'https://i.imgur.com/vWnsjh8.jpg';
    let who;

    // تحقق من الشخص المستهدف سواء كان مذكورًا أو تم الرد على رسالته
    if (m.isGroup) { 
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text; 
    } else {
        who = m.chat;
    }

    // إذا لم يكن هناك شخص محدد، اعرض رسالة تنبيه
    if (!who) {
        const warntext = `❌ يرجى الإشارة إلى شخص أو الرد على رسالة لتحذير المستخدم\n\nمثال:\n${usedPrefix + command} @tag`;
        return m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) });
    }

    const user = global.db.data.users[who];
    if (!user) {
        return m.reply("❌ المستخدم غير مسجل في قاعدة البيانات.", m.chat);
    }

    const dReason = 'لا يوجد سبب'; // السبب الافتراضي
    const msgtext = text || dReason; // استخدم النص أو السبب الافتراضي
    const sdms = msgtext.replace(/@\d+-?\d* /g, ''); // إزالة أي منشن من السبب

    // زيادة عدد التحذيرات
    user.warn += 1;

    // إرسال رسالة تحذير
    await m.reply(
        `*@${who.split`@`[0]}* لقد تلقيت إنذارًا!\nالسبب: ${sdms}\nالتحذيرات: ${user.warn}/4`, 
        null, 
        { mentions: [who] }
    );

    // إذا تجاوز المستخدم 4 تحذيرات، سيتم طرده
    if (user.warn >= 4) {
        user.warn = 0; // إعادة ضبط التحذيرات
        await m.reply(
            `*@${who.split`@`[0]}* لقد تجاوزت 4 تحذيرات، سيتم طردك الآن.`, 
            null, 
            { mentions: [who] }
        );
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove'); // طرد المستخدم
    }

    return !1;
};

handler.command = ['تحذير', 'warn', 'warning'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;