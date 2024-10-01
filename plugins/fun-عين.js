let timeout = 60000, // مدة المهلة 60 ثانية (60000 ملي ثانية)
    points = 5000,   // النقاط المكتسبة 5000 نقطة
    handler = async (m, { conn, command, usedPrefix }) => {
        conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}; // التأكد من وجود تخزين للعبة التخمين
        let chatId = m.chat;

        if (chatId in conn.tebakbendera) {
            // إذا كانت اللعبة جارية بالفعل
            conn.reply(m.chat, '❓ يوجد سؤال بالفعل، يجب الإجابة عليه أولاً!', conn.tebakbendera[chatId][0]);
            throw false;
        }

        // جلب البيانات من URL محدد
        let response = await fetch('https://raw.githubusercontent.com/Xov445447533/Xov11111/master/src/Aesthetic/venom.json');
        let data = await response.json();

        // اختيار عنصر عشوائي من البيانات
        let selectedItem = data[Math.floor(Math.random() * data.length)];

        // رسالة التحدي
        let challengeMessage = `*${command.toUpperCase()}*\n⌛ المدة: *${(timeout / 1000).toFixed(2)}* ثانية\nاستخدم ${usedPrefix}استسلم للاستسلام\nالجائزة: ${points} XP\n{global.megumin}`;

        // تخزين اللعبة الجارية في المحادثة
        conn.tebakbendera[chatId] = [
            await conn.sendFile(m.chat, selectedItem.img, '', challengeMessage, m), // إرسال صورة التحدي
            selectedItem, // العنصر المختار
            points, // النقاط
            setTimeout(() => {
                if (conn.tebakbendera[chatId]) {
                    conn.reply(m.chat, `⌛ انتهى الوقت!\nالإجابة الصحيحة هي *${selectedItem.name}*`, conn.tebakbendera[chatId][0]);
                    delete conn.tebakbendera[chatId]; // حذف اللعبة بعد انتهاء الوقت
                }
            }, timeout) // ضبط وقت انتهاء التحدي
        ];
    };

handler.help = ['guessflag']; // المساعدة
handler.tags = ['game']; // التصنيفات
handler.command = ['عين']; // الأوامر التي تشغل اللعبة

export default handler;;8\u0647\x20\u0647\u064a\x20\x2a'+_0xf98852['\x6e\x61\x6d\x65']+'\x2a',_0xd216c8['\x74\x65\x62\x61\x6b\x62\x65\x6e\x64\x65\x72\x61'][_0x1062f3][0x0]);delete _0xd216c8['\x74\x65\x62\x61\x6b\x62\x65\x6e\x64\x65\x72\x61'][_0x1062f3];},timeout)];};handler['\x68\x65\x6c\x70']=['\x67\x75\x65\x73\x73\x66\x6c\x61\x67'],handler['\x74\x61\x67\x73']=['\x67\x61\x6d\x65'],handler['\x63\x6f\x6d\x6d\x61\x6e\x64']=['\u0639\u064a\u0646'];export default handler;