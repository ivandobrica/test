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
 * Generate a thumbnail URL for an Instagram reel.
 * Returns the thum.io screenshot URL as a fallback placeholder.
 */
export function generateThumbnailUrl(url) {
  if (!url) return null
  const encoded = encodeURIComponent(url)
  return `https://image.thum.io/get/width/480/crop/850/${encoded}`
}

/**
 * Try to fetch the actual Instagram thumbnail via noembed.com (CORS-friendly oEmbed proxy).
 * Returns a promise that resolves to the thumbnail URL or null.
 */
export async function fetchInstagramThumbnail(url) {
  // Try noembed.com - a free CORS-friendly oEmbed aggregator
  try {
    const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
    if (response.ok) {
      const data = await response.json()
      if (data.thumbnail_url) return data.thumbnail_url
    }
  } catch {
    // noembed failed
  }

  // Try iframe.ly as another CORS-friendly option
  try {
    const response = await fetch(`https://open.iframe.ly/api/oembed?url=${encodeURIComponent(url)}`)
    if (response.ok) {
      const data = await response.json()
      if (data.thumbnail_url) return data.thumbnail_url
    }
  } catch {
    // iframely failed
  }

  return null
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
