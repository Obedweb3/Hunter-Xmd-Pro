const axios = require('axios')

/**
 * Fetches a buffer from the specified URL using an HTTP GET request.
 *
 * This function utilizes axios to send a GET request to the provided URL,
 * applying any additional options specified. It sets default headers for
 * the request and expects the response to be in arraybuffer format.
 * If an error occurs during the request, it logs the error to the console.
 *
 * @param {string} url - The URL to fetch the buffer from.
 * @param {Object} [options] - Optional configuration for the request.
 */
const getBuffer = async(url, options) => {
	try {
		options ? options : {}
		var res = await axios({
			method: 'get',
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(e)
	}
}

/**
 * Retrieves the IDs of participants who are admins.
 */
const getGroupAdmins = (participants) => {
	var admins = []
	for (let i of participants) {
		i.admin !== null  ? admins.push(i.id) : ''
	}
	return admins
}

/**
 * Generates a random number followed by a specified extension.
 */
const getRandom = (ext) => {
	return `${Math.floor(Math.random() * 10000)}${ext}`
}

/**
 * Converts a number to a human-readable string with metric suffixes.
 */
const h2k = (eco) => {
	var lyrik = ['', 'K', 'M', 'B', 'T', 'P', 'E']
	var ma = Math.log10(Math.abs(eco)) / 3 | 0
	if (ma == 0) return eco
	var ppo = lyrik[ma]
	var scale = Math.pow(10, ma * 3)
	var scaled = eco / scale
	var formatt = scaled.toFixed(1)
	if (/\.0$/.test(formatt))
		formatt = formatt.substr(0, formatt.length - 2)
	return formatt + ppo
}

/**
 * Checks if a given string is a valid URL.
 */
const isUrl = (url) => {
	return url.match(
		new RegExp(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/,
			'gi'
		)
	)
}

/**
 * Converts a string to a JSON string with indentation.
 */
const Json = (string) => {
    return JSON.stringify(string, null, 2)
}

const runtime = (seconds) => {
	seconds = Number(seconds)
	var d = Math.floor(seconds / (3600 * 24))
	var h = Math.floor(seconds % (3600 * 24) / 3600)
	var m = Math.floor(seconds % 3600 / 60)
	var s = Math.floor(seconds % 60)
	var dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : ''
	var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : ''
	var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : ''
	var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

/**
 * Pauses execution for a specified number of milliseconds.
 */
const sleep = async(ms) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Fetches JSON data from a specified URL.
 *
 * This function makes an asynchronous GET request to the provided URL using axios.
 * It allows for optional configuration through the `options` parameter, which can
 * include additional request settings. The function handles errors by returning
 * the error object if the request fails.
 *
 * @param {string} url - The URL to fetch the JSON data from.
 * @param {object} [options] - Optional configuration for the axios request.
 */
const fetchJson = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}

module.exports = { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep , fetchJson}
