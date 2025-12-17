'use client'

import { useState } from 'react'
import { Upload, Download, Moon } from 'lucide-react'

export default function BlackWhiteConverter() {
  const [image, setImage] = useState<string | null>(null)
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const [converting, setConverting] = useState<boolean>(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setConvertedImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const convertToBlackAndWhite = () => {
    if (!image) return
    
    setConverting(true)
    const img = new Image()
    img.src = image
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      
      ctx?.drawImage(img, 0, 0)
      
      // Convert to grayscale
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
      if (imageData) {
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          data[i] = avg     // red
          data[i + 1] = avg // green
          data[i + 2] = avg // blue
        }
        ctx?.putImageData(imageData, 0, 0)
      }
      
      const convertedDataUrl = canvas.toDataURL('image/jpeg', 0.9)
      setConvertedImage(convertedDataUrl)
      setConverting(false)
    }
  }

  const handleDownload = () => {
    if (!convertedImage) return
    const link = document.createElement('a')
    link.href = convertedImage
    link.download = 'black-white-image.jpg'
    link.click()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-6">
        <Moon className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Black & White Converter</h2>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">Upload an image and convert it to classic black & white.</p>
      
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
              id="upload-convert"
            />
            <label htmlFor="upload-convert" className="cursor-pointer block">
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

          {/* Convert Button */}
          {image && (
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl">
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Convert to Grayscale</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This will convert your image to classic black & white by averaging RGB values.
                </p>
              </div>
              
              <button
                onClick={convertToBlackAndWhite}
                disabled={converting}
                className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Moon className="w-5 h-5" />
                {converting ? 'Converting...' : 'Convert to Black & White'}
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

            {convertedImage && (
              <div className="bg-gray-800/10 dark:bg-gray-900 p-4 rounded-xl border border-gray-300 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Black & White</p>
                  <span className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium">
                    Grayscale
                  </span>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={convertedImage} 
                    alt="Black & White" 
                    className="w-full h-auto max-h-64 object-contain mx-auto"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download B&W Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}