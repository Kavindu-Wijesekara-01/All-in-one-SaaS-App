'use client'

import { useState } from 'react'
import { Upload, Download, Crop } from 'lucide-react'

export default function ImageCropper() {
  const [image, setImage] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [cropping, setCropping] = useState<boolean>(false)

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

  const cropImage = () => {
    if (!image) return
    
    setCropping(true)
    const img = new Image()
    img.src = image
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Set canvas size to 400x400 for cropped image
      canvas.width = 400
      canvas.height = 400
      
      // Calculate cropping dimensions (center crop)
      const size = Math.min(img.width, img.height)
      const sx = (img.width - size) / 2
      const sy = (img.height - size) / 2
      
      ctx?.drawImage(img, sx, sy, size, size, 0, 0, 400, 400)
      
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9)
      setCroppedImage(croppedDataUrl)
      setCropping(false)
    }
  }

  const handleDownload = () => {
    if (!croppedImage) return
    const link = document.createElement('a')
    link.href = croppedImage
    link.download = 'cropped-image.jpg'
    link.click()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-6">
        <Crop className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Image Cropper</h2>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">Upload an image and crop it to a perfect square (center crop).</p>
      
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

          {/* Crop Button */}
          {image && (
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl">
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Crop Settings</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This will create a 400x400 square crop from the center of your image.
                </p>
              </div>
              
              <button
                onClick={cropImage}
                disabled={cropping}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Crop className="w-5 h-5" />
                {cropping ? 'Cropping...' : 'Crop Image (400x400)'}
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Preview</h3>
          
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

            {croppedImage && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Cropped Image</p>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                    400×400
                  </span>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={croppedImage} 
                    alt="Cropped" 
                    className="w-full h-auto max-h-64 object-contain mx-auto"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Cropped Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}