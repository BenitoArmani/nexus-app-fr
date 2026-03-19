export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  uploadPreset: 'nexus_uploads',
}

export async function uploadMedia(
  file: File,
  folder: 'posts' | 'reels' | 'avatars' | 'stories' | 'messages'
): Promise<{ url: string; publicId: string; type: 'image' | 'video' }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset)
  formData.append('folder', `nexus/${folder}`)

  const resourceType = file.type.startsWith('video') ? 'video' : 'image'

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) throw new Error('Upload failed')

  const data = await res.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
    type: resourceType,
  }
}

export function getVideoThumbnail(videoUrl: string): string {
  return videoUrl.replace('/upload/', '/upload/so_0,w_400,h_711,c_fill/').replace('.mp4', '.jpg')
}
