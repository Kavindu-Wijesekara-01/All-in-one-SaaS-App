'use client'

import { useState, useEffect, useRef } from 'react'
import { Download, Copy, QrCode } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function QRGenerator() {
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(256)
  const [qrCode, setQrCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const debounceTimer = useRef<NodeJS.Timeout>()

  // Generate QR code
  const generateQR = () => {
    if (!text.trim()) {
      toast.error('Please enter text or URL')
      return
    }

    setIsGenerating(true)
    
    const encodedText = encodeURIComponent(text)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&format=png`
    
    setQrCode(qrUrl)
    
    // Show success toast
    setTimeout(() => {
      setIsGenerating(false)
      // toast.success('QR Code generated successfully!')
    }, 300)
  }

  // Debounced generation on size change
  useEffect(() => {
    if (text.trim() && qrCode) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        generateQR()
      }, 500)
    }
    
    return () => clearTimeout(debounceTimer.current)
  }, [size])

  // Initialize on mount
  useEffect(() => {
    generateQR()
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    toast.success('Text copied to clipboard')
  }

  const downloadQR = () => {
    if (!qrCode) {
      toast.error('Generate a QR code first')
      return
    }

    const link = document.createElement('a')
    link.href = qrCode
    link.download = `qr-code-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('QR Code downloaded!')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-4">
        <QrCode className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">QR Code Generator</h2>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-4">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text or URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Enter text or URL for QR code"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Copy className="w-4 h-4 text-white"/>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Size: {size}px
              </label>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button
              onClick={generateQR}
              disabled={isGenerating}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  Generate QR Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-4">
          <h3 className="flex justify-center text-lg font-medium text-gray-800 dark:text-white">QR Code Preview</h3>
          
          <div className="flex flex-col items-center justify-center">
            {/* QR Code Display */}
            <div className="mb-4">
              {isGenerating ? (
                <div className="w-64 h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="w-64 h-64 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              )}
            </div>

            <button
              onClick={downloadQR}
              disabled={isGenerating || !qrCode}
              className="py-3 px-6 bg-gray-800 dark:bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}