const { cmd } = require('../command');

cmd({
    pattern: "unlockgc",
    alias: ["unlock", "unlockg"],
    desc: "Unlock group (everyone can edit settings)",
    category: "group",
    react: "🔓",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, isOwner, isCreator, reply }) => {
    if (!isGroup) return reply("❌ Group only!");
    if (!isAdmins && !isOwner && !isCreator) return reply("❌ Admins only!");
    if (!isBotAdmins) return reply("❌ Make me admin first!");
    try {
        await conn.groupSettingUpdate(from, 'unlocked');
        reply("🔓 *Group Unlocked!*\nEveryone can edit group settings now.");
    } catch(e) { reply(`❌ Failed: ${e.message}`); }
});
