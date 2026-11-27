/**
 * Client-Side Image Compressor using HTML5 Canvas.
 * Automatically scales down large camera/phone photos to max 1920px
 * and compresses to high-quality JPEG (quality: 0.82).
 * Reduces 5MB-15MB photos to ~200KB-400KB, preventing HTTP 413 & 502 errors.
 */

export interface ImageCompressionOptions {
  maxDimension?: number;
  quality?: number;
  outputFormat?: 'image/jpeg' | 'image/webp';
}

export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> {
  const {
    maxDimension = 1920,
    quality = 0.82,
    outputFormat = 'image/jpeg'
  } = options;

  // Only compress images; if PDF or SVG, return original
  if (!file.type || !file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  // If already under 250KB and already JPEG/WebP, keep as is
  if (file.size < 250 * 1024 && (file.type === 'image/jpeg' || file.type === 'image/webp')) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // fallback
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Generate clean name with proper extension
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const ext = outputFormat === 'image/webp' ? '.webp' : '.jpg';
            const compressedFile = new File([blob], `${baseName}${ext}`, {
              type: outputFormat,
              lastModified: Date.now(),
            });

            // If compressed file is somehow larger than original, return original
            if (compressedFile.size >= file.size) {
              resolve(file);
            } else {
              resolve(compressedFile);
            }
          },
          outputFormat,
          quality
        );
      };

      img.onerror = () => {
        resolve(file); // fallback on load error
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        resolve(file);
      }
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}

export async function compressImages(
  files: File[],
  options: ImageCompressionOptions = {}
): Promise<File[]> {
  if (!files || files.length === 0) return [];
  return Promise.all(files.map((f) => compressImage(f, options)));
}
