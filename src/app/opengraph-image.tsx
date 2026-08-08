import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Memou — Save and Plan Memories Together'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #8B5E3C 0%, #5C3324 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '500px',
            height: '500px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '100%',
            transform: 'translate(30%, -40%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '400px',
            height: '400px',
            background: 'rgba(0,0,0,0.08)',
            borderRadius: '100%',
            transform: 'translate(-30%, 40%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              fontStyle: 'italic',
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Memou
          </div>
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255,255,255,0.85)',
              marginTop: 24,
              fontWeight: 400,
            }}
          >
            Save and Plan Memories Together
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
