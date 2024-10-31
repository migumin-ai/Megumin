// import db from './database.js'
let handler = async (m, { conn, text }) => {
  let who;

  // تحقق مما إذا كان الرد على رسالة
  if (m.quoted && m.quoted.sender) {
    who = m.quoted.sender; // إذا كان هناك رد، استخدم معرف المرسل للرسالة المقتبسة
  } else {
    throw '✳️ *يجب عليك الرد على رسالة المستخدم*'; // تأكد من أنه يتم الرد على رسالة
  }

  let txt = text.trim(); // استخدام النص بالكامل بعد إزالة العلامات
  if (!txt) throw '✳️ *أدخل مبلغ *خبرة* الذي تريد إضافته*'; // تأكد من وجود مبلغ
  if (isNaN(txt)) throw '🔢 *أرقام فقط*'; // تأكد من أن المدخلات هي أرقام

  let xp = parseInt(txt); // تحويل النص إلى عدد صحيح

  if (xp < 1) throw '✳️ الحد الأدنى *1*'; // تأكد من أن XP أكبر من 0

  let users = global.db.data.users; // الوصول إلى بيانات المستخدمين
  if (!users[who]) users[who] = { exp: 0 }; // التأكد من وجود المستخدم في قاعدة البيانات

  // إضافة XP للمستخدم
  users[who].exp += xp; 

  // تأكيد إضافة XP
  console.log(`تم إضافة ${xp} XP لـ ${who}. المجموع الحالي: ${users[who].exp}`);

  await m.reply(`≡ ~*تمت إضافة الخبرة*~
*┓✥━═━═━━═━═━✥*
*▢  ▢ المجموع: +${xp}*
*┛✥━═━═━━═━═━✥*`);
};

handler.help = ['addxp <المبلغ>'];
handler.tags = ['econ'];
handler.command = ['خبرة+', 'addxp'];
handler.rowner = true;

export default handler;