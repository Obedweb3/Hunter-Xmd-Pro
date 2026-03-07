const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const os = require('os');

const IMG = 'https://files.catbox.moe/xka13x.jpg';
const FOOTER = '© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ';
const NL = {
    newsletterJid: '120363416335506023@newsletter',
    newsletterName: 'ᴏʙᴇᴅᴛᴇᴄʜ',
    serverMessageId: 143
};

const subMenus = {
    dlmenu: {
        emoji: '📥', title: 'DOWNLOAD MENU',
        sections: [
            {
                title: '🎵 Music & Video',
                rows: [
                    { title: '.play [song]', rowId: 'play', description: 'Download YouTube audio as MP3' },
                    { title: '.video [name]', rowId: 'video', description: 'Download YouTube video MP4' },
                    { title: '.spotify [url]', rowId: 'spotify', description: 'Download Spotify track' },
                    { title: '.ytmp3 [url]', rowId: 'ytmp3', description: 'YouTube to MP3 by URL' },
                ]
            },
            {
                title: '📱 Social Media',
                rows: [
                    { title: '.tiktok [url]', rowId: 'tiktok', description: 'TikTok no watermark video' },
                    { title: '.fb [url]', rowId: 'fb', description: 'Facebook video SD/HD' },
                    { title: '.ig [url]', rowId: 'ig', description: 'Instagram photo/video/reel' },
                    { title: '.twitter [url]', rowId: 'twitter', description: 'Twitter/X video download' },
                ]
            },
            {
                title: '🔗 Other Downloads',
                rows: [
                    { title: '.apk [name]', rowId: 'apk', description: 'Download Android APK' },
                    { title: '.mediafire [url]', rowId: 'mediafire', description: 'Download MediaFire file' },
                    { title: '.gdrive [url]', rowId: 'gdrive', description: 'Download Google Drive file' },
                    { title: '.pindl [url]', rowId: 'pindl', description: 'Pinterest image/video' },
                ]
            }
        ]
    },
    groupmenu: {
        emoji: '👥', title: 'GROUP MENU',
        sections: [
            {
                title: '👮 Admin Commands',
                rows: [
                    { title: '.kick / .remove @user', rowId: 'kick', description: 'Remove member from group' },
                    { title: '.promote @user', rowId: 'promote', description: 'Make member admin' },
                    { title: '.demote @user', rowId: 'demote', description: 'Remove admin status' },
                    { title: '.add [number]', rowId: 'add', description: 'Add member to group' },
                ]
            },
            {
                title: '⚙️ Group Settings',
                rows: [
                    { title: '.mute / .unmute', rowId: 'mute', description: 'Toggle group send rights' },
                    { title: '.lockgc / .unlockgc', rowId: 'lockgc', description: 'Lock/unlock group settings' },
                    { title: '.updategname [name]', rowId: 'updategname', description: 'Change group name' },
                    { title: '.updategdesc [text]', rowId: 'updategdesc', description: 'Change group description' },
                ]
            },
            {
                title: '📢 Tags & Info',
                rows: [
                    { title: '.tagall / .hidetag', rowId: 'tagall', description: 'Tag all members' },
                    { title: '.tagadmins', rowId: 'tagadmins', description: 'Tag only admins' },
                    { title: '.ginfo', rowId: 'ginfo', description: 'Show group information' },
                    { title: '.grouplink / .revoke', rowId: 'grouplink', description: 'Get/reset invite link' },
                ]
            }
        ]
    },
    funmenu: {
        emoji: '🎭', title: 'FUN MENU',
        sections: [
            {
                title: '😄 Games & Fun',
                rows: [
                    { title: '.ship @user', rowId: 'ship', description: 'Compatibility meter with someone' },
                    { title: '.truth / .dare', rowId: 'truth', description: 'Truth or dare game' },
                    { title: '.joke', rowId: 'joke', description: 'Random joke' },
                    { title: '.quote', rowId: 'quote', description: 'Inspirational quote' },
                ]
            },
            {
                title: '🖼️ Image Fun',
                rows: [
                    { title: '.wanted @user', rowId: 'wanted', description: 'Wanted poster with profile pic' },
                    { title: '.jail @user', rowId: 'jail', description: 'Jail filter on photo' },
                    { title: '.blur / .invert', rowId: 'blur', description: 'Image effects' },
                    { title: '.fancy [text]', rowId: 'fancy', description: 'Fancy text styles' },
                ]
            }
        ]
    },
    aimenu: {
        emoji: '🤖', title: 'AI MENU',
        sections: [
            {
                title: '🧠 AI Tools',
                rows: [
                    { title: '.gpt [question]', rowId: 'gpt', description: 'Ask ChatGPT anything' },
                    { title: '.imagine [prompt]', rowId: 'imagine', description: 'Generate AI image' },
                    { title: '.define [word]', rowId: 'define', description: 'Get word definition' },
                    { title: '.tts [text]', rowId: 'tts', description: 'Text to speech audio' },
                ]
            }
        ]
    },
    ownermenu: {
        emoji: '⚙️', title: 'OWNER MENU',
        sections: [
            {
                title: '🔧 Bot Control',
                rows: [
                    { title: '.autobio on/off', rowId: 'autobio', description: 'Toggle auto bio changer' },
                    { title: '.antidelete on/off', rowId: 'antidelete', description: 'Toggle anti-delete protection' },
                    { title: '.broadcast [msg]', rowId: 'broadcast', description: 'Send message to all groups' },
                    { title: '.mode public/private', rowId: 'mode', description: 'Change bot mode' },
                ]
            },
            {
                title: '👤 Profile',
                rows: [
                    { title: '.setbio [text]', rowId: 'setbio', description: 'Set custom bio manually' },
                    { title: '.setpp [reply img]', rowId: 'setpp', description: 'Set bot profile picture' },
                    { title: '.setname [name]', rowId: 'setname', description: 'Change bot display name' },
                    { title: '.restart', rowId: 'restart', description: 'Restart the bot' },
                ]
            }
        ]
    }
};

