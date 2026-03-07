// Credits ObedTech - HUNTER XMD PRO 💜
// Fixed & Enhanced Group Events

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const getContextInfo = (senderJid) => ({
    mentionedJid: [senderJid],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363416335506023@newsletter',
        newsletterName: 'ᴏʙᴇᴅᴛᴇᴄʜ',
        serverMessageId: 143,
    },
});

const THUMBNAIL = 'https://files.catbox.moe/xka13x.jpg';

async function getProfilePic(conn, jid) {
    try {
        return await conn.profilePictureUrl(jid, 'image');
    } catch {
        return THUMBNAIL;
    }
}

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id)) return;

        const metadata = await conn.groupMetadata(update.id).catch(() => null);
        if (!metadata) return;

        const participants = update.participants || [];
        const desc = metadata.desc || 'No Description';
        const groupName = metadata.subject || 'Unknown Group';
        const groupCount = metadata.participants.length;
        const groupPic = await getProfilePic(conn, update.id);

        for (const num of participants) {
            const userName = num.split('@')[0];
            const timestamp = new Date().toLocaleString();
            let userPic;
            try { userPic = await conn.profilePictureUrl(num, 'image'); }
            catch { userPic = THUMBNAIL; }

            // ===== WELCOME =====
            if (update.action === 'add' && config.WELCOME === 'true') {
                const welcomeMsg =
`╭━━━〔 👋 *WELCOME* 〕━━━╮
┃ 🎉 *New Member Joined!*
┃
┃ 👤 *Name:* @${userName}
┃ 👥 *Group:* ${groupName}
┃ 🔢 *Member #:* ${groupCount}
┃ ⏰ *Time:* ${timestamp}
┃
┃ 📜 *Group Rules:*
┃ ${desc.slice(0, 200)}
┃
┃ _Welcome aboard! Enjoy your stay_ 🌟
╰━━━━━━━━━━━━━━━━━━━━━━━╯
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ`;

                await conn.sendMessage(update.id, {
                    image: { url: userPic },
                    caption: welcomeMsg,
                    mentions: [num],
                    contextInfo: getContextInfo(num),
                });
            }

            // ===== GOODBYE =====
            else if (update.action === 'remove' && config.WELCOME === 'true') {
                const goodbyeMsg =
`╭━━━〔 👋 *GOODBYE* 〕━━━╮
┃ 😢 *Member Left/Removed!*
┃
┃ 👤 *Name:* @${userName}
┃ 👥 *Group:* ${groupName}
┃ 🔢 *Remaining:* ${groupCount} members
┃ ⏰ *Time:* ${timestamp}
┃
┃ _We'll miss you! Come back soon_ 💔
╰━━━━━━━━━━━━━━━━━━━━━━━╯
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ`;

                await conn.sendMessage(update.id, {
                    image: { url: userPic },
                    caption: goodbyeMsg,
                    mentions: [num],
                    contextInfo: getContextInfo(num),
                });
            }

            // ===== DEMOTE =====
            else if (update.action === 'demote' && config.ADMIN_EVENTS === 'true') {
                const demoter = update.author ? update.author.split('@')[0] : 'Unknown';
                await conn.sendMessage(update.id, {
                    image: { url: groupPic },
                    caption:
`╭━━━〔 🔴 *ADMIN DEMOTED* 〕━━━╮
┃ ⬇️ Admin Status Removed
┃
┃ 👤 *User:* @${userName}
┃ 🔧 *By:* @${demoter}
┃ 👥 *Group:* ${groupName}
┃ ⏰ *Time:* ${timestamp}
╰━━━━━━━━━━━━━━━━━━━━━━━╯
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ`,
                    mentions: [num, update.author].filter(Boolean),
                    contextInfo: getContextInfo(num),
                });
            }

            // ===== PROMOTE =====
            else if (update.action === 'promote' && config.ADMIN_EVENTS === 'true') {
                const promoter = update.author ? update.author.split('@')[0] : 'Unknown';
                await conn.sendMessage(update.id, {
                    image: { url: groupPic },
                    caption:
`╭━━━〔 🟢 *NEW ADMIN* 〕━━━╮
┃ ⬆️ Admin Status Granted!
┃
┃ 👤 *User:* @${userName}
┃ 🔧 *By:* @${promoter}
┃ 👥 *Group:* ${groupName}
┃ ⏰ *Time:* ${timestamp}
┃
┃ _Congratulations! 🎉_
╰━━━━━━━━━━━━━━━━━━━━━━━╯
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴏʙᴇᴅ ᴛᴇᴄʜ`,
                    mentions: [num, update.author].filter(Boolean),
                    contextInfo: getContextInfo(num),
                });
            }
        }
    } catch (err) {
        console.error('[GroupEvents] Error:', err.message);
    }
};

module.exports = GroupEvents;
