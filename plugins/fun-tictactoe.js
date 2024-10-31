import TicTacToe from '../lib/tictactoe.js'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    conn.game = conn.game || {}

    // إذا كان الأمر delttt
    if (command === 'delttt') {
        let room = Object.values(conn.game).find(room => room.state === 'WAITING' && [room.game.playerX, room.game.playerO].includes(m.sender))
        
        if (!room) {
            throw '*[❗] لا توجد غرفة للعبة تيك تاك تو لتخرج منها.*'
        } else {
            delete conn.game[room.id]
            await m.reply('*[✅] تم حذف الغرفة بنجاح.*')
        }
        return
    }

    // التحقق من أن المستخدم ليس في غرفة لعبة حالية
    if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) {
        throw '*[❗] أنت بالفعل في غرفة لعب! استخدم الأمر ${usedPrefix}delttt للخروج من الغرفة الحالية.*'
    }

    // التحقق من وجود اسم للغرفة
    if (!text) {
        return m.reply(`*[❗] يجب تحديد اسم للغرفة لإنشاء لعبة جديدة.*\n\n*مثال: ${usedPrefix + command} اسم_الغرفة*\n*◉ للانضمام إلى اللعبة بنفس اسم الغرفة التي تم إنشاؤها.*`)
    }

    // البحث عن غرفة في وضع الانتظار بنفس الاسم
    let room = Object.values(conn.game).find(room => room.state === 'WAITING' && room.name === text)

    if (room) {
        // إذا تم العثور على غرفة، انضم إلى اللعبة
        await m.reply('*[🕹️] انضممت إلى اللعبة، اللعبة تبدأ الآن!*')
        room.o = m.chat
        room.game.playerO = m.sender
        room.state = 'PLAYING'

        // إعداد لوحة اللعبة
        let arr = room.game.render().map(v => ({
            X: '❎',
            O: '⭕',
            1: '1️⃣',
            2: '2️⃣',
            3: '3️⃣',
            4: '4️⃣',
            5: '5️⃣',
            6: '6️⃣',
            7: '7️⃣',
            8: '8️⃣',
            9: '9️⃣',
        }[v]))

        // رسالة حالة اللعبة
        let str = `
🎮 تيك تاك تو 🎮

❎ = @${room.game.playerX.split('@')[0]}
⭕ = @${room.game.playerO.split('@')[0]}

        ${arr.slice(0, 3).join('')}
        ${arr.slice(3, 6).join('')}
        ${arr.slice(6).join('')}

دورك @${room.game.currentTurn.split('@')[0]}
`.trim()

        if (room.x !== room.o) await conn.sendMessage(room.x, { text: str, mentions: conn.parseMention(str) }, { quoted: m })
        await conn.sendMessage(room.o, { text: str, mentions: conn.parseMention(str) }, { quoted: m })

    } else {
        // إذا لم توجد غرفة، أنشئ غرفة جديدة
        room = {
            id: 'tictactoe-' + (+new Date),
            x: m.chat,
            o: '',
            game: new TicTacToe(m.sender, 'o'),
            state: 'WAITING',
            name: text
        }

        let imgplay = `https://cope-cdnmed.agilecontent.com/resources/jpg/8/9/1590140413198.jpg`
        await conn.sendButton(
            m.chat,
            `*🕹 تيك تاك تو 🎮*\n\n*◉ في انتظار اللاعب الثاني*\n*◉ للخروج من اللعبة، استخدم الأمر ${usedPrefix}delttt*\n\n◉ للانضمام، استخدم الأمر: ${usedPrefix + command} ${text}`,
            wm,
            imgplay,
            [
                ['🎮انضم إلى اللعبة', `${usedPrefix + command} ${text}`],
                ['🕹️قـائمة الالعاب', '.العاب']
            ],
            m
        )

        conn.game[room.id] = room
    }
}

handler.help = ['delttt','اكس']
handler.command = /^(tictactoe|لعبه|ttc|ttt|اكس|xo|delttt)$/i

export default handler