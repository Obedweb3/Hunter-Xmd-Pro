const config = require('../config');
const { cmd, commands } = require('../command');
const os = require('os');
const { runtime } = require('../lib/functions');

const IMAGE = 'https://files.catbox.moe/xka13x.jpg';
const POWERED = 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ';
const NEWSLETTER = {
    newsletterJid: '120363416335506023@newsletter',
    newsletterName: 'ᴏʙᴇᴅᴛᴇᴄʜ',
    serverMessageId: 143
};

cmd({
    pattern: "menu3",
    alias: ["allmenu", "fullmenu", "listcmd"],
    desc: "Show all bot commands - full list",
    category: "menu",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        const uptime = runtime(process.uptime());
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);

        const fullMenu =
`╔══════════════════════════╗
║  🚀 *${config.BOT_NAME}*
║  📜 COMPLETE COMMAND LIST
╚══════════════════════════╝

╭── 📊 *BOT STATUS* ────────╮
│ 👑 ${config.OWNER_NAME} | ⚡ ${uptime}
│ 🔧 Prefix: ${config.PREFIX} | 🧠 ${ram}MB
╰────────────────────────────╯

╭━━〔 📥 *DOWNLOADS* 〕━━╮
┃ • facebook / fb2 [url]
┃ • tiktok / tt2 [url]
┃ • twitter [url]
┃ • instagram [url]
┃ • pinterest / pins [url]
┃ • spotify [query]
┃ • play [song] • play2-10
┃ • ytmp3 / ytmp4 [url]
┃ • video / audio [query]
┃ • apk / apk2 [name]
┃ • mediafire [url]
┃ • gdrive [url]
┃ • ssweb [url]
╰────────────────────────────╯

╭━━〔 👥 *GROUP COMMANDS* 〕━━╮
┃ • add [number]
┃ • kick / remove @user
┃ • promote / demote @user
┃ • mute / unmute
┃ • lockgc / unlockgc
┃ • tagall / hidetag [msg]
┃ • tagadmins
┃ • grouplink / revoke
┃ • ginfo / getpic
┃ • updategname [name]
┃ • updategdesc [desc]
┃ • newgc [name] @users
┃ • invite [link]
┃ • disappear on/off
┃ • allreq / joinrequests
┃ • kickall / kickall2/3
┃ • senddm / poll
╰────────────────────────────╯

╭━━〔 🤖 *AI / TOOLS* 〕━━╮
┃ • gpt / ai [query]
┃ • imagine [prompt]
┃ • define [word]
┃ • weather [city]
┃ • translate [lang] [text]
┃ • news [query]
┃ • imagescan [reply img]
┃ • tts [text]
┃ • rmbg [reply img]
┃ • logo [text]
┃ • movie [name]
╰────────────────────────────╯

╭━━〔 🎭 *FUN* 〕━━╮
┃ • ship @user
┃ • truth / dare
┃ • joke / quote
┃ • emojimix / emix
┃ • fancy [text]
┃ • hack @user
┃ • wanted / jail @user
┃ • prank @user
┃ • blur / invert / grey
┃ • nokia / ad
╰────────────────────────────╯

╭━━〔 ❤️ *REACTIONS* 〕━━╮
┃ • hug / kiss / slap @tag
┃ • punch / pat / bite @tag
┃ • cuddle / bully / wave
┃ • happy / sad / dance
┃ • cry / laugh / love
╰────────────────────────────╯

╭━━〔 🔄 *CONVERTERS* 〕━━╮
┃ • sticker [reply img/vid]
┃ • toimg [reply sticker]
┃ • togif [reply video]
┃ • tts [text]
┃ • pdf [url]
┃ • mp3 / mp4 [url]
╰────────────────────────────╯

╭━━〔 ⚙️ *OWNER* 〕━━╮
┃ • autobio on/off
┃ • antidelete on/off
┃ • broadcast [msg]
┃ • setpp [reply img]
┃ • mode public/private
┃ • restart / shutdown
┃ • sudo add/remove [num]
┃ • block / unblock @user
┃ • setbio [text]
┃ • setname [name]
╰────────────────────────────╯

╭━━〔 🕌 *QURAN/PRAYER* 〕━━╮
┃ • quran [surah:ayah]
┃ • prayertime [city]
┃ • surah [name/number]
┃ • dua / hadith / tasbih
╰────────────────────────────╯

╭━━〔 📌 *UTILITY* 〕━━╮
┃ • ping / alive / uptime
┃ • repo / runtime / speed
┃ • getpair / jid
┃ • checkupdate
┃ • tinyurl [url]
┃ • gitclone [repo]
┃ • npm [package]
┃ • privacy [setting]
╰────────────────────────────╯

> © ${POWERED}`;

        await conn.sendMessage(from, {
            image: { url: IMAGE },
            caption: fullMenu,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: NEWSLETTER
            }
        }, { quoted: mek });

    } catch (e) {
        console.error('[AllMenu] Error:', e);
        reply(`Error: ${e.message}`);
    }
});
