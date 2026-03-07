const { cmd } = require('../command');
const axios = require('axios');

const IMG = 'https://files.catbox.moe/xka13x.jpg';

// Try multiple TikTok APIs
async function tiktokDownload(url) {
    const apis = [
        // API 1 - SSSTik style
        async () => {
            const res = await axios.get(`https://api.tikmate.app/api/lookup?url=${encodeURIComponent(url)}`, { timeout: 15000 });
            if (res.data?.id) {
                const token = res.data.token;
                const id = res.data.id;
                return {
                    title: res.data.description || 'TikTok Video',
                    author: res.data.author_name || 'Unknown',
                    video: `https://tikmate.app/download/${token}/${id}.mp4`,
                    audio: null
                };
            }
        },
        // API 2 - Musicaldown
        async () => {
            const res = await axios.post('https://api2.muscdn.me/request', 
                new URLSearchParams({ url }), 
                { timeout: 15000, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
            );
            if (res.data?.video) return { title: res.data.desc || 'TikTok', author: res.data.author || 'Unknown', video: res.data.video, audio: res.data.music };
        },
        // API 3 - snaptik style
        async () => {
            const res = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`, { timeout: 15000 });
            if (res.data?.video?.noWatermark) {
                return { 
                    title: res.data.title || 'TikTok Video', 
                    author: res.data.author?.nickname || 'Unknown',
                    video: res.data.video.noWatermark,
                    audio: res.data.music?.play_url
                };
            }
        },
        // API 4 - Fallback
        async () => {
            const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&count=12&cursor=0&web=1&hd=1`, { timeout: 15000 });
            if (res.data?.data?.play) {
                return {
                    title: res.data.data.title || 'TikTok',
                    author: res.data.data.author?.nickname || 'Unknown',
                    video: res.data.data.play,
                    audio: res.data.data.music
                };
            }
        }
    ];

    for (const api of apis) {
        try {
            const result = await api();
            if (result?.video) return result;
        } catch (e) {}
    }
    throw new Error('All TikTok APIs failed');
}

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`❌ *Usage:* .tiktok [url]\n\n*Example:* .tiktok https://vm.tiktok.com/...`);
        if (!q.includes('tiktok.com') && !q.includes('vm.tiktok')) return reply('❌ Please provide a valid TikTok URL!');
        
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        
        const data = await tiktokDownload(q);
        
        const caption = `🎵 *TikTok Downloader*\n\n📖 *Title:* ${data.title}\n👤 *Author:* ${data.author}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ`;

        await conn.sendMessage(from, {
            video: { url: data.video },
            caption,
            contextInfo: {
                externalAdReply: {
                    title: '🎵 TikTok Video',
                    body: `By ${data.author}`,
                    thumbnailUrl: IMG,
                    sourceUrl: q,
                    mediaType: 1
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error('[TikTok DL]', e.message);
        reply(`❌ *Failed to download!*\n\n_${e.message}_\n\n💡 Try: .tt2 [url] as alternative`);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});

cmd({
    pattern: "tt2",
    alias: ["tiktok2"],
    desc: "TikTok audio download",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('❌ .tt2 [tiktok url]');
        
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        const data = await tiktokDownload(q);
        
        if (!data.audio) return reply('❌ No audio found in this TikTok!');

        await conn.sendMessage(from, {
            audio: { url: data.audio },
            mimetype: 'audio/mpeg',
            fileName: `${data.title}.mp3`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) {
        reply(`❌ Failed: ${e.message}`);
    }
});
