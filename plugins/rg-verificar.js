import { createHash } from 'crypto'
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix, command }) {
let user = global.db.data.users[m.sender]
let name2 = conn.getName(m.sender)
if (user.registered === true) throw `*『✦』Ya estas registrado, para volver a registrarte, usa el comando: #unreg*`
if (!Reg.test(text)) throw `*『✦』El comando ingresado es incorrecto, uselo de la siguiente manera:*\n\n#reg *Nombre.edad*\n\n\`\`\`Ejemplo:\`\`\`\n#reg *${name2}.18*`
let [_, name, splitter, age] = text.match(Reg)
if (!name) throw '*『✦』No puedes registrarte sin nombre, el nombre es obligatorio. Inténtelo de nuevo.*'
if (!age) throw '*『✦』No puedes registrarte sin la edad, la edad es opcional. Inténtelo de nuevo.*'
if (name.length >= 30) throw '*『✦』El nombre no debe de tener mas de 30 caracteres.*' 
age = parseInt(age)
if (age > 999) throw '*『😏』الـجـد يـريـد ان يـلـهـو مـعي*'
if (age < 5) throw '*『🍼』هـل اتي لاتـبـنـاك/ي يـا صـغـيـري!!*'
user.name = name.trim()
user.age = age
user.regTime = + new Date
user.registered = true
global.db.data.users[m.sender].money += 600
global.db.data.users[m.sender].estrellas += 10
global.db.data.users[m.sender].exp += 245
global.db.data.users[m.sender].joincount += 5
let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6)        
m.react('📩') 
let regbot = `👤 *ʀᴇɢɪꜱᴛᴇʀ-الـسِـجِـلّ *👤
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「💭」*name-الاسـم*: ${name}
「✨️」*age-العمر*: ${age} سـنـه
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「🎁」*𝑹𝒆𝒘𝒂𝒓𝒅𝒔-اڵــمــڪــافــآت:*
• 15 النجوم 🌟
• 5 العملات الصغيرة 🪙
• 245 الخبرة 💸
• 12 التوكنز 💰
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
${packname}`
await conn.sendMini(m.chat, '⊱『✅𝆺𝅥 ​🇷​​🇪​​🇬​​🇮​​🇸​​🇹​​🇷​​🇪​​🇩​ 𝆹𝅥✅』⊰', textbot, regbot, imagen1, imagen1, channel, m)
//await m.reply(`${sn}`)        
}
handler.help = ['سجل']
handler.tags = ['rg']
handler.command = ['verify', 'تسجيل', 'reg', 'سجل', 'registrar'] 

export default handler
