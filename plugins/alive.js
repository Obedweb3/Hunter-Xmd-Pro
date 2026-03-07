const { cmd } = require('../command');
const os = require('os');
const { runtime } = require('../lib/functions');
const config = require('../config');

const IMAGE = 'https://files.catbox.moe/xka13x.jpg';

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check if bot is alive",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
        const uptime = runtime(process.uptime());

        const status =
`╭━━━〔 ⚡ *HUNTER XMD PRO* ⚡ 〕━━━╮
┃
┃  ✅ *Bot is Active & Online!*
┃
┃  👑 *Owner:* ${config.OWNER_NAME}
┃  🔧 *Prefix:* [ ${config.PREFIX} ]
┃  🌐 *Mode:* ${config.MODE}
┃  📱 *Platform:* Multi-Device
┃  💡 *Version:* 5.0.0 PRO
┃
┃  🧠 *RAM:* ${ramUsed}MB / ${totalRam}MB
┃  🖥️ *Host:* ${os.hostname()}
┃  ⏰ *Uptime:* ${uptime}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ`;

        await conn.sendMessage(from, {
            image: { url: IMAGE },
            caption: status,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363416335506023@newsletter',
                    newsletterName: 'ᴏʙᴇᴅᴛᴇᴄʜ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("[Alive] Error:", e);
        reply(`Error: ${e.message}`);
    }
});
