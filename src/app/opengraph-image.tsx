import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MicroAI Systems - 10x Faster Web Development'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #000000 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Gradient circles */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
            padding: '60px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '2px solid rgba(59, 130, 246, 0.5)',
              borderRadius: '50px',
              padding: '12px 32px',
              marginBottom: '40px',
              display: 'flex',
            }}
          >
            <span
              style={{
                color: '#60a5fa',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              ⚡ 10x Faster Development Technology
            </span>
          </div>

          {/* Main heading */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '30px',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                margin: '0',
                lineHeight: '1.1',
              }}
            >
              MicroAI Systems
            </h1>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '32px',
              color: '#9ca3af',
              margin: '0',
              maxWidth: '900px',
              lineHeight: '1.4',
            }}
          >
            Revolutionary development delivering enterprise-grade web applications, SaaS platforms, and websites in 1/10th the time
          </p>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '60px',
              marginTop: '50px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '48px', fontWeight: '900', color: '#3b82f6' }}>1-2 Weeks</span>
              <span style={{ fontSize: '20px', color: '#6b7280' }}>Web Applications</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '48px', fontWeight: '900', color: '#a855f7' }}>2-3 Weeks</span>
              <span style={{ fontSize: '20px', color: '#6b7280' }}>SaaS Platforms</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '48px', fontWeight: '900', color: '#ec4899' }}>3-5 Days</span>
              <span style={{ fontSize: '20px', color: '#6b7280' }}>Websites</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
