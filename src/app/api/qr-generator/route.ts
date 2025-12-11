import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(request: Request) {
  try {
    const { text, size = 200 } = await request.json()
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(text, {
      width: size,
      margin: 2,
    })
    
    return NextResponse.json({
      success: true,
      qrCode,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}