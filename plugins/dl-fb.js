const axios = require('axios');
const { cmd } = require('../command');

async function fbDownload(url) {
    const apis = [
        async () => {
            const res = await axios.get(`https://api.tiklydown.eu.org/api/download/fb?url=${encodeURIComponent(url)}`, { timeout: 15000 });
            if (res.data?.video) return { title: res.data.title || 'Facebook Video', hd: res.data.video?.hd, sd: res.data.video?.sd || res.data.video?.hd };
        },
        async () => {
            const res = await axios.get(`https://social-media-video-downloader.com/api/v1/download?url=${encodeURIComponent(url)}`, { timeout: 15000 });
            if (res.data?.links?.[0]?.url) return { title: 'Facebook Video', sd: res.data.links[0].url, hd: res.data.links[1]?.url };
        },
        async () => {
            const res = await axios.get(`https://api.fgmods.xyz/api/downloader/fbdl?url=${encodeURIComponent(url)}&apikey=mnp3grlZ`, { timeout: 15000 });
            if (res.data?.result?.hd || res.data?.result?.sd) return { title: res.data.result.title || 'FB Video', hd: res.data.result.hd, sd: res.data.result.sd };
        },
        async () => {
            const res = await axios.get(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(url)}`, { timeout: 15000 });
            if (res.data?.data?.url) return { title: 'Facebook Video', sd: res.data.data.url, hd: res.data.data.url };
        }
    ];
    for (const api of apis) {
        try { const r = await api(); if (r?.sd || r?.hd) return r; } catch (e) {}
    }
    throw new Error('All Facebook APIs failed');
}

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdl", "fb2"],
    desc: "Download Facebook videos (SD/HD)",
    category: "download",
    react: "📘",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('❌ *Usage:* .fb [facebook url]\n\n*Example:* .fb https://www.facebook.com/...');
        if (!q.includes('facebook.com') && !q.includes('fb.watch') && !q.includes('fb.com')) return reply('❌ Invalid Facebook URL!');

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        const data = await fbDownload(q);

        const videoUrl = data.hd || data.sd;
        const caption = `📘 *Facebook Downloader*\n\n📖 *Title:* ${data.title}\n📹 *Quality:* ${data.hd ? 'HD + SD' : 'SD'}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ`;

        await conn.sendMessage(from, { video: { url: videoUrl }, caption }, { quoted: mek });
        
        if (data.hd && data.sd && data.hd !== data.sd) {
            await conn.sendMessage(from, { video: { url: data.sd }, caption: '📹 SD Quality' }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) {
        reply(`❌ Failed: ${e.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});
