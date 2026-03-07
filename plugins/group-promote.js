const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["makeadmin"],
    desc: "Promote a member to admin",
    category: "group",
    react: "⬆️",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isBotAdmins, isAdmins, isOwner, isCreator, reply }) => {
    if (!isGroup) return reply("❌ Group only command!");
    if (!isAdmins && !isOwner && !isCreator) return reply("❌ Admins only!");
    if (!isBotAdmins) return reply("❌ Make me admin first!");

    let jid;
    if (m.quoted) jid = m.quoted.sender;
    else if (m.mentionedJid && m.mentionedJid[0]) jid = m.mentionedJid[0];
    else if (q) { const n = q.replace(/[^0-9]/g,''); if(n) jid = n+'@s.whatsapp.net'; }
    if (!jid) return reply("❌ Reply or mention a user!\nUsage: .promote @user");

    try {
        await conn.groupParticipantsUpdate(from, [jid], "promote");
        reply(`⬆️ *Promoted to Admin!*\n👤 @${jid.split('@')[0]}`, { mentions: [jid] });
    } catch(e) { reply(`❌ Failed: ${e.message}`); }
});
