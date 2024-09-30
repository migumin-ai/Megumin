let timeout = 60000,  // مقدار الوقت بالميلي ثانية (60000 مللي ثانية = 60 ثانية)
    poin = 4999,     // عدد النقاط
    handler = async (message, { conn, command, usedPrefix }) => {

    // إعداد التخزين إذا لم يكن موجودًا مسبقًا
    conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {};

    // أخذ محتوى الرسالة
    let chatId = message.chat;

    // التحقق إذا كانت الرسالة موجودة في قائمة التخزين
    if (chatId in conn.tebakbendera) {
        conn.reply(message.chat, 'في سؤال عشان تبقا عارف', conn.tebakbendera[chatId][0]);
        throw false;
    }

    // جلب بيانات من رابط خارجي (على شكل JSON)
    let data = await (await fetch('https://gist.githubusercontent.com/alimaoie/495bfce850b94e843fbdd20ddbc2dba7/raw/208271989a6777b4d93ef1bef679423b5da12cc5/light')).json(),
        randomItem = data[Math.floor(Math.random() * data.length)],  // اختيار عنصر عشوائي
        replyText = ('*' + command.toUpperCase() + '*\n  المدة *' + (timeout / 1000).toFixed(2) + '* ثانية\n  استخدم ' + usedPrefix + 'استسلم للاستسلام\n  الجائزة: ' + poin + ' XP\n{global.ᎬmᎥᏞᏞᎥᎪ}$').trim();

    // إعداد التخزين للسؤال الجديد
    conn.tebakbendera[chatId] = [await conn.sendFile(message.chat, randomItem.img, '', replyText, message), randomItem, poin, setTimeout(() => {
        if (conn.tebakbendera[chatId]) {
            conn.reply(message.chat, 'الوقت خلص!\nالإجابة هي *' + randomItem.name + '*', conn.tebakbendera[chatId][0]);
            delete conn.tebakbendera[chatId];
        }
    }, timeout)];
};

// معلومات عن الأمر
handler.help = ['guessflag'];
handler.tags = ['game'];
handler.command = ['احزر2'];

export default handler;