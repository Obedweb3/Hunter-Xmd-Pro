const { cmd } = require('../command');

cmd({
    pattern: "mute",
    alias: ["closegc"],
    desc: "Mute the group (only admins can send)",
    category: "group",
    react: "🔇",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, isOwner, isCreator, reply }) => {
    if (!isGroup) return reply("❌ Group only!");
    if (!isAdmins && !isOwner && !isCreator) return reply("❌ Admins only!");
    if (!isBotAdmins) return reply("❌ Make me admin first!");
    try {
        await conn.groupSettingUpdate(from, 'announcement');
        reply("🔇 *Group Muted!*\nOnly admins can send messages now.");
    } catch(e) { reply(`❌ Failed: ${e.message}`); }
});

cmd({
    pattern: "unmute",
    alias: ["opengc"],
    desc: "Unmute the group (everyone can send)",
    category: "group",
    react: "🔊",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, isOwner, isCreator, reply }) => {
    if (!isGroup) return reply("❌ Group only!");
    if (!isAdmins && !isOwner && !isCreator) return reply("❌ Admins only!");
    if (!isBotAdmins) return reply("❌ Make me admin first!");
    try {
        await conn.groupSettingUpdate(from, 'not_announcement');
        reply("🔊 *Group Unmuted!*\nEveryone can send messages now.");
    } catch(e) { reply(`❌ Failed: ${e.message}`); }
});
