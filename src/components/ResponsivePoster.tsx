'use client'

import { useState } from 'react'

interface ResponsivePosterProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  showOverlay?: boolean
  overlayContent?: React.ReactNode
}

export default function ResponsivePoster({ 
  src, 
  alt, 
  className = '', 
  containerClassName = '',
  showOverlay = false,
  overlayContent
}: ResponsivePosterProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    const ratio = img.naturalWidth / img.naturalHeight
    setAspectRatio(ratio)
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const getImageClasses = () => {
    if (!aspectRatio) return 'w-full h-auto object-contain min-h-[200px]'
    
    // Determine the best object-fit based on aspect ratio
    if (aspectRatio > 2.5) {
      // Very wide images (banners, wide posters)
      return 'w-full h-[200px] md:h-[220px] object-cover'
    } else if (aspectRatio > 1.5) {
      // Landscape images (most common poster format)
      return 'w-full h-[220px] md:h-[240px] object-cover'
    } else if (aspectRatio > 0.8) {
      // Square-ish images
      return 'w-full h-auto max-h-[280px] object-contain bg-white'
    } else {
      // Portrait images (tall posters)
      return 'w-full h-[280px] md:h-[320px] object-cover'
    }
  }

  const getContainerClasses = () => {
    const baseClasses = 'relative w-full overflow-hidden'
    
    if (!aspectRatio) {
      return `${baseClasses} bg-gray-100 min-h-[200px]`
    }
    
    if (aspectRatio > 2.5) {
      return `${baseClasses} h-[200px] md:h-[220px] bg-gray-100`
    } else if (aspectRatio > 1.5) {
      return `${baseClasses} h-[220px] md:h-[240px] bg-gray-100`
    } else if (aspectRatio > 0.8) {
      return `${baseClasses} bg-gray-50`
    } else {
      return `${baseClasses} h-[280px] md:h-[320px] bg-gray-100`
    }
  }

  if (imageError) {
    return null
  }

  return (
    <div className={`${getContainerClasses()} ${containerClassName}`}>
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Main image */}
      <img
        src={src}
        alt={alt}
        className={`${getImageClasses()} ${className} transition-transform duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ 
          display: imageLoaded ? 'block' : 'none',
          objectPosition: 'center'
        }}
      />
      
      {/* Overlay */}
      {showOverlay && imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      )}
      
      {/* Overlay content */}
      {overlayContent && imageLoaded && (
        <div className="absolute inset-0 pointer-events-none">
          {overlayContent}
        </div>
      )}
    </div>
  )
}
