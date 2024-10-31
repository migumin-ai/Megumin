let timeout = 60000; // مدة المهلة 60 ثانية
let points = 4999;   // النقاط المكتسبة 2000 نقطة

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakbendera = conn.tebakbendera || {}; // التأكد من وجود تخزين للعبة التخمين
    let chatId = m.chat;

    // التحقق من حالة اللعبة
    if (chatId in conn.tebakbendera) {
        if (command === 'استسلم') {
            const selectedItem = conn.tebakbendera[chatId][1];
            conn.reply(m.chat, `لقد استسلمت! الإجابة هي *${selectedItem.name}*`, conn.tebakbendera[chatId][0]);
            delete conn.tebakbendera[chatId];
            return;
        } else {
            conn.reply(m.chat, 'في سؤال عشان تبقى عارف', conn.tebakbendera[chatId][0]);
            throw false;
        }
    }

    let response = await fetch(
        'https://raw.githubusercontent.com/Xov445447533/Xov11111/master/src/Aesthetic/venom.json'
    );
    let data = await response.json();
    let selectedItem = data[Math.floor(Math.random() * data.length)];

    let challengeMessage = `
•    ╮─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬🔥⃘⃪۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╭ـ
╮╼☁️ـ⬪࣪ꥈ𑁍⃪࣭۪ٜ݊݊݊݊݊໑ٜ࣪  _*مـن هذا ياتـــرا*_  ໑⃪࣭۪ٜ݊݊݊݊𑁍ꥈ࣪⬪☁️
┃֪࣪  ╯─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬🔥⃘⃪۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╰ـ
⌛ المدة: *${(timeout / 1000).toFixed(2)}* ثانية
استخدم ${usedPrefix}استسلم للاستسلام
الجائزة: ${points} XP`;

    conn.tebakbendera[chatId] = [
        await conn.sendFile(m.chat, selectedItem.img, '', challengeMessage, m),
        selectedItem,
        points,
        setTimeout(() => {
            if (conn.tebakbendera[chatId]) {
                conn.reply(m.chat, `الوقت خلص!\nالإجابة هي *${selectedItem.name}*`, conn.tebakbendera[chatId][0]);
                delete conn.tebakbendera[chatId];
            }
        }, timeout)
    ];

    const commandList = [
        ['🎯 استسلم', `${usedPrefix}استسلم`],
        ['🎲 لعبة أخرى', `${usedPrefix}احزر`],
        ['🕹️ قائمة الألعاب', `${usedPrefix}games`],
        ['📝 التسجيل في البوت', `${usedPrefix}reg`],
        ['👨‍💻 المطور', `${usedPrefix}owner`]
    ];

    await conn.sendButton(m.chat, '┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬🔥⃘⃪۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬🔥⃘⃪۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸', null, null, commandList);
};

handler.help = ['عين'];
handler.tags = ['game'];
handler.command = ['عين', 'استسلم'];

export default handler;