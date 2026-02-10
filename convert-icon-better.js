const sharp = require('sharp');
const fs = require('fs');

async function convertIcons() {
    try {
        const svgBuffer = fs.readFileSync('./assets/icon.svg');

        // Create icon.png (1024x1024) with high quality
        await sharp(svgBuffer, { density: 300 })
            .resize(1024, 1024, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 1 }
            })
            .png({ quality: 100, compressionLevel: 0 })
            .toFile('./assets/icon.png');
        console.log('✓ Created icon.png (1024x1024) - High Quality');

        // Create adaptive-icon.png (1024x1024) with high quality
        await sharp(svgBuffer, { density: 300 })
            .resize(1024, 1024, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 1 }
            })
            .png({ quality: 100, compressionLevel: 0 })
            .toFile('./assets/adaptive-icon.png');
        console.log('✓ Created adaptive-icon.png (1024x1024) - High Quality');

        // Create splash.png (1284x2778) - icon centered on orange background
        const iconBuffer = await sharp(svgBuffer, { density: 300 })
            .resize(900, 900, {
                fit: 'contain',
                background: { r: 255, g: 107, b: 53, alpha: 1 }
            })
            .png({ quality: 100 })
            .toBuffer();

        await sharp({
            create: {
                width: 1284,
                height: 2778,
                channels: 4,
                background: { r: 255, g: 107, b: 53, alpha: 1 } // #FF6B35
            }
        })
            .composite([{
                input: iconBuffer,
                top: Math.floor((2778 - 900) / 2),
                left: Math.floor((1284 - 900) / 2)
            }])
            .png({ quality: 100 })
            .toFile('./assets/splash.png');
        console.log('✓ Created splash.png (1284x2778) - High Quality');

        // Create favicon.png (48x48) with high quality
        await sharp(svgBuffer, { density: 300 })
            .resize(48, 48, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 1 }
            })
            .png({ quality: 100 })
            .toFile('./assets/favicon.png');
        console.log('✓ Created favicon.png (48x48) - High Quality');

        console.log('\n✅ All high-quality icons created successfully!');
        console.log('📁 Files created in ./assets/');
        console.log('   - icon.png (1024x1024, max quality)');
        console.log('   - adaptive-icon.png (1024x1024, max quality)');
        console.log('   - splash.png (1284x2778, max quality)');
        console.log('   - favicon.png (48x48, max quality)');

    } catch (error) {
        console.error('❌ Error converting icons:', error);
    }
}

convertIcons();
