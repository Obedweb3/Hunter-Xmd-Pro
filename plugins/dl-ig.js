const { cmd } = require('../command');
const axios = require('axios');
const IMG = 'https://files.catbox.moe/xka13x.jpg';

async function igDownload(url) {
    const apis = [
        async () => {
            const res = await axios.get(`https://api.tiklydown.eu.org/api/download/ig?url=${encodeURIComponent(url)}`, { timeout: 15000 });
            if (res.data?.video || res.data?.image) return { url: res.data.video || res.data.image, type: res.data.video ? 'video' : 'image', caption: res.data.caption };
        },
        async () => {
            const res = await axios.get(`https://api.siputzx.my.id/api/d/instagram?url=${encodeURIComponent(url)}`, { timeout: 15000 });
            if (res.data?.data?.url) return { url: res.data.data.url, type: res.data.data.type === 'image' ? 'image' : 'video', caption: res.data.data.caption };
        },
        async () => {
            const res = await axios.get(`https://api.giftedtech.web.id/api/download/instagramdl?apikey=gifted&url=${encodeURIComponent(url)}`, { timeout: 15000 });
            const item = res.data?.result?.[0];
            if (item) return { url: item.url, type: item.type === 'image' ? 'image' : 'video', caption: res.data.result?.caption };
        }
    ];
    for (const a of apis) { try { const r = await a(); if (r?.url) return r; } catch (e) {} }
    throw new Error('Instagram download failed');
}

cmd({
    pattern: "ig",
    alias: ["instagram", "igdl", "insta"],
    desc: "Download Instagram videos/photos",
    category: "download",
    react: "📸",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('❌ *Usage:* .ig [instagram url]\n\n*Example:* .ig https://www.instagram.com/p/...');
        if (!q.includes('instagram.com')) return reply('❌ Please provide a valid Instagram URL!');

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        const data = await igDownload(q);

        const caption = `📸 *Instagram Downloader*\n${data.caption ? '\n📝 ' + data.caption.slice(0,100) + '...' : ''}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ`;

        if (data.type === 'image') {
            await conn.sendMessage(from, { image: { url: data.url }, caption }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { video: { url: data.url }, caption }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) {
        reply(`❌ Failed: ${e.message}`);
    }
});
