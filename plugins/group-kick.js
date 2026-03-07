const { cmd } = require('../command');

cmd({
    pattern: "remove",
    alias: ["kick", "k"],
    desc: "Remove a member from the group",
    category: "group",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isBotAdmins, isAdmins, isOwner, isCreator, reply }) => {
    if (!isGroup) return reply("❌ Group only command!");
    if (!isAdmins && !isOwner && !isCreator) return reply("❌ Admins only!");
    if (!isBotAdmins) return reply("❌ Make me admin first!");

    let jid;
    if (m.quoted) {
        jid = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid[0]) {
        jid = m.mentionedJid[0];
    } else if (q) {
        const num = q.replace(/[^0-9]/g, '');
        if (num) jid = num + '@s.whatsapp.net';
    }

    if (!jid) return reply("❌ Reply to a message or mention a user!\nUsage: .kick @user");

    try {
        await conn.groupParticipantsUpdate(from, [jid], "remove");
        reply(`✅ *Removed!*\n👤 @${jid.split('@')[0]}`, { mentions: [jid] });
    } catch (e) {
        reply(`❌ Failed: ${e.message}`);
    }
});