// Register sub-menu commands
for (const [key, data] of Object.entries(subMenus)) {
    cmd({
        pattern: key,
        alias: [],
        desc: `Show ${data.title}`,
        category: 'menu',
        react: data.emoji,
        filename: __filename
    },
    async (conn, mek, m, { from, sender, pushname, reply }) => {
        try {
            const prefix = config.PREFIX;
            try {
                await conn.sendMessage(from, {
                    text: `${data.emoji} *${data.title}*\n\n_Select a command from the list below:_\n\n> ${FOOTER}`,
                    footer: FOOTER,
                    title: `${data.emoji} ${data.title}`,
                    buttonText: `📋 ${data.title}`,
                    sections: data.sections
                }, { quoted: mek });
            } catch (e) {
                // Fallback text menu
                let txt = `${data.emoji} *${data.title}*\n\n`;
                for (const section of data.sections) {
                    txt += `*${section.title}*\n`;
                    for (const row of section.rows) {
                        txt += `• ${prefix}${row.rowId} - ${row.description}\n`;
                    }
                    txt += '\n';
                }
                txt += `> ${FOOTER}`;
                await conn.sendMessage(from, { image: { url: IMG }, caption: txt, contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: NL } }, { quoted: mek });
            }
        } catch (e) { reply(`Error: ${e.message}`); }
    });
}

// menu2 - smart interactive numbered menu
cmd({
    pattern: "menu2",
    alias: ["smartmenu", "m2"],
    desc: "Interactive bot menu with buttons",
    category: "menu",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
        const uptime = runtime(process.uptime());

        try {
            await conn.sendMessage(from, {
                text: `⚡ *${config.BOT_NAME}*\n\n👋 Hey *${pushname || 'User'}!*\n\n📊 RAM: ${ram}MB | ⏰ ${uptime}\n🔧 Prefix: *${config.PREFIX}* | 🌐 Mode: *${config.MODE}*\n\n_Tap a button below to open a menu:_`,
                footer: FOOTER,
                title: `⚡ ${config.BOT_NAME}`,
                buttonText: '📋 Open Menu',
                sections: [
                    {
                        title: '🎯 Quick Access',
                        rows: [
                            { title: '📥 Downloads', rowId: `${config.PREFIX}dlmenu`, description: 'YT, TikTok, Spotify, FB, IG...' },
                            { title: '👥 Group Tools', rowId: `${config.PREFIX}groupmenu`, description: 'Kick, promote, tag, welcome...' },
                            { title: '🎭 Fun & Games', rowId: `${config.PREFIX}funmenu`, description: 'Ship, truth, dare, effects...' },
                            { title: '🤖 AI Features', rowId: `${config.PREFIX}aimenu`, description: 'GPT, Image AI, TTS, Define...' },
                        ]
                    },
                    {
                        title: '🔧 More',
                        rows: [
                            { title: '⚙️ Owner Settings', rowId: `${config.PREFIX}ownermenu`, description: 'Autobio, antidelete, mode...' },
                            { title: '📜 All Commands', rowId: `${config.PREFIX}allmenu`, description: 'View every single command' },
                            { title: '⚡ Bot Status', rowId: `${config.PREFIX}alive`, description: 'Check if bot is alive' },
                        ]
                    }
                ]
            }, { quoted: mek });
        } catch (listErr) {
            // Fallback image menu
            const menuCaption = `╔══════════════════════════╗\n║  ⚡ *${config.BOT_NAME}* ⚡\n╚══════════════════════════╝\n\n👋 *${pushname || 'User'}* | ⏰ ${uptime}\n\n╭─── 📋 *MENU CATEGORIES* ──╮\n│ 📥 *${config.PREFIX}dlmenu*   → Downloads\n│ 👥 *${config.PREFIX}groupmenu* → Group\n│ 🎭 *${config.PREFIX}funmenu*  → Fun\n│ 🤖 *${config.PREFIX}aimenu*   → AI Tools\n│ ⚙️  *${config.PREFIX}ownermenu* → Owner\n│ 📜 *${config.PREFIX}allmenu*  → All Cmds\n│ ⚡ *${config.PREFIX}alive*    → Status\n╰────────────────────────────╯\n\n> ${FOOTER}`;

            await conn.sendMessage(from, {
                image: { url: IMG }, caption: menuCaption,
                contextInfo: { mentionedJid: [sender], forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: NL }
            }, { quoted: mek });
        }

        // Play menu audio
        try {
            await conn.sendMessage(from, { audio: { url: 'https://files.catbox.moe/62lnxc.mp3' }, mimetype: 'audio/mp3', ptt: true }, { quoted: mek });
        } catch (e) {}

        await conn.sendMessage(from, { react: { text: '⚡', key: mek.key } });
    } catch (e) {
        reply(`Error: ${e.message}`);
    }
});
