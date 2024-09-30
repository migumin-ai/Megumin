import fetch from 'node-fetch';

var handler = async (m, { conn }) => {
    try {
        console.log("Received a message:", m); // سجل الرسالة المستلمة
        console.log("Processing command at:", new Date().toISOString());

        // رابط GitHub الذي يحتوي على قائمة الفيديوهات بتنسيق JSON
        const videoListUrl = 'https://gist.githubusercontent.com/migumin-ai/7e6f0db698b7a2e200a26e8b80da7b8a/raw/a9bffb24ca42a886512d34fa1c262f096622bb4c/alimaoie-megi%25F0%259F%258C%259F';

        // جلب قائمة الفيديوهات من الرابط
        let response = await fetch(videoListUrl);
        
        // تحقق من استجابة الرابط
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let videoLinks = await response.json(); // تحويل الاستجابة إلى JSON
        let videos = videoLinks.filter(video => video.vid); // تصفية الفيديوهات للحصول على الروابط فقط

        console.log("Video links fetched:", videos); // سجل الفيديوهات المستلمة

        // تحقق إذا كانت هناك فيديوهات في القائمة
        if (videos.length === 0) {
            return m.reply('لم يتم العثور على أي فيديوهات في القائمة.');
        }

        // اختيار فيديو عشوائي من القائمة
        let randomVideo = videos[Math.floor(Math.random() * videos.length)].vid;

        // استخراج رقم المستخدم أو المعرف لعمل منشن
        let username = `@${m.sender.split('@')[0]}`; // استخراج اسم المستخدم بدون الرقم الدولي

        // استخراج الوقت الحالي
        let time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

        // إضافة رمز الساعة إلى رسالة المستخدم
        await conn.sendMessage(m.chat, { react: { text: '🕞', key: m.key } }); // إضافة الرمز التعبيري كتعليق على الرسالة الأصلية

        // إرسال رسالة الانتظار
        let waitingMessage = await m.reply(`جاري تجهيز الفيديو...`); // رسالة الانتظار

        // الرسالة التي سيتم إرسالها مع الفيديو
        let message = `
👤 🅼🅴🅶🆄🅼🅸🅽 👤
* *مـرحـبـا بــك*
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「🔮」الامـر : ايـ ـديـ ـت عـ ـشـ ـوائـ ـي
「👤」صـاحـب الـطـلـب: ${username}
「🕒」وقـت الـطـلـب: ${time}
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「📬」ـ𝙸𝚗𝚏𝚘:
🔥⭑𝗠𝗲𝗴𝘂𝗺𝗶𝗻-ai⭑(^_^♪)
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
        `.trim();

        console.log("Sending video:", randomVideo); // سجل الفيديو الذي سيتم إرساله

        // إرسال الفيديو العشوائي مع عمل المنشن للشخص الذي أرسل الطلب
        await conn.sendMessage(m.chat, { video: { url: randomVideo }, caption: message, mentions: [m.sender] });

        // حذف رسالة الانتظار بعد إرسال الفيديو
        await conn.sendMessage(m.chat, { delete: waitingMessage.key }); // حذف الرسالة بدون ترك "تم حذف الرسالة"

        // إضافة رمز تعبيري كتعليق بعد إرسال الفيديو
        const emoji = ['❤️‍🔥', '👌🏼', '🫡', '❤️‍🔥'][Math.floor(Math.random() * 4)];
        await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } });

    } catch (error) {
        console.error("Error occurred:", error); // طباعة الخطأ في الكونسول
        m.reply(`حدث خطأ أثناء معالجة طلبك: ${error.message}`); // إظهار رسالة الخطأ
    }
}

handler.help = ['تصميم']; // الأمر المتبقي
handler.register = false;
handler.group = true;
handler.tags = ['info'];
handler.command = ['تصميم']; // الأمر الذي سيتم الرد عليه

export default handler;