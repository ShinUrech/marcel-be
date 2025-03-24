/* eslint-disable prettier/prettier */
import * as path from 'path';
import * as sharp from 'sharp';
import * as pc from 'picocolors';

export async function enhanceImage(filename) {
  const localPath = path.resolve(path.join(process.cwd(), 'public', filename));
  try {
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
