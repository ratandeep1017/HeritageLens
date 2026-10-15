/**
 * Utility to upload images to Cloudinary via the backend /api/upload endpoint.
 */
export async function uploadImageToCloudinary(
  base64OrUrl: string,
  customId?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64OrUrl,
        customId,
      }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.url) {
      return { success: true, url: data.url };
    }

    return {
      success: false,
      error: data.error || 'Failed to upload image to Cloudinary.',
    };
  } catch (err: any) {
    console.error('Error uploading image to Cloudinary:', err);
    return {
      success: false,
      error: err.message || 'Network error while uploading image.',
    };
  }
}
