import Link from 'next/link'

interface LogoProps {
  className?: string
  linkTo?: string
  height?: number
  width?: number
}

export default function Logo({ className = '', linkTo = '/', height = 40, width = 160 }: LogoProps) {
  const logoContent = (
    <div className={`relative ${className} flex items-center`}>
      {/* High-Visibility Logo with SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Icon - Stylized Circuit/AI Symbol */}
        <g transform="translate(0, 5)">
          <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" opacity="0.2" />
          <circle cx="20" cy="20" r="12" fill="url(#logoGradient)" opacity="0.3" />
          <circle cx="20" cy="20" r="6" fill="url(#logoGradient)" />
          <path
            d="M20 8 L20 14 M20 26 L20 32 M8 20 L14 20 M26 20 L32 20"
            stroke="url(#logoGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="20" cy="8" r="2" fill="#3B82F6" />
          <circle cx="20" cy="32" r="2" fill="#EC4899" />
          <circle cx="8" cy="20" r="2" fill="#8B5CF6" />
          <circle cx="32" cy="20" r="2" fill="#3B82F6" />
        </g>
        
        {/* Text - MICROAI */}
        <text
          x="45"
          y="28"
          fill="white"
          fontSize="20"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.5"
        >
          MICROAI
        </text>
        
        {/* Text - SYSTEMS (smaller) */}
        <text
          x="45"
          y="40"
          fill="#94A3B8"
          fontSize="10"
          fontWeight="600"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="2"
        >
          SYSTEMS
        </text>
      </svg>
    </div>
  )

  if (linkTo) {
    return (
      <Link href={linkTo} className="cursor-pointer hover:opacity-90 transition-opacity">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
