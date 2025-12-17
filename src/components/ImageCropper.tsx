'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, Download, Crop, RotateCcw } from 'lucide-react'

export default function ImageCropper() {
  const [image, setImage] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [cropping, setCropping] = useState<boolean>(false)
  const [cropMode, setCropMode] = useState<'center' | 'manual'>('manual')
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg'>('png')
  
  // Manual crop state
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 200, height: 200 })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const canvasRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setCroppedImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (image && imageRef.current) {
      const img = imageRef.current
      const updateSize = () => {
        const rect = img.getBoundingClientRect()
        setImageSize({ width: rect.width, height: rect.height })
        // Reset crop area to center when image loads
        const size = Math.min(rect.width, rect.height) * 0.6
        setCropArea({
          x: (rect.width - size) / 2,
          y: (rect.height - size) / 2,
          width: size,
          height: size
        })
      }
      
      if (img.complete) {
        updateSize()
      } else {
        img.onload = updateSize
      }
      
      window.addEventListener('resize', updateSize)
      return () => window.removeEventListener('resize', updateSize)
    }
  }, [image])

  const handleMouseDown = (e: React.MouseEvent, handle?: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (handle) {
      setIsResizing(true)
      setResizeHandle(handle)
    } else {
      setIsDragging(true)
    }
    
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && !isResizing) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    if (isDragging) {
      setCropArea(prev => ({
        ...prev,
        x: Math.max(0, Math.min(imageSize.width - prev.width, prev.x + deltaX)),
        y: Math.max(0, Math.min(imageSize.height - prev.height, prev.y + deltaY))
      }))
    } else if (isResizing && resizeHandle) {
      setCropArea(prev => {
        let newArea = { ...prev }
        
        switch (resizeHandle) {
          case 'nw':
            newArea.width = Math.max(50, prev.width - deltaX)
            newArea.height = Math.max(50, prev.height - deltaY)
            newArea.x = Math.max(0, prev.x + deltaX)
            newArea.y = Math.max(0, prev.y + deltaY)
            break
          case 'ne':
            newArea.width = Math.max(50, prev.width + deltaX)
            newArea.height = Math.max(50, prev.height - deltaY)
            newArea.y = Math.max(0, prev.y + deltaY)
            break
          case 'sw':
            newArea.width = Math.max(50, prev.width - deltaX)
            newArea.height = Math.max(50, prev.height + deltaY)
            newArea.x = Math.max(0, prev.x + deltaX)
            break
          case 'se':
            newArea.width = Math.max(50, prev.width + deltaX)
            newArea.height = Math.max(50, prev.height + deltaY)
            break
        }
        
        // Keep within bounds
        if (newArea.x + newArea.width > imageSize.width) {
          newArea.width = imageSize.width - newArea.x
        }
        if (newArea.y + newArea.height > imageSize.height) {
          newArea.height = imageSize.height - newArea.y
        }
        
        return newArea
      })
    }
    
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  const cropImage = () => {
    if (!image || !imageRef.current) return
    
    setCropping(true)
    const img = new Image()
    img.src = image
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        setCropping(false)
        return
      }
      
      // Enable high quality image smoothing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      if (cropMode === 'center') {
        // Center crop logic - maintain original resolution
        const size = Math.min(img.width, img.height)
        canvas.width = size
        canvas.height = size
        
        const sx = (img.width - size) / 2
        const sy = (img.height - size) / 2
        
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size)
      } else {
        // Manual crop logic - maintain full original resolution
        const imgElement = imageRef.current!
        const scaleX = img.width / imgElement.width
        const scaleY = img.height / imgElement.height
        
        // Calculate crop dimensions in original image resolution
        const sourceX = cropArea.x * scaleX
        const sourceY = cropArea.y * scaleY
        const sourceWidth = cropArea.width * scaleX
        const sourceHeight = cropArea.height * scaleY
        
        // Set canvas to actual crop size (full resolution)
        canvas.width = sourceWidth
        canvas.height = sourceHeight
        
        // Draw the cropped portion at full resolution
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, sourceWidth, sourceHeight
        )
      }
      
      // Export at 100% quality
      let croppedDataUrl: string
      if (outputFormat === 'png') {
        // PNG is lossless - perfect quality
        croppedDataUrl = canvas.toDataURL('image/png')
      } else {
        // JPEG at 100% quality (1.0 = 100%)
        croppedDataUrl = canvas.toDataURL('image/jpeg', 1.0)
      }
      
      setCroppedImage(croppedDataUrl)
      setCropping(false)
    }
  }

  const handleDownload = () => {
    if (!croppedImage) return
    const link = document.createElement('a')
    link.href = croppedImage
    link.download = `cropped-image.${outputFormat}`
    link.click()
  }

  const resetCrop = () => {
    if (imageSize.width && imageSize.height) {
      const size = Math.min(imageSize.width, imageSize.height) * 0.6
      setCropArea({
        x: (imageSize.width - size) / 2,
        y: (imageSize.height - size) / 2,
        width: size,
        height: size
      })
    }
  }

  return (
    <div className="max-w-9xl py-4 sm:py-6">
      <div className="flex items-center gap-2 mb-4">
        <Crop className="w-7 h-7 text-blue-600" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">High Quality Image Cropper</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-4">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 sm:p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="upload-crop"
            />
            <label htmlFor="upload-crop" className="cursor-pointer block">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">Click to upload image</p>
                  <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, WebP</p>
                </div>
              </div>
            </label>
          </div>

          {/* Settings */}
          {image && (
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-2 rounded-lg space-y-5">
              {/* Crop Mode */}
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 text-base sm:text-sm">Crop Mode</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCropMode('manual')}
                    className={`py-3 sm:py-2 px-4 rounded-lg text-base sm:text-sm font-medium transition-colors ${
                      cropMode === 'manual'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Manual
                  </button>
                  
                </div>
              </div>

              {/* Output Format */}
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 text-base sm:text-sm">Output Format</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOutputFormat('png')}
                    className={`py-3 sm:py-2 px-4 rounded-lg text-base sm:text-sm font-medium transition-colors ${
                      outputFormat === 'png'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    PNG (100%)
                  </button>
                  <button
                    onClick={() => setOutputFormat('jpeg')}
                    className={`py-3 sm:py-2 px-4 rounded-lg text-base sm:text-sm font-medium transition-colors ${
                      outputFormat === 'jpeg'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    JPEG (Lossless)
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {outputFormat === 'png' 
                    ? 'Perfect quality, larger file size' 
                    : 'Maximum JPEG quality, smaller file size'}
                </p>
              </div>
              
              {cropMode === 'manual' && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Drag the crop area to position it, or drag the corners to resize.
                  </p>
                  <button
                    onClick={resetCrop}
                    className="w-full py-3 sm:py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-base sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Crop Area
                  </button>
                </div>
              )}
              
              {cropMode === 'center' && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This will create a square crop from the center of your image at full resolution.
                </p>
              )}
              
              <button
                onClick={cropImage}
                disabled={cropping}
                className="w-full py-4 sm:py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-base sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Crop className="w-5 h-5" />
                {cropping ? 'Processing...' : 'Crop Image (100% Quality)'}
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white text-center px-3 sm:px-0">Preview</h3>
          
          <div className="space-y-4">
            {image && (
              <div className="bg-gray-50 dark:bg-gray-900/50 py-3 px-0 sm:p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium text-sm px-3 sm:px-0">Original Image</p>
                <div 
                  ref={canvasRef}
                  className="relative rounded-lg overflow-hidden"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img 
                    ref={imageRef}
                    src={image} 
                    alt="Original" 
                    className="w-full h-auto max-h-96 object-contain mx-auto select-none"
                    draggable={false}
                  />
                  
                  {/* Manual crop overlay */}
                  {cropMode === 'manual' && imageSize.width > 0 && (
                    <>
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none" />
                      
                      {/* Crop area */}
                      <div
                        className="absolute border-2 border-white shadow-lg cursor-move"
                        style={{
                          left: `${cropArea.x}px`,
                          top: `${cropArea.y}px`,
                          width: `${cropArea.width}px`,
                          height: `${cropArea.height}px`,
                          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                        }}
                        onMouseDown={(e) => handleMouseDown(e)}
                      >
                        {/* Resize handles */}
                        {['nw', 'ne', 'sw', 'se'].map(handle => (
                          <div
                            key={handle}
                            className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer hover:scale-125 transition-transform"
                            style={{
                              [handle.includes('n') ? 'top' : 'bottom']: '-8px',
                              [handle.includes('w') ? 'left' : 'right']: '-8px',
                              cursor: `${handle}-resize`
                            }}
                            onMouseDown={(e) => handleMouseDown(e, handle)}
                          />
                        ))}
                        
                        {/* Grid lines */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white opacity-50" />
                          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white opacity-50" />
                          <div className="absolute top-1/3 left-0 right-0 h-px bg-white opacity-50" />
                          <div className="absolute top-2/3 left-0 right-0 h-px bg-white opacity-50" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {cropMode === 'manual' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center px-3 sm:px-0">
                    Crop size: {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px (display) | Full resolution will be maintained
                  </p>
                )}
              </div>
            )}

            {croppedImage && (
              <div className="bg-green-50 dark:bg-green-900/20 py-3 px-0 sm:p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2 px-3 sm:px-0">
                  <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">Cropped Image</p>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                    100% Quality
                  </span>
                </div>
                <div className="rounded-lg overflow-hidden mb-3">
                  <img 
                    src={croppedImage} 
                    alt="Cropped" 
                    className="w-full h-auto max-h-64 object-contain mx-auto"
                  />
                </div>
                <div className="px-3 sm:px-0">
                  <button
                    onClick={handleDownload}
                    className="w-full py-4 sm:py-3 px-4 bg-green-600 hover:bg-green-700 text-white text-base sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download ({outputFormat.toUpperCase()})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}