import fs from 'fs';

// تأكد من تحديد معرف المالك بشكل صحيح
const OWNER_ID = '212760517793@s.whatsapp.net'; // استبدلها بمعرف المالك الصحيح

// Handler لحذف مستخدم من ملف JSON
let deleteUserHandler = async (m, { conn, text }) => {
    // تحقق من وجود اسم المجموعة
    if (!text) throw '*『✦』يرجى إدخال اسم المجموعة لحذف المستخدم.* مثال: .حذف teba';

    let groupName = text.trim();
    let filePath = `./${groupName}.json`;

    // تحقق من وجود ملف المجموعة
    if (!fs.existsSync(filePath)) throw `*『✦』الملف الخاص بالمجموعة "${groupName}" غير موجود.*`;

    // قراءة البيانات من الملف
    let users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // تحقق من أن المستخدم هو المالك
    if (m.sender !== OWNER_ID) {
        return conn.sendMessage(m.chat, { text: '*『✦』هذا الأمر مخصص للمالك فقط.*' }, { quoted: m });
    }

    // تحقق من وجود رد على رسالة شخص أو استخدم المرسل
    let userIdToDelete = m.quoted ? m.quoted.sender : m.sender;

    // البحث عن المستخدم في الملف
    let userIndex = users.findIndex(u => u.id === userIdToDelete);
    if (userIndex === -1) {
        return conn.sendMessage(m.chat, { text: `*『✦』لم يتم العثور على المستخدم في هذه المجموعة.*` }, { quoted: m });
    }

    // حذف المستخدم
    users.splice(userIndex, 1);

    // حفظ التحديثات إلى الملف
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    // الرد بتأكيد الحذف
    return conn.sendMessage(m.chat, { text: `*『✦』تم حذف المستخدم بنجاح من المجموعة.*` }, { quoted: m });
};

deleteUserHandler.help = ['حذف'];
deleteUserHandler.tags = ['gc'];
deleteUserHandler.command = ['حذف'];

export default deleteUserHandler;