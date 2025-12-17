'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import QRGenerator from '@/components/QRGenerator'
import ImageCompressor from '@/components/ImageCompressor'
import ImageCropper from '@/components/ImageCropper'
import ImageResizer from '@/components/ImageResizer'
import BlackWhiteConverter from '@/components/BlackWhiteConverter'

type ToolType = 'qr' | 'compressor' | 'cropper' | 'resizer' | 'converter' | 'ai-analyzer'

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolType>('qr')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tools = [
    { id: 'qr' as ToolType, name: 'QR Generator' },
    { id: 'compressor' as ToolType, name: 'Image Compressor' },
    { id: 'cropper' as ToolType, name: 'Image Cropper' },
    { id: 'resizer' as ToolType, name: 'Image Resizer' },
    { id: 'converter' as ToolType, name: 'B&W Converter' },
  ]

  const handleToolChange = (tool: ToolType) => {
    setActiveTool(tool)
    setMobileMenuOpen(false)
  }

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

  const getActiveToolName = () => {
    return tools.find(tool => tool.id === activeTool)?.name || 'Select Tool'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            All In One Studio.
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Free online tools for image editing, QR code generation & AI analysis
          </p>
        </div>
        
        {/* Tool Navigation - Desktop */}
        <div className="hidden lg:flex flex-wrap justify-center gap-4 mb-8">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTool === tool.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleToolChange(tool.id)}
            >
              {tool.name}
            </button>
          ))}
        </div>

        {/* Tool Navigation - Mobile/Tablet */}
        <div className="lg:hidden mb-8">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-4 rounded-lg font-semibold flex items-center justify-between shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span>{getActiveToolName()}</span>
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-fadeIn">
              {tools.map((tool, index) => (
                <button
                  key={tool.id}
                  className={`w-full px-6 py-4 text-left font-medium transition-colors ${
                    activeTool === tool.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${index !== tools.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                  onClick={() => handleToolChange(tool.id)}
                >
                  {tool.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Tool Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 min-h-[500px]">
          {renderTool()}
        </div>

        {/* Footer Section */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} All In One Studio. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Developed By Kavindu Wijesekara.
          </p>
        </footer>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}