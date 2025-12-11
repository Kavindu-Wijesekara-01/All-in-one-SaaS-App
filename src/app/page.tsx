'use client'

import { useState } from 'react'
import QRGenerator from '../components/QRGenerator'
import ImageCompressor from '../components/ImageCompressor'
import ImageCropper from '../components/ImageCropper'
import ImageResizer from '../components/ImageResizer'
import BlackWhiteConverter from '../components/BlackWhiteConverter'

type ToolType = 'qr' | 'compressor' | 'cropper' | 'resizer' | 'converter'

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolType>('qr')

  const renderTool = () => {
    switch (activeTool) {
      case 'qr':
        return <QRGenerator />
      case 'compressor':
        return <ImageCompressor />
      case 'cropper':
        return <ImageCropper />
      case 'resizer':
        return <ImageResizer />
      case 'converter':
        return <BlackWhiteConverter />
      default:
        return <QRGenerator />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            All In One Studio.
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Free online tools for image editing and QR code generation
          </p>
        </div>
        
        {/* Tool Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTool === 'qr'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTool('qr')}
          >
            QR Generator
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTool === 'compressor'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTool('compressor')}
          >
            Image Compressor
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTool === 'cropper'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTool('cropper')}
          >
            Image Cropper
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTool === 'resizer'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTool('resizer')}
          >
            Image Resizer
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTool === 'converter'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTool('converter')}
          >
            B&W Converter
          </button>
        </div>

        {/* Active Tool Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 min-h-[500px]">
          {renderTool()}
        </div>

        {/* Footer Section */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AI Studio Pro. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Developed By Kavindu Wijesekara.
          </p>
        </footer>
      </main>
    </div>
  )
}