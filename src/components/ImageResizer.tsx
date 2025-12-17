'use client'

import { useState } from 'react'
import { Upload, Download, Maximize2 } from 'lucide-react'

export default function ImageResizer() {
  const [image, setImage] = useState<string | null>(null)
  const [resizedImage, setResizedImage] = useState<string | null>(null)
  const [width, setWidth] = useState<number>(800)
  const [height, setHeight] = useState<number>(600)
  const [resizing, setResizing] = useState<boolean>(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setResizedImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const resizeImage = () => {
    if (!image) return
    
    setResizing(true)
    const img = new Image()
    img.src = image
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
      
      ctx?.drawImage(img, 0, 0, width, height)
      
      const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9)
      setResizedImage(resizedDataUrl)
      setResizing(false)
    }
  }

  const handleDownload = () => {
    if (!resizedImage) return
    const link = document.createElement('a')
    link.href = resizedImage
    link.download = `resized-image-${width}x${height}.jpg`
    link.click()
  }

  const presetSizes = [
    { label: 'Instagram', w: 1080, h: 1080 },
    { label: 'Facebook', w: 1200, h: 630 },
    { label: 'Twitter', w: 1200, h: 675 },
    { label: 'HD', w: 1920, h: 1080 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-6">
        <Maximize2 className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Image Resizer</h2>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">Upload an image and resize it to custom dimensions.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="upload-resize"
            />
            <label htmlFor="upload-resize" className="cursor-pointer block">
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

          {/* Resize Controls */}
          {image && (
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl space-y-6">
              {/* Dimension Controls */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                      Width: {width}px
                    </label>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                      Height: {height}px
                    </label>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                  />
                </div>
              </div>

              {/* Preset Sizes */}
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-3 font-medium">Quick Presets</p>
                <div className="grid grid-cols-2 gap-2">
                  {presetSizes.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setWidth(preset.w)
                        setHeight(preset.h)
                      }}
                      className="py-2 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors text-sm"
                    >
                      {preset.label}
                      <div className="text-xs text-gray-500">{preset.w}×{preset.h}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={resizeImage}
                disabled={resizing}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Maximize2 className="w-5 h-5" />
                {resizing ? 'Resizing...' : `Resize to ${width}×${height}`}
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <h3 className=" flex justify-center text-lg font-semibold text-gray-800 dark:text-white">Preview</h3>
          
          <div className="space-y-6">
            {image && (
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                <p className="text-gray-600 dark:text-gray-400 mb-3 font-medium">Original Image</p>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt="Original" 
                    className="w-full h-auto max-h-64 object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            {resizedImage && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Resized Image</p>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                    {width}×{height}
                  </span>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={resizedImage} 
                    alt="Resized" 
                    className="w-full h-auto max-h-64 object-contain mx-auto"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Resized Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}