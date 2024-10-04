import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (!text) return conn.sendMessage(m.chat, { text: 'يرجى تقديم الأسئلة، على سبيل المثال: \n .ميغي مرحبا' }, { quoted: m });
  const { key } = await m.reply("*انتظر...*");

  // URL الـ API
  const apiUrl = "https://agungdev.us.kg/api/ai/gpt?query=" + encodeURIComponent(text);

  try {
    // إرسال الطلب إلى الـ API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "accept": "application/json",
      }
    });

    const result = await response.json();

    // التحقق مما إذا كان الطلب ناجحًا
    if (result.status) {
      const aiResponse = result.result.message; // الحصول على رد الذكاء الاصطناعي من الـ API
      await conn.sendMessage(m.chat, {
        text: "*megumin ai*: \n" + aiResponse, // جعل النص بنفس تنسيق SILANA AI
        edit: key,
      });
    } else {
      conn.sendMessage(m.chat, { text: 'فشل في الحصول على رد من الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.' }, { quoted: m });
    }
  } catch (error) {
    console.error('Error:', error);
    conn.sendMessage(m.chat, { text: 'حدث خطأ أثناء محاولة الاتصال بالـ API.' }, { quoted: m });
  }
};

// البيانات الوصفية للمعالج
handler.help = ['ميغي', 'ميغومين'];
handler.command = ['ميغي', 'ميغومين'];
handler.tags = ['ai'];

export default handler;