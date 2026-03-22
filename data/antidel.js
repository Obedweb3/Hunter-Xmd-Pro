const fs = require('fs');
const path = require('path');

const ANTI_DEL_FILE = path.join(__dirname, 'antidel.json');

// Initialize file if not exists - default ON
if (!fs.existsSync(ANTI_DEL_FILE)) {
    fs.writeFileSync(ANTI_DEL_FILE, JSON.stringify({ enabled: true }, null, 2));
}

async function getAnti() {
    try {
        const data = JSON.parse(fs.readFileSync(ANTI_DEL_FILE, 'utf8'));
        return data.enabled === true;
    } catch (e) {
        return true; // Default ON
    }
}

/**
 * Sets the anti-delete status by writing to a file.
 */
async function setAnti(status) {
    try {
        fs.writeFileSync(ANTI_DEL_FILE, JSON.stringify({ enabled: status }, null, 2));
        return true;
    } catch (e) {
        console.error('Error saving antidel status:', e);
        return false;
    }
}

// Stub functions for compatibility
const AntiDelDB = { get: getAnti, set: setAnti };
/**
 * Initializes anti-delete settings.
 */
const initializeAntiDeleteSettings = async () => true;
const getAllAntiDeleteSettings = async () => ({ enabled: await getAnti() });

module.exports = { getAnti, setAnti, AntiDelDB, initializeAntiDeleteSettings, getAllAntiDeleteSettings };
