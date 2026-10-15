import { v2 as cloudinary } from 'cloudinary';

let isConfigured = false;

export function initCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudinaryUrl = process.env.CLOUDINARY_URL;

  if (cloudinaryUrl) {
    cloudinary.config({ cloudinary_url: cloudinaryUrl });
    isConfigured = true;
    console.log('✅ [Cloudinary] Configured via CLOUDINARY_URL.');
    return true;
  }

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    isConfigured = true;
    console.log(`✅ [Cloudinary] Configured for cloud: ${cloudName}.`);
    return true;
  }

  console.warn('⚠️ [Cloudinary] Credentials not set. Uploads will fallback or fail.');
  return false;
}

export function isCloudinaryReady() {
  return isConfigured;
}

/**
 * Upload a base64 or remote URL image to Cloudinary in the "heritagelens" folder.
 * @param {string} fileStr Base64 data URL or external URL
 * @param {string} customId Optional custom public ID
 */
export async function uploadToCloudinary(fileStr, customId = null) {
  if (!isConfigured) {
    throw new Error('Cloudinary is not configured on this server. Please provide CLOUDINARY credentials.');
  }

  const options = {
    folder: 'heritagelens',
    resource_type: 'image',
    transformation: [
      { quality: 'auto:eco', fetch_format: 'auto' }
    ]
  };

  if (customId) {
    options.public_id = customId.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  }

  const result = await cloudinary.uploader.upload(fileStr, options);
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}
