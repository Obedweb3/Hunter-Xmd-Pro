const { cmd } = require('../command');
const axios = require('axios');

const IMG = 'https://files.catbox.moe/xka13x.jpg';

// Format seconds to MM:SS
function fmtDuration(secs) {
    const m = Math.floor(secs / 60), s = secs % 60;
    return `${m}:${s.toString().padStart(2,'0')}`;
}
function fmtNum(n) {
    if (!n) return '0';
    if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
    if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
    return n.toString();
}

// YouTube search + download APIs with multiple fallbacks
async function ytSearch(query) {
    const apis = [
        async () => {
            const res = await axios.get(`https://yt-api.p.rapidapi.com/search?query=${encodeURIComponent(query)}&hl=en&gl=US`, {
                headers: { 'x-rapidapi-host': 'yt-api.p.rapidapi.com' }, timeout: 10000
            });
            const v = res.data?.data?.[0];
            if (v) return { id: v.videoId, title: v.title, thumbnail: v.thumbnail?.[0]?.url, author: v.channelTitle, duration: v.lengthText };
        },
        async () => {
            const res = await axios.get(`https://youtube-search-and-download.p.rapidapi.com/search?query=${encodeURIComponent(query)}&type=v`, {
                headers: { 'x-rapidapi-host': 'youtube-search-and-download.p.rapidapi.com' }, timeout: 10000
            });
            const v = res.data?.contents?.[0]?.video;
            if (v) return { id: v.videoId, title: v.title, thumbnail: v.thumbnails?.[0]?.url, author: v.author?.title, duration: v.lengthText };
        },
        async () => {
            const res = await axios.get(`https://api.siputzx.my.id/api/s/ytsearch?q=${encodeURIComponent(query)}`, { timeout: 10000 });
            const v = res.data?.data?.[0];
            if (v) return { id: v.videoId, title: v.title, thumbnail: v.thumbnail, author: v.channelTitle, duration: v.duration };
        }
    ];
    for (const a of apis) { try { const r = await a(); if (r?.id) return r; } catch (e) {} }
    throw new Error('YouTube search failed');
}

async function ytDownloadAudio(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const apis = [
        async () => {
            const res = await axios.get(`https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(url)}`, { timeout: 20000 });
            if (res.data?.data?.download) return res.data.data.download;
        },
        async () => {
            const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/yt?url=${encodeURIComponent(url)}&type=mp3`, { timeout: 20000 });
            if (res.data?.downloadUrl || res.data?.url) return res.data.downloadUrl || res.data.url;
        },
        async () => {
            const res = await axios.get(`https://ytdlp.silvatechinc.my.id/api/ytmp3?url=${encodeURIComponent(url)}`, { timeout: 20000 });
            if (res.data?.download_url || res.data?.url) return res.data.download_url || res.data.url;
        },
        async () => {
            const res = await axios.get(`https://api.giftedtech.web.id/api/download/ytmp3?apikey=gifted&url=${encodeURIComponent(url)}`, { timeout: 25000 });
            if (res.data?.result?.download_url) return res.data.result.download_url;
        },
        async () => {
            const res = await axios.get(`https://yt-download.org/api/button/mp3/${videoId}`, { timeout: 20000 });
            const match = res.data?.match(/href="(https:\/\/[^"]+\.mp3[^"]*)"/);
            if (match) return match[1];
        }
    ];
    for (const a of apis) { try { const r = await a(); if (r) return r; } catch (e) {} }
    throw new Error('Audio download failed - all APIs offline');
}

async function ytDownloadVideo(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const apis = [
        async () => {
            const res = await axios.get(`https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(url)}`, { timeout: 25000 });
            if (res.data?.data?.download) return res.data.data.download;
        },
        async () => {
            const res = await axios.get(`https://api.giftedtech.web.id/api/download/ytmp4?apikey=gifted&url=${encodeURIComponent(url)}`, { timeout: 25000 });
            if (res.data?.result?.download_url) return res.data.result.download_url;
        },
        async () => {
            const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/yt?url=${encodeURIComponent(url)}&type=mp4`, { timeout: 25000 });
            if (res.data?.downloadUrl || res.data?.url) return res.data.downloadUrl || res.data.url;
        },
        async () => {
            const res = await axios.get(`https://ytdlp.silvatechinc.my.id/api/ytmp4?url=${encodeURIComponent(url)}`, { timeout: 25000 });
            if (res.data?.download_url || res.data?.url) return res.data.download_url || res.data.url;
        }
    ];
    for (const a of apis) { try { const r = await a(); if (r) return r; } catch (e) {} }
    throw new Error('Video download failed - all APIs offline');
}

