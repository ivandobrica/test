/**
 * Extract the reel/post ID from an Instagram URL.
 * Supports formats like:
 * - https://www.instagram.com/reel/ABC123/
 * - https://www.instagram.com/p/ABC123/
 * - https://instagram.com/reel/ABC123/?igsh=...
 */
export function extractReelId(url) {
  try {
    const parsed = new URL(url)
    const pathParts = parsed.pathname.split('/').filter(Boolean)
    // Expect: ['reel' or 'p', 'ID'] or ['username', 'reel', 'ID']
    const reelIndex = pathParts.findIndex(p => p === 'reel' || p === 'p')
    if (reelIndex !== -1 && pathParts[reelIndex + 1]) {
      return pathParts[reelIndex + 1]
    }
    return null
  } catch {
    return null
  }
}

/**
 * Validate that a URL is a valid Instagram reel/post link.
 */
export function isValidInstagramUrl(url) {
  try {
    const parsed = new URL(url)
    return (
      (parsed.hostname === 'www.instagram.com' || parsed.hostname === 'instagram.com') &&
      (parsed.pathname.includes('/reel/') || parsed.pathname.includes('/p/'))
    )
  } catch {
    return false
  }
}

/**
 * Generate a thumbnail URL for an Instagram reel using screenshot services.
 * Uses thum.io which is free, no-auth, and returns images directly via URL.
 * The URL can be used as an <img> src directly.
 */
export function generateThumbnailUrl(url) {
  if (!url) return null
  // thum.io: free screenshot service, no API key needed.
  // Width 480 is good for card thumbnails.
  const encoded = encodeURIComponent(url)
  return `https://image.thum.io/get/width/480/crop/850/${encoded}`
}

/**
 * Alternative screenshot services (fallbacks).
 */
export function getThumbnailFallbacks(url) {
  if (!url) return []
  const encoded = encodeURIComponent(url)
  return [
    `https://image.thum.io/get/width/480/crop/850/${encoded}`,
    `https://api.microlink.io/?url=${encoded}&screenshot=true&meta=false&embed=screenshot.url`,
  ]
}
