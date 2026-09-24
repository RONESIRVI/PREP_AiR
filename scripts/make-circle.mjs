import sharp from 'sharp';
import path from 'path';

async function makeCircle() {
  const inputPath = path.resolve('public', 'ranker-logo.jpg');
  const outputPath = path.resolve('public', 'icon.png');
  const size = 512;

  try {
    // Resize image to square first
    const resizedImageBuffer = await sharp(inputPath)
      .resize(size, size, { fit: 'cover' })
      .toBuffer();

    // Create a circular SVG mask
    const circleSvg = `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" /></svg>`;

    // Apply the mask and save as transparent PNG
    await sharp(resizedImageBuffer)
      .composite([{
        input: Buffer.from(circleSvg),
        blend: 'dest-in'
      }])
      .png()
      .toFile(outputPath);

    console.log('Successfully created circular icon at:', outputPath);
  } catch (error) {
    console.error('Error creating circular icon:', error);
  }
}

makeCircle();
