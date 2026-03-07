const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "uptime",
    alias: ["runtime", "ut"],
    desc: "Check bot uptime",
    category: "main",
    react: "⏰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    const uptime = runtime(process.uptime());
    reply(`⏰ *Bot Uptime*\n\n🕐 *Running for:* ${uptime}\n✅ *Status:* Online & Active`);
});
