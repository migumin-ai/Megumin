import translate from '@vitalets/google-translate-api';
import fetch from 'node-fetch';

const handler = async (m, { args, usedPrefix, command }) => {
  const msg = `👑 *الاستخدام الصحيح للأمر ${usedPrefix + command} (نص)*\n*مثال:*\n*${usedPrefix + command} Hello*`; // الرسالة المعدلة

  let text = ''; // إنشاء متغير النص

  // تحقق مما إذا كانت هناك وسائط (args) أو نص مقتبس
  if (args.length > 0) {
    text = args.join(' '); // احصل على النص المدخل
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text; // إذا كان هناك نص مقتبس، استخدمه
  } else {
    return m.reply(msg); // إذا لم يكن هناك نص، أرسل رسالة الإرشادات
  }

  const defaultLang = 'ar'; // تعيين اللغة الافتراضية إلى العربية

  try {
    const result = await translate(text, { to: defaultLang, autoCorrect: true });

    // تحديد اللغة الأصلية
    const detectedLang = result.from.language.iso; // احصل على اللغة التي تم التعرف عليها
    const originalText = text; // النص الأصلي

    // إعداد معلومات الرسالة مع الصورة
    await conn.sendMessage(
      m.chat,
      { 
        image: { url: 'https://i.postimg.cc/SRwz1547/IMG-20241010-182407.jpg' }, // إضافة الصورة هنا
        caption: `════════════════════════╗\n➬ *${detectedLang.toUpperCase()}*: ${originalText}\n════════════════════════╣\n➬ *Arabic*: ${result.text}\n════════════════════════╝`, // التعليق على الصورة مع الرمز "➬"
        contextInfo: {
          mentionedJid: [m.sender],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363325281734612@newsletter',  // معرف القناة
            newsletterName: '⏤͟͞ू⃪ ፝͜⁞M͢ᴇɡ፝֟ᴜᴍ⃨ɪɴ⃜✰⃔𝓛𝓲𝓰𝓱𝓽࿐ᩣ⋆̟(◣_◢)༎ຶ',  // اسم القناة
            serverMessageId: -1,
          },
          externalAdReply: {
            title: 'انضم إلى الجروب',
            body: 'اضغط هنا للانضمام إلى الجروب!',
            thumbnailUrl: 'https://i.postimg.cc/fTbJNMy2/76bb0e816c38a757838b402611ea883a.jpg',  // رابط الصورة المصغرة
            mediaType: 1,
            mediaUrl: 'https://chat.whatsapp.com/I7sLaRBY4n8g8Zsok8h7GH',  // رابط الجروب
          },
        },
      }
    );
  } catch {
    try {
      const lol = await fetch(`https://api.lolhuman.xyz/api/translate/auto/ar?apikey=${lolkeysapi}&text=${text}`);
      const loll = await lol.json();
      const result2 = loll.result.translated;

      // إرسال الترجمة مع معلومات الرسالة
      await conn.sendMessage(
        m.chat,
        { 
          image: { url: 'https://i.postimg.cc/SRwz1547/IMG-20241010-182407.jpg' }, // إضافة الصورة هنا
          caption: `════════════════════════╗\n➬ *${detectedLang.toUpperCase()}*: ${text}\n════════════════════════╣\n➬ *Arabic*: ${result2}\n════════════════════════╝`, // التعليق على الصورة مع الرمز "➬"
          contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363325281734612@newsletter',
              newsletterName: '⏤͟͞ू⃪ ፝͜⁞M͢ᴇɡ፝֟ᴜᴍ⃨ɪɴ⃜✰⃔𝓛𝓲𝓰𝓱𝓽࿐ᩣ⋆̟(◣_◢)༎ຶ',
              serverMessageId: -1,
            },
            externalAdReply: {
              title: 'انضم إلى الجروب',
              body: 'اضغط هنا للانضمام إلى الجروب!',
              thumbnailUrl: 'https://i.postimg.cc/fTbJNMy2/76bb0e816c38a757838b402611ea883a.jpg',
              mediaType: 1,
              mediaUrl: 'https://chat.whatsapp.com/I7sLaRBY4n8g8Zsok8h7GH',
            },
          },
        }
      );
    } catch {
      await conn.reply(m.chat, '✨️ *حدث خطأ. يرجى إدخال نص للترجمة.*', m); // الرسالة المعدلة
    }
  }
};

// هنا يتم تعيين الأوامر
handler.customPrefix = /ترجمي|ترجمه|ترجميلي|ترجم/i; // هنا تم إضافة الأمر 'ترجم'
handler.command = new RegExp; // يبقى كما هو

handler.help = ['ترجم']; // هنا يتم تعيين المساعدة
handler.tags = ['tools'];

export default handler;