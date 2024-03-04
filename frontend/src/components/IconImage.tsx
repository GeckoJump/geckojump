import React from 'react'

// Provides a similar interface to react-icons that wraps an image

export interface IconImageProps {
  src: string
  alt: string
  size?: number
  className?: string
}


const IconImage = (props: IconImageProps) => {
  const { src, alt, size, className } = props

  return (
    <img src={src} alt={alt} className={className} width={size} height={size} />
  )
}

export default IconImage