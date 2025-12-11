'use client'

import { ArrowRight, Sparkles, Image, QrCode, FileText } from 'lucide-react'
import { useState } from 'react'

export default function HeroSection() {
  const [activeFeature, setActiveFeature] = useState(0)
  
  const features = [
    {
      icon: Image,
      title: 'Remove Backgrounds',
      description: 'Instantly remove background from any image'
    },
    {
      icon: QrCode,
      title: 'Generate QR Codes',
      description: 'Create custom QR codes in seconds'
    },
    {
      icon: FileText,
      title: 'Write Letters',
      description: 'AI-powered letter writing assistant'
    }
  ]

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 mb-4">
        <Sparkles size={16} />
        <span className="ml-2 text-sm font-medium">
          AI-Powered Tools
        </span>
      </div>
      
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        All-in-One AI Studio
      </h1>
      
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Free tools for image editing, QR generation, and AI writing
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <a
          href="#background"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          Start Using Tools
          <ArrowRight className="ml-2" size={20} />
        </a>
        <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
          Learn More
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border-2 transition-all cursor-pointer
              ${activeFeature === index 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'}`}
            onMouseEnter={() => setActiveFeature(index)}
            onClick={() => {
              const element = document.getElementById(['background', 'qr', 'letter'][index])
              element?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <feature.icon className={`h-12 w-12 mx-auto mb-4
              ${activeFeature === index ? 'text-blue-600' : 'text-gray-400'}`} />
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}