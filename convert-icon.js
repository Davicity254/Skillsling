const sharp = require('sharp');
const fs = require('fs');

async function convertIcons() {
    try {
        const svgBuffer = fs.readFileSync('./assets/icon.svg');

        // Create icon.png (1024x1024)
        await sharp(svgBuffer)
            .resize(1024, 1024)
            .png()
            .toFile('./assets/icon.png');
        console.log('✓ Created icon.png (1024x1024)');

        // Create adaptive-icon.png (1024x1024)
        await sharp(svgBuffer)
            .resize(1024, 1024)
            .png()
            .toFile('./assets/adaptive-icon.png');
        console.log('✓ Created adaptive-icon.png (1024x1024)');

        // Create splash.png (1284x2778) - centered on orange background
        await sharp({
            create: {
                width: 1284,
                height: 2778,
                channels: 4,
                background: { r: 255, g: 107, b: 53, alpha: 1 } // #FF6B35
            }
        })
            .composite([{
                input: await sharp(svgBuffer).resize(800, 800).png().toBuffer(),
                top: Math.floor((2778 - 800) / 2),
                left: Math.floor((1284 - 800) / 2)
            }])
            .png()
            .toFile('./assets/splash.png');
        console.log('✓ Created splash.png (1284x2778)');

        // Create favicon.png (48x48)
        await sharp(svgBuffer)
            .resize(48, 48)
            .png()
            .toFile('./assets/favicon.png');
        console.log('✓ Created favicon.png (48x48)');

        console.log('\n✅ All icons created successfully!');
        console.log('📁 Files created in ./assets/');
        console.log('   - icon.png');
        console.log('   - adaptive-icon.png');
        console.log('   - splash.png');
        console.log('   - favicon.png');

    } catch (error) {
        console.error('❌ Error converting icons:', error);
    }
}

convertIcons();
