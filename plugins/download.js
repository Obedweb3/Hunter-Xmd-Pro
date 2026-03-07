const axios = require('axios');
const { cmd } = require('../command');

const IMG = 'https://files.catbox.moe/xka13x.jpg';
const FOOTER = '> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ';

// =================== TWITTER ===================
cmd({
    pattern: "twitter",
    alias: ["tweet", "twdl", "xdl"],
    desc: "Download Twitter/X videos",
    category: "download",
    react: "🐦",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('❌ *Usage:* .twitter [url]\n\n*Example:* .twitter https://x.com/...');

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        let dlUrl, title;
        const apis = [
            async () => {
                const res = await axios.get(`https://api.siputzx.my.id/api/d/twitter?url=${encodeURIComponent(q)}`, { timeout: 15000 });
                if (res.data?.data?.url) return { url: res.data.data.url, title: res.data.data.description || 'Twitter Video' };
            },
            async () => {
                const res = await axios.get(`https://api.giftedtech.web.id/api/download/twitterdl?apikey=gifted&url=${encodeURIComponent(q)}`, { timeout: 15000 });
                if (res.data?.result?.url) return { url: res.data.result.url, title: res.data.result.description || 'Twitter Video' };
            },
            async () => {
                const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/twitter?url=${encodeURIComponent(q)}`, { timeout: 15000 });
                if (res.data?.url || res.data?.downloadUrl) return { url: res.data.url || res.data.downloadUrl, title: 'Twitter Video' };
            }
        ];

        for (const api of apis) {
            try { const r = await api(); if (r?.url) { dlUrl = r.url; title = r.title; break; } } catch (e) {}
        }

        if (!dlUrl) return reply('❌ Failed to download! Try another URL.');

        await conn.sendMessage(from, {
            video: { url: dlUrl },
            caption: `🐦 *Twitter Downloader*\n\n📖 ${title}\n\n${FOOTER}`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// =================== INSTAGRAM ===================
cmd({
    pattern: "ig2",
    alias: ["insta2", "igdl2"],
    desc: "Download Instagram (alternate method)",
    category: "download",
    react: "📸",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.includes('instagram.com')) return reply('❌ .ig2 [instagram url]');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const res = await axios.get(`https://api.giftedtech.web.id/api/download/instagramdl?apikey=gifted&url=${encodeURIComponent(q)}`, { timeout: 15000 });
        const items = res.data?.result;
        if (!items?.length) return reply('❌ Nothing found!');

        for (const item of items.slice(0, 3)) {
            if (item.type === 'image') {
                await conn.sendMessage(from, { image: { url: item.url }, caption: `📸 Instagram Photo\n${FOOTER}` }, { quoted: mek });
            } else {
                await conn.sendMessage(from, { video: { url: item.url }, caption: `🎬 Instagram Video\n${FOOTER}` }, { quoted: mek });
            }
        }
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// =================== MEDIAFIRE ===================
cmd({
    pattern: "mediafire",
    alias: ["mfire", "mf"],
    desc: "Download MediaFire files",
    category: "download",
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('❌ .mediafire [mediafire url]');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const apis = [
            async () => {
                const res = await axios.get(`https://api.siputzx.my.id/api/d/mediafire?url=${encodeURIComponent(q)}`, { timeout: 15000 });
                if (res.data?.data?.url) return res.data.data;
            },
            async () => {
                const res = await axios.get(`https://api.giftedtech.web.id/api/download/mediafire?apikey=gifted&url=${encodeURIComponent(q)}`, { timeout: 15000 });
                if (res.data?.result?.download_url) return { url: res.data.result.download_url, name: res.data.result.filename, type: res.data.result.filetype };
            }
        ];

        let data;
        for (const a of apis) { try { data = await a(); if (data?.url) break; } catch (e) {} }
        if (!data?.url) return reply('❌ Download failed!');

        await conn.sendMessage(from, {
            document: { url: data.url },
            fileName: data.name || data.fileName || 'mediafire_file',
            mimetype: data.type || data.mimetype || 'application/octet-stream',
            caption: `🔥 *MediaFire Download*\n📄 ${data.name || 'File'}\n${FOOTER}`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// =================== APK ===================
cmd({
    pattern: "apk",
    alias: ["apkdl"],
    desc: "Download Android APK",
    category: "download",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('❌ .apk [app name]\n\n*Example:* .apk WhatsApp');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const res = await axios.get(`http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(q)}/limit=1`, { timeout: 15000 });
        const app = res.data?.datalist?.list?.[0];
        if (!app) return reply('❌ App not found!');

        const size = (app.size / 1048576).toFixed(2);
        const caption = `📱 *APK Downloader*\n\n📦 *Name:* ${app.name}\n🏋 *Size:* ${size} MB\n👨‍💻 *Dev:* ${app.developer?.name}\n📅 *Updated:* ${app.updated}\n\n${FOOTER}`;

        await conn.sendMessage(from, {
            document: { url: app.file.path_alt },
            fileName: `${app.name}.apk`,
            mimetype: 'application/vnd.android.package-archive',
            caption
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// =================== GOOGLE DRIVE ===================
cmd({
    pattern: "gdrive",
    alias: ["gdl"],
    desc: "Download Google Drive files",
    category: "download",
    react: "🌐",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('❌ .gdrive [drive url]');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const res = await axios.get(`https://api.giftedtech.web.id/api/downloader/gdrive?apikey=gifted&url=${encodeURIComponent(q)}`, { timeout: 20000 });
        const result = res.data?.result;
        if (!result?.downloadUrl) return reply('❌ Could not get download link!');

        await conn.sendMessage(from, {
            document: { url: result.downloadUrl },
            fileName: result.fileName || 'gdrive_file',
            mimetype: result.mimetype || 'application/octet-stream',
            caption: `🌐 *Google Drive Download*\n📄 ${result.fileName || 'File'}\n${FOOTER}`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

// =================== PINTEREST ===================
cmd({
    pattern: "pindl",
    alias: ["pins", "pinterest", "pin"],
    desc: "Download Pinterest images/videos",
    category: "download",
    react: "📌",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('❌ .pindl [pinterest url]');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const apis = [
            async () => {
                const res = await axios.get(`https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(q)}`, { timeout: 15000 });
                return res.data?.result?.media;
            },
            async () => {
                const res = await axios.get(`https://api.siputzx.my.id/api/d/pinterest?url=${encodeURIComponent(q)}`, { timeout: 15000 });
                if (res.data?.data?.url) return [{ download_url: res.data.data.url, type: res.data.data.type }];
            }
        ];

        let media;
        for (const a of apis) { try { media = await a(); if (media?.length) break; } catch (e) {} }
        if (!media?.length) return reply('❌ No media found!');

        const item = media[0];
        const url = item.download_url || item.url;
        const isVideo = item.type?.includes('video') || url?.includes('.mp4');

        if (isVideo) {
            await conn.sendMessage(from, { video: { url }, caption: `📌 *Pinterest Video*\n${FOOTER}` }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { image: { url }, caption: `📌 *Pinterest Image*\n${FOOTER}` }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});
