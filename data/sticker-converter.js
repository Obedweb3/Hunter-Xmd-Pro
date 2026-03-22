const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

class StickerConverter {
    constructor() {
        this.tempDir = path.join(__dirname, '../temp');
        this.ensureTempDir();
    }

    ensureTempDir() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    /**
     * Converts a sticker buffer into an image file.
     *
     * This function saves the provided sticker buffer to a temporary file,
     * then uses the fluent-ffmpeg library to convert the sticker into a PNG image.
     * After conversion, it reads the resulting image file and returns its content.
     * The function also handles cleanup of temporary files in a finally block,
     * ensuring that both the sticker and output image files are deleted.
     *
     * @param {Buffer} stickerBuffer - The buffer containing the sticker data to be converted.
     */
    async convertStickerToImage(stickerBuffer) {
        const tempPath = path.join(this.tempDir, `sticker_${Date.now()}.webp`);
        const outputPath = path.join(this.tempDir, `image_${Date.now()}.png`);

        try {
            // Save sticker to temp file
            await fs.promises.writeFile(tempPath, stickerBuffer);

            // Convert using fluent-ffmpeg (same as your video sticker converter)
            await new Promise((resolve, reject) => {
                ffmpeg(tempPath)
                    .on('error', reject)
                    .on('end', resolve)
                    .output(outputPath)
                    .run();
            });

            // Read and return converted image
            return await fs.promises.readFile(outputPath);
        } catch (error) {
            console.error('Conversion error:', error);
            throw new Error('Failed to convert sticker to image');
        } finally {
            // Cleanup temp files
            await Promise.all([
                fs.promises.unlink(tempPath).catch(() => {}),
                fs.promises.unlink(outputPath).catch(() => {})
            ]);
        }
    }
}

module.exports = new StickerConverter();
