const { cmd } = require('../command');

cmd({
    pattern: "lockgc",
    alias: ["lock", "lockg"],
    desc: "Lock group (only admins can edit settings)",
    category: "group",
    react: "🔒",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, isOwner, isCreator, reply }) => {
    if (!isGroup) return reply("❌ Group only!");
    if (!isAdmins && !isOwner && !isCreator) return reply("❌ Admins only!");
    if (!isBotAdmins) return reply("❌ Make me admin first!");
    try {
        await conn.groupSettingUpdate(from, 'locked');
        reply("🔒 *Group Locked!*\nOnly admins can edit group settings.");
    } catch(e) { reply(`❌ Failed: ${e.message}`); }
});
