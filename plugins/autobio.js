const { cmd } = require('../command');
const config = require('../config');

let autoBioInterval = null;

function getRandomBio() {
    const bios = [
        `⚡ ${config.BOT_NAME} | Online 24/7 | ${new Date().toLocaleTimeString()}`,
        `🤖 ${config.BOT_NAME} | Mode: ${config.MODE} | Prefix: ${config.PREFIX}`,
        `💥 ${config.BOT_NAME} | Always Active 🔥`,
        `🚀 ${config.BOT_NAME} | Commands Ready | Prefix: ${config.PREFIX}`,
        `🌟 ${config.BOT_NAME} | Owner: ${config.OWNER_NAME}`,
        `🔥 ${config.BOT_NAME} | Multi-Device Bot`,
        `💎 ObedTech Bot | Time: ${new Date().toLocaleTimeString()}`,
        `🎯 ${config.BOT_NAME} | Smart & Fast ⚡`,
    ];
    return bios[Math.floor(Math.random() * bios.length)];
}

// Start autobio if env var says so
async function startAutoBio(conn) {
    if (config.AUTO_BIO !== 'true' || autoBioInterval) return;
    const intervalMins = parseInt(config.AUTO_BIO_INTERVAL) || 30;
    autoBioInterval = setInterval(async () => {
        try {
            await conn.updateProfileStatus(getRandomBio());
            console.log('[AutoBio] Bio updated');
        } catch (e) { console.error('[AutoBio] Error:', e.message); }
    }, intervalMins * 60 * 1000);
    // Set immediately
    try { await conn.updateProfileStatus(getRandomBio()); } catch (e) {}
    console.log(`[AutoBio] Started - updates every ${intervalMins} min`);
}

global.startAutoBio = startAutoBio;

cmd({
    pattern: "autobio",
    alias: ["setbio", "bio"],
    desc: "Toggle auto bio changer",
    category: "owner",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { from, reply, text, isCreator, isOwner }) => {
    if (!isCreator && !isOwner) return reply('❌ Owner only!');

    const action = (text || '').toLowerCase().trim();

    if (action === 'on' || action === 'enable') {
        if (autoBioInterval) return reply('✅ Auto Bio is *already running!*');
        const mins = parseInt(config.AUTO_BIO_INTERVAL) || 30;
        try { await conn.updateProfileStatus(getRandomBio()); } catch(e) {}
        autoBioInterval = setInterval(async () => {
            try { await conn.updateProfileStatus(getRandomBio()); } catch (e) {}
        }, mins * 60 * 1000);
        config.AUTO_BIO = 'true';
        reply(`✅ *Auto Bio ENABLED!*\n\n📝 Bio changed immediately!\n⏱️ Updates every *${mins} min*\n\n_Use .autobio off to stop_`);

    } else if (action === 'off' || action === 'disable') {
        if (!autoBioInterval) return reply('❌ Auto Bio is already off!');
        clearInterval(autoBioInterval);
        autoBioInterval = null;
        config.AUTO_BIO = 'false';
        reply('❌ *Auto Bio DISABLED!*');

    } else if (action === 'status') {
        reply(`*📝 AUTO BIO STATUS*\n\nStatus: ${autoBioInterval ? '✅ *RUNNING*' : '❌ *STOPPED*'}\nInterval: ${config.AUTO_BIO_INTERVAL || 30} min\n\n*Commands:*\n• .autobio on\n• .autobio off\n• .autobio set [text]`);

    } else if (action.startsWith('set ') || action.startsWith('set')) {
        const customBio = text.slice(text.toLowerCase().indexOf('set ') + 4).trim();
        if (!customBio) return reply('❌ Usage: .autobio set Your bio text here');
        try {
            await conn.updateProfileStatus(customBio);
            reply(`✅ *Bio Updated!*\n\n📝 _${customBio}_`);
        } catch(e) { reply(`❌ Failed: ${e.message}`); }
    } else {
        reply(`*📝 AUTO BIO COMMANDS*\n\n• *.autobio on* - Start auto bio\n• *.autobio off* - Stop auto bio\n• *.autobio status* - Check status\n• *.autobio set [text]* - Set custom bio\n\n*Current Status:* ${autoBioInterval ? '✅ Running' : '❌ Stopped'}\n*Interval:* ${config.AUTO_BIO_INTERVAL || 30} minutes\n\n💡 _Set AUTO_BIO=true in Heroku config to auto-start_`);
    }
});
