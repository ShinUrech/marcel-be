/* eslint-disable prettier/prettier */
import * as path from 'path';
import * as pc from 'picocolors';

const MIN_WIDTH = 1000;
const MIN_HEIGHT = 700;

// Dynamic import for Sharp to handle Windows compatibility issues
async function getSharp() {
  try {
    // @ts-expect-error - Sharp may not be available
    const sharp = await import('sharp');
    return sharp.default;
  } catch {
    console.warn(pc.yellow('Sharp module not available. Image enhancement will be skipped.'));
    return null;
  }
}

export async function enhanceImage(filename) {
  const localPath = path.resolve(path.join(process.cwd(), 'public', filename));
  try {
    const sharp = await getSharp();
    if (!sharp) {
      console.log(pc.yellow(`-->> Sharp unavailable. Returning original image: ${filename}`));
      return filename;
    }

    const metadata = await sharp(localPath).metadata();
    console.log(`-->> Image Width ${metadata.width} | Width ${metadata.height} `);
    if (metadata.width <= 400) {
      console.log(pc.yellow(`-->> Processing Image Enhancing ...`));
      const outputName = `en-${filename}`;

      const outputPath = path.resolve(path.join(process.cwd(), 'public', outputName));
      await sharp(localPath)
        .resize({
          width: Math.round(metadata.width * 1.5), // Resize width by 1.5 times
          height: Math.round(metadata.height * 1.5), // Resize height by 1.5 times
          fit: 'cover', // Resize with the 'cover' option to maintain aspect ratio
        }) // Increase resolution (2x upscale)
        .sharpen()
        .jpeg({ quality: 100 })
        .toFile(outputPath);

      console.log(pc.greenBright(`-->> Enhanced image Saved as: ${outputPath}`));
      return outputName;
    } else {
      return filename;
    }
  } catch (error) {
    console.error('Error enhancing image:', error);
    return filename;
  }
}

export const largeImages = (images) => {
  return images.filter((img) => img.width >= MIN_WIDTH && img.height >= MIN_HEIGHT);
};

export function isLargeImg(dimensions) {
  return dimensions.width >= MIN_WIDTH && dimensions.height >= MIN_HEIGHT;
}
