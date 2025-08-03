'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [showVideo, setShowVideo] = useState(false)
  const [error, setError] = useState(false)
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false)
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0)

  // Try multiple thumbnail qualities
  const thumbnailUrls = [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/0.jpg`
  ]
  
  const thumbnailUrl = thumbnailUrls[currentThumbnailIndex]

  const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Try the next thumbnail quality if available
    if (currentThumbnailIndex < thumbnailUrls.length - 1) {
      setCurrentThumbnailIndex(currentThumbnailIndex + 1)
    } else {
      // If all thumbnails fail, show a placeholder
      e.currentTarget.src = `https://placehold.co/480x360/1a103a/ffffff?text=YouTube+Video:+${videoId}`
      setThumbnailLoaded(true)
    }
  }
  
  const handleThumbnailLoad = () => {
    setThumbnailLoaded(true)
  }

  const handlePlay = () => {
    setShowVideo(true)
  }

  const handleError = () => {
    setError(true)
  }

  return (
    <div className="my-4">
      {title && (
        <div className="flex items-center mb-2">
          <div className="bg-red-600 text-white rounded-full p-1 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </div>
          <h4 className="text-md font-medium text-gray-200">{title}</h4>
        </div>
      )}
      
      <div className="relative rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
        {!showVideo ? (
          <div 
            className="relative cursor-pointer group"
            onClick={handlePlay}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handlePlay()
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Play video: ${title || 'YouTube video'}`}
          >
            <img 
              src={thumbnailUrl} 
              alt={title || 'YouTube video thumbnail'} 
              className="w-full h-auto"
              onError={handleThumbnailError}
              onLoad={handleThumbnailLoad}
              style={{ minHeight: '180px' }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            {error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gray-800">
                <p className="text-gray-300 mb-2">Unable to load video</p>
                <a 
                  href={`https://www.youtube.com/watch?v=${videoId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Watch on YouTube
                </a>
              </div>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                title={title || "YouTube video player"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                onError={handleError}
              />
            )}
          </div>
        )}
      </div>
      
      <div className="mt-1 text-sm text-gray-400 flex justify-between">
        <span>{title || 'YouTube video'}</span>
        <a 
          href={`https://www.youtube.com/watch?v=${videoId}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  )
}