import fs from 'fs';
import path from 'path';

var handler = async (m, { conn }) => {
    // تحديد المسار الذي يحتوي على الصور
    let imagesFolder = './'; // تأكد أن الصور موجودة في هذا المسار أو غيّر المسار إذا لزم الأمر

    // قراءة جميع الملفات في المجلد
    let files = fs.readdirSync(imagesFolder);

    // تصفية الملفات للحصول على الصور فقط (صيغة jpg, png, jpeg)
    let images = files.filter(file => /\.(jpe?g|png)$/i.test(file));

    // تحقق إذا كان هناك صور في المجلد
    if (images.length === 0) {
        return m.reply('لم يتم العثور على أي صور في المجلد.');
    }

    // اختيار صورة عشوائية من الصور
    let randomImage = images[Math.floor(Math.random() * images.length)];

    // المسار الكامل للصورة المختارة
    let randomImagePath = path.join(imagesFolder, randomImage);

    // الرسالة التي سيتم إرسالها عند تلقي الأمر
    let message = `
👤 🅼🅴🅶🆄🅼🅸🅽 👤
* *مـرحـبـا بــك*
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「💭」اسمـي: ميغومين-megumin
「✨️」ابـلـغ مـن العمـر: 10 سنـوات
「🏷️」مؤسسي: علي - (لايت)
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「📬」ـ𝙸𝚗𝚏𝚘:
• اوامر اذا اردت قائمه الاوامر🌟
• لا تتصل بي لكي لا يتم حظرك 📵
• لا تـلـهـو بـالـديـن معي او سـاحظـرك 🚫
• لا تسب ولا تسبب الفوضى في الجروب
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
🔥⭑𝗠𝗲𝗴𝘂𝗺𝗶𝗻-𝗕𝗼𝘁⭑(^_^♪)
    `.trim();

    // إرسال الصورة العشوائية مع الرسالة
    await conn.sendFile(m.chat, randomImagePath, randomImage, message, m, { mentions: [m.sender] });
}

handler.help = ['بوت', 'ميغومين'];
handler.register = false;
handler.group = true;
handler.tags = ['info'];
handler.command = ['بوت', 'ميغومين']; // الأوامر التي سيتم الرد عليها

export default handler;