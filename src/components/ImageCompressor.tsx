'use client'

import { useState } from 'react'
import { Upload, Download, Minimize2 } from 'lucide-react'

export default function ImageCompressor() {
  const [image, setImage] = useState<string | null>(null)
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [quality, setQuality] = useState<number>(80)
  const [compressing, setCompressing] = useState<boolean>(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setCompressedImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const compressImage = () => {
    if (!image) return
    
    setCompressing(true)
    const img = new Image()
    img.src = image
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      
      ctx?.drawImage(img, 0, 0)
      
      // Convert to compressed data URL
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100)
      setCompressedImage(compressedDataUrl)
      setCompressing(false)
    }
  }

  const handleDownload = () => {
    if (!compressedImage) return
    const link = document.createElement('a')
    link.href = compressedImage
    link.download = 'compressed-image.jpg'
    link.click()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-6">
        <Minimize2 className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Image Compressor</h2>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">Upload an image and compress it to reduce file size while maintaining quality.</p>
      
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
              id="upload-compress"
            />
            <label htmlFor="upload-compress" className="cursor-pointer block">
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

          {/* Compression Controls */}
          {image && (
            <div className="space-y-6 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-gray-700 dark:text-gray-300 font-medium">
                    Compression Quality
                  </label>
                  <span className="font-bold text-blue-600">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Small file</span>
                  <span>Best quality</span>
                </div>
              </div>

              <button
                onClick={compressImage}
                disabled={compressing}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Minimize2 className="w-5 h-5" />
                {compressing ? 'Compressing...' : 'Compress Image'}
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <h3 className="flex justify-center text-lg font-semibold text-gray-800 dark:text-white">Preview</h3>
          
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

            {compressedImage && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Compressed Image</p>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                    {quality}% quality
                  </span>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={compressedImage} 
                    alt="Compressed" 
                    className="w-full h-auto max-h-64 object-contain mx-auto"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Compressed Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}