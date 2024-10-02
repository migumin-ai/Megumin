import fs from 'fs';
import path from 'path';
import axios from 'axios';

const dataFolder = './data'; // مسار حفظ البيانات
if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);

const getGroupDataFilePath = (groupId) => path.join(dataFolder, `${groupId}.json`);

const saveMember = (groupId, username, title) => {
    const filePath = getGroupDataFilePath(groupId);
    let members = [];

    // قراءة البيانات الحالية إذا كانت موجودة
    if (fs.existsSync(filePath)) {
        members = JSON.parse(fs.readFileSync(filePath));
    }

    // تحقق مما إذا كان العضو مسجلاً بالفعل
    const existingMember = members.find(member => member.username === username);
    if (existingMember) {
        return { 
            success: false, 
            message: `@${username} هو عضو مسجل بالفعل باللقب "${existingMember.title}".`, // استخدام tag وإظهار اللقب
            existingMemberUsername: username
        };
    }

    // تحقق مما إذا كان اللقب مسجلاً بالفعل
    const titleHolder = members.find(member => member.title === title);
    if (titleHolder) {
        return { success: false, message: `اللقب "${title}" مسجل بالفعل من قبل @${titleHolder.username}.`, titleHolderUsername: titleHolder.username }; // اللقب مسجل بالفعل
    }

    // إضافة العضو الجديد
    members.push({ username, title });

    // حفظ البيانات مرة أخرى
    fs.writeFileSync(filePath, JSON.stringify(members, null, 2));
    return { success: true, message: `تم تسجيل العضو بنجاح.` }; // تم تسجيل العضو بنجاح
};

const getVideoList = async () => {
    const response = await axios.get('https://gist.githubusercontent.com/migumin-ai/7e6f0db698b7a2e200a26e8b80da7b8a/raw/a9bffb24ca42a886512d34fa1c262f096622bb4c/alimaoie-megi%25F0%259F%258C%259F');
    return response.data; // إرجاع قائمة الفيديوهات
};

const getMembersList = (groupId) => {
    const filePath = getGroupDataFilePath(groupId);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath));
    }
    return [];
};

var handler = async (m, { conn, args }) => {
    const groupId = m.chat; // معرف المجموعة
    const groupMetadata = await conn.groupMetadata(m.chat); // استرداد معلومات المجموعة
    const groupName = groupMetadata.subject; // اسم المجموعة
    const senderId = m.sender.split('@')[0]; // معرف المرسل

    // تحقق إذا كان المستخدم مشرفًا
    const isAdmin = groupMetadata.participants.find(p => p.id === m.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    if (!isAdmin) {
        return conn.sendMessage(m.chat, { text: 'عذرًا، هذا الأمر مخصص للمشرفين فقط.' });
    }

    // تحقق إذا كان الأمر يطلب عرض الأعضاء المسجلين
    if (args[0] === 'مسجلين') {
        let members = getMembersList(groupId);
        if (members.length === 0) {
            return conn.sendMessage(m.chat, { text: 'لا يوجد أعضاء مسجلين في هذه المجموعة.' });
        }
        let memberList = members.map(member => `@${member.username} (${member.title})`).join('\n');
        return conn.sendMessage(m.chat, { text: `أعضاء المجموعة:\n${memberList}`, mentions: members.map(member => `${member.username}@s.whatsapp.net`) });
    }

    // التأكد من وجود التاغ
    if (!m.mentionedJid.length) {
        return conn.sendMessage(m.chat, { text: 'يرجى استخدام التاغ لتسجيل الأعضاء، مثل: .سجل @username اللقب' });
    }

    // استرداد العضو ولقبه
    const username = m.mentionedJid[0].split('@')[0]; // استخدام الجزء قبل @
    const title = args[1] || 'بدون لقب'; // إذا لم يتم إدخال لقب، نستخدم "بدون لقب"

    // حفظ العضو
    const { success, message, existingMemberUsername, titleHolderUsername } = saveMember(groupId, username, title);
    if (success) {
        // اختيار فيديو عشوائي
        const videoList = await getVideoList(); // استرداد قائمة الفيديوهات
        const randomVideo = videoList[Math.floor(Math.random() * videoList.length)].vid; // اختيار فيديو عشوائي

        // إعداد الرسالة مع تفاصيل التسجيل
        const messageWithDetails = `👤 *ʀᴇɢɪꜱᴛᴇʀ-الـسِـجِـلّ *👤
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「💭」🅃الـلـقـب-title: ${title}
「✨️」*tag-الـمـنـشـن*: @${username}
「🏷️」*group-الـمـجـمـوعـه*: ${groupName}
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「📬」* ፝͜⁞M͢ᴇɢ፝֟ᴜᴍ⃨ɪɴ⃜✰⃔-مــغــومــيــن:*
اتـمـنـى ان تـحـظـى بـوقـت مـمـتـع فـي نـقـابـتـنا 
ارجـو منك ان تـكون عـضـوا مـتـفاعـلا 
وان تـحـتـرم افـراد الـجـروب
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•`;

        // إرسال الرسالة مع الفيديو
        await conn.sendMessage(m.chat, {
            video: { url: randomVideo },
            caption: messageWithDetails,
            mentions: [m.mentionedJid[0]],
        });
    } else {
        const mentionList = [];
        if (existingMemberUsername) {
            mentionList.push(existingMemberUsername + '@s.whatsapp.net');
        }
        if (titleHolderUsername) {
            mentionList.push(titleHolderUsername + '@s.whatsapp.net');
        }
        conn.sendMessage(m.chat, { text: message, mentions: mentionList });
    }
}

handler.help = ['سجل @username اللقب', 'سجل مسجلين'];
handler.register = false;
handler.group = true;
handler.tags = ['info'];
handler.command = ['سجل']; // الأمر الجديد

export default handler;
