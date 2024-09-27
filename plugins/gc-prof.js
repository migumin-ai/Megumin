import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'

var handler = async (m, { conn, text }) => {
    // تحقق من وجود اسم المجموعة
    if (!text) throw '*『✦』يرجى إدخال اسم المجموعة لاسترجاع البروفايل، مثلاً: .بروفايلي teba*';

    let groupName = text.trim();
    let filePath = `./${groupName}.json`;

    // تحقق من وجود ملف المجموعة
    if (!fs.existsSync(filePath)) throw `*『✦』الملف الخاص بالمجموعة "${groupName}" غير موجود.*`;

    // قراءة البيانات من الملف
    let users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let user = users.find(u => u.id === m.sender);

    // تحقق مما إذا كان المستخدم مسجلاً في هذه المجموعة
    if (!user) throw `*『✦』أنت غير مسجل في المجموعة "${groupName}".*`;

    // استعادة معلومات المستخدم
    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => imagen1);
    let { name, age, regTime, groupName: userGroup, role } = user;
    let estrellas = 15; // قيم افتراضية
    let level = 5; // قيم افتراضية
    let exp = 245; // قيم افتراضية
    let premium = false; // قيم افتراضية

    // تحويل الـ JID إلى رقم الهاتف
    let phoneNumber = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international');

    // رسالة البروفايل العادي
    let noprem = `
🚩 *ملف المستخدم*
☁️ *الاسم:* ${name}
📞 *الرقم:* ${phoneNumber}
🌀 *مسجل في:* ${userGroup}

👑 *الموارد*
🌟 *النجوم:* ${estrellas}
💥 *المستوى:* ${level}
💫 *التجربة:* ${exp}
✨️ *الدور:* ${role}

💖 *Premium:* ${premium ? '✅' : '❌'}
    `.trim();

    // رسالة البروفايل المميز
    let prem = `
╭──⪩ 𝐔𝐒𝐔𝐀𝐑𝐈𝐎 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ⪨
│⧼👤⧽ *الاسم:* 「${name}」
📞 *الرقم:* ${phoneNumber}
🌀 *مسجل في:* ${userGroup}
│⧼🔱⧽ *الدور:* Vip 👑
╰───⪨

╭────⪩ 𝐑𝐄𝐂𝐔𝐑𝐒𝐎𝐒 ⪨
│⧼🌟⧽ *النجوم:* ${estrellas}
│⧼🔰⧽ *المستوى:* ${level}
│⧼💫⧽ *التجربة:* ${exp}
│⧼⚜️⧽ *الدور:* ${role}
╰───⪨ *مستخدم مميز* ⪩
    `.trim();

    // إرسال البروفايل
    conn.sendFile(m.chat, pp, 'perfil.jpg', `${premium ? prem.trim() : noprem.trim()}`, m, { mentions: [m.sender] });
}

handler.help = ['بروفايلي'];
handler.register = true;
handler.group = true;
handler.tags = ['profile'];
handler.command = ['بروفايلي'];

export default handler;