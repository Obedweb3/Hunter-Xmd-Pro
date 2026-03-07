const { cmd } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed", "latency"],
    desc: "Check bot response speed",
    category: "main",
    react: "🏓",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    const start = Date.now();
    const msg = await conn.sendMessage(from, { text: '🏓 *Pinging...*' }, { quoted: mek });
    const end = Date.now();
    const latency = end - start;
    const speed = latency < 500 ? '🟢 Fast' : latency < 1500 ? '🟡 Medium' : '🔴 Slow';
    
    await conn.sendMessage(from, {
        text: `🏓 *PONG!*\n\n⚡ *Latency:* ${latency}ms\n📶 *Speed:* ${speed}\n🕐 *Time:* ${new Date().toLocaleTimeString()}`
    }, { quoted: mek });
});
