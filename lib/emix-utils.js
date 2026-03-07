const axios = require("axios");

/**
 * Fetch Emoji Mix image from API.
 *
 * This function retrieves an image URL by sending a request to the emoji mix API with two provided emojis.
 * It validates the input emojis, constructs the API URL, and handles the response to return the image URL.
 * If the input is invalid or the API response does not contain a valid image, it throws an error.
 *
 * @param emoji1 - First emoji.
 * @param emoji2 - Second emoji.
 * @returns A promise that resolves to the image URL.
 * @throws Error If the input emojis are invalid or if no valid image is found.
 */
async function fetchEmix(emoji1, emoji2) {
    try {
        if (!emoji1 || !emoji2) {
            throw new Error("Invalid emoji input. Please provide two emojis.");
        }

        const apiUrl = `https://levanter.onrender.com/emix?q=${encodeURIComponent(emoji1)},${encodeURIComponent(emoji2)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.result) {
            return response.data.result; // Return the image URL
        } else {
            throw new Error("No valid image found.");
        }
    } catch (error) {
        console.error("Error fetching emoji mix:", error.message);
        throw new Error("Failed to fetch emoji mix.");
    }
}

module.exports = { fetchEmix };
