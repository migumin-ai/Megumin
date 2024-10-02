import fs from 'fs';
import path from 'path';

const dataFolder = './data'; // مسار حفظ البيانات
if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);

const getGroupDataFilePath = (groupId) => path.join(dataFolder, `${groupId}.json`);

// دالة لحذف العضو من ملف JSON الخاص بالمجموعة
const deleteMember = (groupId, username) => {
    const filePath = getGroupDataFilePath(groupId);
    if (!fs.existsSync(filePath)) {
        return { success: false, message: 'لا يوجد أعضاء مسجلين في هذه المجموعة.' };
    }

    let members = JSON.parse(fs.readFileSync(filePath));

    const memberIndex = members.findIndex(member => member.username === username);
    if (memberIndex === -1) {
        return { success: false, message: `@${username} غير موجود في قائمة المسجلين.` };
    }

    // حذف العضو
    const removedMember = members.splice(memberIndex, 1);

    // تحديث ملف JSON بعد حذف العضو
    fs.writeFileSync(filePath, JSON.stringify(members, null, 2));

    return { success: true, message: `تم حذف @${username} من القائمة.`, removedMember };
};

var handler = async (m, { conn, args, isAdmin, isGroupAdmin }) => {
    const groupId = m.chat; // معرف المجموعة

    // التحقق مما إذا كان المستخدم مشرفًا
    const groupMetadata = await conn.groupMetadata(m.chat);
    const senderIsAdmin = groupMetadata.participants.find(participant => participant.id === m.sender && participant.admin);
    
    if (!senderIsAdmin) {
        return conn.sendMessage(m.chat, { text: 'هذا الأمر مخصص للمشرفين فقط.' });
    }

    // التأكد من أن المستخدم ذكر شخصًا باستخدام التاغ
    if (!m.mentionedJid.length) {
        return conn.sendMessage(m.chat, { text: 'يرجى استخدام التاغ لحذف العضو، مثل: .dt @username' });
    }

    const username = m.mentionedJid[0].split('@')[0]; // استرداد اسم المستخدم

    // حذف العضو من الملف
    const { success, message, removedMember } = deleteMember(groupId, username);
    
    if (success) {
        return conn.sendMessage(m.chat, { text: message, mentions: [m.mentionedJid[0]] });
    } else {
        return conn.sendMessage(m.chat, { text: message });
    }
};

handler.help = ['dt @username'];
handler.register = false;
handler.group = true;
handler.tags = ['info'];
handler.command = ['dt']; // الأمر الجديد

export default handler;
