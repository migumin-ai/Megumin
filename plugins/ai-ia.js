import fetch from "node-fetch";

let handler = async (m, { conn, command, text }) => {
    if (!text) throw `مثال : \n.${command} ما هو الاسلام`;
    let apii = await fetch(`https://xynz.vercel.app/api/openai?text=${text}`);
    let res = await apii.json();
    conn.reply(m.chat, `
*[ CHAT OPENAI BY MEGUMIN AI ]*

${res.result}
`.trim(), m);
}

handler.help = ['openai'];
handler.tags = ['ai'];
handler.command = /^(openai)$/i;
handler.limit = false;

export default handler;