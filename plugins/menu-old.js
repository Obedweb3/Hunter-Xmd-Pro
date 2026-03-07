const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const os = require('os');

const IMG = 'https://files.catbox.moe/xka13x.jpg';
const FOOTER = '© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ';

cmd({
    pattern: "menu",
    alias: ["help", "start", "home"],
    desc: "Show main bot menu",
    category: "menu",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
        const uptime = runtime(process.uptime());
        const time = new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const date = new Date().toDateString();

        // Try sending with list (button-style menu)
        try {
            await conn.sendMessage(from, {
                text: `╔══════════════════════╗\n║  ⚡ *${config.BOT_NAME}* ⚡\n╚══════════════════════╝\n\n👋 Hey *${pushname || 'User'}!*\n\n📊 *System Info*\n├ 👑 Owner: *${config.OWNER_NAME}*\n├ 🔧 Prefix: *${config.PREFIX}*\n├ 🌐 Mode: *${config.MODE}*\n├ ⏰ Uptime: *${uptime}*\n├ 🧠 RAM: *${ram}MB*\n└ 🕐 Time: *${time}*\n\n📋 *Select a menu category below:*\n\n> ${FOOTER}`,
                footer: FOOTER,
                title: `⚡ ${config.BOT_NAME}`,
                buttonText: '📋 View Menus',
                sections: [
                    {
                        title: '📋 Main Categories',
                        rows: [
                            { title: '📥 Download Menu', rowId: '.dlmenu', description: 'TikTok, YouTube, FB, IG, Spotify...' },
                            { title: '👥 Group Menu', rowId: '.groupmenu', description: 'Kick, promote, mute, tag, welcome...' },
                            { title: '🎭 Fun Menu', rowId: '.funmenu', description: 'Ship, truth, dare, stickers...' },
                            { title: '🤖 AI Menu', rowId: '.aimenu', description: 'GPT, Imagine, Define, TTS...' },
                        ]
                    },
                    {
                        title: '🔧 More Options',
                        rows: [
                            { title: '❤️ Reactions Menu', rowId: '.reactmenu', description: 'Hug, kiss, slap, dance...' },
                            { title: '🔄 Convert Menu', rowId: '.convertmenu', description: 'Sticker, GIF, PDF, MP3...' },
                            { title: '⚙️ Owner Menu', rowId: '.ownermenu', description: 'Settings, autobio, broadcast...' },
                            { title: '📜 All Commands', rowId: '.allmenu', description: 'View complete command list' },
                        ]
                    }
                ]
            }, { quoted: mek });
        } catch (listErr) {
            // Fallback: image + text menu if list fails
            const menuText = `╔══════════════════════════╗\n║  ⚡ *${config.BOT_NAME}* ⚡\n╚══════════════════════════╝\n\n👋 Hey *${pushname || 'User'}!*\n\n╭─── 📊 *BOT INFO* ─────╮\n│ 👑 ${config.OWNER_NAME}\n│ 🔧 Prefix: *${config.PREFIX}*\n│ 🌐 Mode: *${config.MODE}*\n│ ⏰ ${uptime} | 🧠 ${ram}MB\n╰────────────────────────╯\n\n╭─── 📋 *CATEGORIES* ────╮\n│ 📥 .dlmenu    → Downloads\n│ 👥 .groupmenu → Group\n│ 🎭 .funmenu   → Fun\n│ 🤖 .aimenu    → AI Tools\n│ ❤️  .reactmenu → Reactions\n│ 🔄 .convertmenu\n│ ⚙️  .ownermenu → Owner\n│ 📜 .allmenu   → All Cmds\n╰────────────────────────╯\n\n> ${FOOTER}`;

            await conn.sendMessage(from, {
                image: { url: IMG },
                caption: menuText,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363416335506023@newsletter',
                        newsletterName: 'ᴏʙᴇᴅᴛᴇᴄʜ',
                        serverMessageId: 143
                    }
                }
            }, { quoted: mek });
        }

    } catch (e) {
        console.error('[Menu]', e);
        reply(`Error: ${e.message}`);
    }
});