// =================== PLAY (Audio) ===================
cmd({
    pattern: "play",
    alias: ["song", "music", "ytmp3", "mp3", "audio"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`❌ *Usage:* .play [song name or YouTube URL]\n\n*Example:*\n• .play Alan Walker Faded\n• .play https://youtu.be/...`);

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        const searching = await conn.sendMessage(from, { text: `🔍 *Searching:* ${q}...` }, { quoted: mek });

        let videoInfo;
        // Check if it's a URL or search query
        const ytIdMatch = q.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|shorts\/))([a-zA-Z0-9_-]{11})/);
        if (ytIdMatch) {
            videoInfo = { id: ytIdMatch[1], title: 'YouTube Video', thumbnail: `https://i.ytimg.com/vi/${ytIdMatch[1]}/hqdefault.jpg`, author: 'YouTube', duration: '' };
        } else {
            videoInfo = await ytSearch(q);
        }

        await conn.sendMessage(from, { text: `⬇️ *Downloading audio...*\n🎵 ${videoInfo.title}`, edit: searching.key });

        const dlUrl = await ytDownloadAudio(videoInfo.id);

        await conn.sendMessage(from, { delete: searching.key });

        await conn.sendMessage(from, {
            audio: { url: dlUrl },
            mimetype: 'audio/mpeg',
            fileName: `${(videoInfo.title || 'audio').replace(/[^\w\s]/gi, '')}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: `🎵 ${(videoInfo.title || 'Audio').substring(0, 40)}`,
                    body: `👤 ${videoInfo.author || 'YouTube'} • ⏱️ ${videoInfo.duration || ''}`,
                    thumbnailUrl: videoInfo.thumbnail || IMG,
                    sourceUrl: `https://youtu.be/${videoInfo.id}`,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error('[Play]', e.message);
        reply(`❌ *Download Failed*\n\n_${e.message}_\n\n💡 Try again or use a direct YouTube URL`);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});

// =================== VIDEO ===================
cmd({
    pattern: "video",
    alias: ["ytmp4", "ytvideo", "vid", "mp4"],
    desc: "Download YouTube video",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`❌ *Usage:* .video [name or URL]\n\n*Example:*\n• .video Naruto Opening\n• .video https://youtu.be/...`);

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        const searching = await conn.sendMessage(from, { text: `🔍 *Searching:* ${q}...` }, { quoted: mek });

        let videoInfo;
        const ytIdMatch = q.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|shorts\/))([a-zA-Z0-9_-]{11})/);
        if (ytIdMatch) {
            videoInfo = { id: ytIdMatch[1], title: 'YouTube Video', thumbnail: `https://i.ytimg.com/vi/${ytIdMatch[1]}/hqdefault.jpg`, author: 'YouTube', duration: '' };
        } else {
            videoInfo = await ytSearch(q);
        }

        await conn.sendMessage(from, { text: `⬇️ *Downloading video...*\n🎬 ${videoInfo.title}`, edit: searching.key });

        const dlUrl = await ytDownloadVideo(videoInfo.id);

        await conn.sendMessage(from, { delete: searching.key });

        await conn.sendMessage(from, {
            video: { url: dlUrl },
            mimetype: 'video/mp4',
            fileName: `${(videoInfo.title || 'video').replace(/[^\w\s]/gi, '')}.mp4`,
            caption: `🎬 *${videoInfo.title}*\n👤 ${videoInfo.author || 'YouTube'}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ`,
            contextInfo: {
                externalAdReply: {
                    title: `🎬 ${(videoInfo.title || 'Video').substring(0, 40)}`,
                    body: `👤 ${videoInfo.author || 'YouTube'}`,
                    thumbnailUrl: videoInfo.thumbnail || IMG,
                    sourceUrl: `https://youtu.be/${videoInfo.id}`,
                    mediaType: 1
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error('[Video]', e.message);
        reply(`❌ *Download Failed*\n\n_${e.message}_`);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});
