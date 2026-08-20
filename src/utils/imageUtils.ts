/**
 * Image processing and compression utilities for HeritageLens AI
 */

export interface ProcessedImageResult {
  dataUrl: string;
  file?: File;
  originalSize: number; // bytes
  compressedSize: number; // bytes
  width: number;
  height: number;
  format: string;
}

export interface ImageValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export type ImageValidationErrorType = 'UNSUPPORTED_TYPE' | 'FILE_TOO_LARGE' | 'EMPTY_SELECTION' | 'CORRUPT_FILE';

export interface ImageValidationResult {
  isValid: boolean;
  errorType?: ImageValidationErrorType;
  error?: string;
  errorHi?: string;
  actionHint?: string;
  actionHintHi?: string;
  fileDetails?: {
    name?: string;
    sizeMB?: number;
    type?: string;
  };
}

export const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif'
];

export const MAX_FILE_SIZE_MB = 15; // Max allowed upload before compression

/**
 * Validates a file's MIME type and size with clear error classification and action recommendations
 */
export function validateImageFile(
  file: File,
  options?: ImageValidationOptions
): ImageValidationResult {
  if (!file) {
    return {
      isValid: false,
      errorType: 'EMPTY_SELECTION',
      error: 'No image selected. Please choose a photograph to identify.',
      errorHi: 'कोई छवि चयनित नहीं है। कृपया पहचान के लिए एक फोटो चुनें।',
      actionHint: 'Click "Upload Image" or "Use Camera" to provide a monument photo.',
      actionHintHi: 'स्मारक की तस्वीर देने के लिए "फोटो अपलोड" या "कैमरा" पर क्लिक करें।',
    };
  }

  const allowed = options?.allowedTypes || DEFAULT_ALLOWED_TYPES;
  const maxSize = (options?.maxSizeMB || MAX_FILE_SIZE_MB) * 1024 * 1024;
  const sizeInMB = parseFloat((file.size / (1024 * 1024)).toFixed(1));
  const fileExt = file.name ? file.name.split('.').pop()?.toUpperCase() : 'UNKNOWN';

  // Check file type
  const isTypeValid =
    allowed.includes(file.type.toLowerCase()) ||
    file.type.startsWith('image/');

  if (!isTypeValid) {
    return {
      isValid: false,
      errorType: 'UNSUPPORTED_TYPE',
      error: `Unsupported file format (${fileExt || file.type || 'unknown'}).`,
      errorHi: `असमर्थित फ़ाइल प्रारूप (${fileExt || file.type || 'अज्ञात'})।`,
      actionHint: 'Please choose a standard image file in JPG, JPEG, PNG, or WebP format.',
      actionHintHi: 'कृपया JPG, PNG, या WebP प्रारूप में एक मान्य छवि फ़ाइल चुनें।',
      fileDetails: {
        name: file.name,
        sizeMB: sizeInMB,
        type: file.type || 'unknown'
      }
    };
  }

  // Check file size limit
  if (file.size > maxSize) {
    return {
      isValid: false,
      errorType: 'FILE_TOO_LARGE',
      error: `File is too large (${sizeInMB} MB). Maximum upload size is ${options?.maxSizeMB || MAX_FILE_SIZE_MB} MB.`,
      errorHi: `फ़ाइल बहुत बड़ी है (${sizeInMB} MB)। अधिकतम सीमा ${options?.maxSizeMB || MAX_FILE_SIZE_MB} MB है।`,
      actionHint: 'Please select a photo smaller than 15 MB or take a new photo with your camera.',
      actionHintHi: 'कृपया 15 MB से छोटी फोटो चुनें या अपने कैमरे से नई तस्वीर लें।',
      fileDetails: {
        name: file.name,
        sizeMB: sizeInMB,
        type: file.type
      }
    };
  }

  return { isValid: true };
}

/**
 * Resizes and compresses an image (File, Blob, or DataURL) client-side in Canvas
 * @param source File, Blob, or string DataURL
 * @param maxWidth Max output width (default: 1600px for high clarity monument recognition)
 * @param maxHeight Max output height (default: 1600px)
 * @param quality JPEG output quality (0.0 to 1.0, default 0.85)
 */
export async function compressAndResizeImage(
  source: File | Blob | string,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.85
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const originalSize = typeof source === 'string' 
      ? Math.round((source.length * 3) / 4) 
      : source.size;

    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;

      // Calculate scaled dimensions while preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as WebP if supported, otherwise JPEG
      const outputFormat = 'image/jpeg';
      const dataUrl = canvas.toDataURL(outputFormat, quality);
      const compressedSize = Math.round((dataUrl.length * 3) / 4);

      resolve({
        dataUrl,
        originalSize,
        compressedSize,
        width,
        height,
        format: outputFormat
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to decode image file. The file may be corrupt or an unsupported format.'));
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file from disk'));
      reader.readAsDataURL(source);
    }
  });
}
