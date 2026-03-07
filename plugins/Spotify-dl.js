const { cmd } = require('../command');
const axios = require('axios');
const IMG = 'https://files.catbox.moe/xka13x.jpg';

/**
 * Downloads a Spotify track from multiple APIs.
 *
 * The function attempts to fetch download information from a list of predefined APIs. It encodes the provided URL and makes asynchronous requests to each API. If a successful response containing a download link is received, it returns the relevant data. If all API requests fail, an error is thrown.
 *
 * @param url - The Spotify track URL to download.
 * @returns The download information of the track if successful.
 * @throws Error If all Spotify APIs fail to provide a download link.
 */
async function spotifyDownload(url) {
    const apis = [
        async () => {
            const res = await axios.get(`https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(url)}`, { timeout: 20000 });
            if (res.data?.data?.download) return res.data.data;
        },
        async () => {
            const res = await axios.get(`https://api.giftedtech.web.id/api/download/spotifydl?apikey=gifted&url=${encodeURIComponent(url)}`, { timeout: 20000 });
            if (res.data?.result) return { title: res.data.result.title, artis: res.data.result.artists, image: res.data.result.image, download: res.data.result.download_url, durasi: res.data.result.duration_ms };
        },
        async () => {
            const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/spotify?url=${encodeURIComponent(url)}`, { timeout: 20000 });
            if (res.data?.downloadUrl) return { title: res.data.metadata?.name || 'Spotify Track', artis: res.data.metadata?.artists?.join(', '), image: res.data.metadata?.image, download: res.data.downloadUrl, durasi: 0 };
        }
    ];
    for (const a of apis) { try { const r = await a(); if (r?.download) return r; } catch (e) {} }
    throw new Error('All Spotify APIs failed');
}

cmd({
    pattern: "spotify",
    alias: ["sptdl", "spotifydl", "spotidown"],
    desc: "Download Spotify music as MP3",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('❌ *Usage:* .spotify [spotify url]\n\n*Example:* .spotify https://open.spotify.com/track/...');
        if (!q.includes('spotify.com')) return reply('❌ Please provide a valid Spotify URL!');

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        const data = await spotifyDownload(q);

        const durSec = Math.floor((data.durasi || 0) / 1000);
        const dur = `${Math.floor(durSec/60)}:${(durSec%60).toString().padStart(2,'0')}`;

        const caption = `🎵 *Spotify Downloader*\n\n🎶 *Title:* ${data.title || 'Unknown'}\n🧑‍🎤 *Artist:* ${data.artis || 'Unknown'}\n⏱️ *Duration:* ${dur}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ`;

        if (data.image) {
            await conn.sendMessage(from, { image: { url: data.image }, caption }, { quoted: mek });
        }

        await conn.sendMessage(from, {
            audio: { url: data.download },
            mimetype: 'audio/mpeg',
            fileName: `${(data.title || 'spotify').replace(/[^\w\s]/gi, '')}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: `🎵 ${(data.title || 'Spotify').substring(0, 40)}`,
                    body: `🧑‍🎤 ${data.artis || 'Unknown'}`,
                    thumbnailUrl: data.image || IMG,
                    sourceUrl: q,
                    mediaType: 1
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) {
        reply(`❌ Failed: ${e.message}`);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});
