import { createHash } from 'crypto';
import fs from 'fs';

let Reg = /\|?(.*)([.|] *?)([0-9]*) (.+)$/i;

let handler = async function (m, { conn, text, participants, isAdmin, isGroupAdmin }) {
    let target = m.quoted ? m.quoted.sender : m.sender;  // إذا كان هناك رد على شخص، يتم تسجيله
    let name2 = conn.getName(target);  // اسم الشخص المراد تسجيله (إما المرسل أو الشخص الذي تم الرد عليه)

    // التحقق من أن المستخدم الذي يرسل الأمر هو أدمن
    if (!isGroupAdmin && !isAdmin) throw `*『✦』فقط الأدمن يمكنه استخدام هذا الأمر.*`;

    // التحقق من صحة النص المدخل
    if (!Reg.test(text)) throw `*『✦』الرجاء استخدام الأمر بالشكل الصحيح:*\n\n#سجل *اسمك.عمرك اسم_المجموعة*\n\n\`\`\`مثال:\`\`\`\n#سجل *${name2}.18 teba*`;

    let [_, name, splitter, age, groupName] = text.match(Reg);

    // تحقق من المدخلات
    if (!name) throw '*『✦』الاسم مطلوب للتسجيل.*';
    if (!age) throw '*『✦』العمر مطلوب للتسجيل.*';
    if (!groupName) throw '*『✦』اسم المجموعة مطلوب.*';
    if (name.length >= 30) throw '*『✦』الاسم يجب ألا يتجاوز 30 حرفاً.*';

    age = parseInt(age);
    if (age > 999) throw '*『😏』هل أنت خالد؟*';
    if (age < 5) throw '*『🍼』هل تحتاج إلى حضانة؟*';

    // تحديد المسار بناءً على اسم المجموعة
    let filePath = `./${groupName}.json`;

    // إذا كان الملف لا يوجد، قم بإنشائه
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }

    // قراءة البيانات الحالية من الملف
    let users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // التحقق إذا كان الشخص مسجلاً بالفعل باستخدام الـ ID
    let userById = users.find(u => u.id === target);
    if (userById) {
        return conn.sendMessage(m.chat, { text: `*『✦』هذا الشخص مسجل بالفعل في هذه المجموعة.*` }, { quoted: m });
    }

    // التحقق من اسم المستخدم المحجوز
    let existingUser = users.find(u => u.name === name.trim());
    if (existingUser) {
        return conn.sendMessage(m.chat, { text: `*『✦』الاسم "${name.trim()}" محجوز بالفعل في هذه المجموعة.*` }, { quoted: m });
    }

    // إضافة المستخدم الجديد
    users.push({
        id: target,
        name: name.trim(),
        age: age,
        groupName: groupName,
        regTime: +new Date()
    });

    // حفظ التحديثات إلى الملف
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    // الرد بتأكيد التسجيل
    let sn = createHash('md5').update(target).digest('hex').slice(0, 6);

    let regbot = `👤 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗢 👤
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「💭」𝗡𝗼𝗺𝗯𝗿𝗲: ${name}
「✨️」𝗘𝗱𝗮𝗱: ${age} años
「🏷️」𝗚𝗿𝘂𝗽𝗼: ${groupName}  // إضافة اسم المجموعة
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「🎁」𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:
• 15 Estrellas 🌟
• 5 MiniCoins 🪙
• 245 Experiencia 💸
• 12 Tokens 💰
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
${packname}`;

    await conn.sendMessage(m.chat, { text: regbot }, { quoted: m });
};

handler.help = ['سجل'];
handler.tags = ['gc'];
handler.command = ['سجل'];
handler.admin = true;
handler.botadmin = true;
handler.group = true;

export default handler;