import Link from 'next/link'

interface LogoProps {
  className?: string
  linkTo?: string
  height?: number
  width?: number
}

export default function Logo({ className = '', linkTo = '/', height = 40, width = 160 }: LogoProps) {
  const logoContent = (
    <div className={`relative ${className} flex items-center gap-2`}>
      {/* Micro AI Icon */}
      <svg 
        width={height} 
        height={height} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="animate-float"
      >
        {/* Outer Circle with Gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="logoGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Background Circle */}
        <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" opacity="0.2"/>
        
        {/* AI Chip Design */}
        <rect x="10" y="10" width="20" height="20" rx="2" fill="url(#logoGradient)" opacity="0.3"/>
        
        {/* Circuit Lines */}
        <path d="M20 8 L20 12" stroke="url(#logoGradient2)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 28 L20 32" stroke="url(#logoGradient2)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 20 L12 20" stroke="url(#logoGradient2)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M28 20 L32 20" stroke="url(#logoGradient2)" strokeWidth="2" strokeLinecap="round"/>
        
        {/* Central AI Symbol */}
        <circle cx="20" cy="20" r="6" fill="url(#logoGradient)"/>
        <circle cx="20" cy="20" r="3" fill="white"/>
        
        {/* Corner Nodes */}
        <circle cx="14" cy="14" r="1.5" fill="url(#logoGradient2)"/>
        <circle cx="26" cy="14" r="1.5" fill="url(#logoGradient2)"/>
        <circle cx="14" cy="26" r="1.5" fill="url(#logoGradient2)"/>
        <circle cx="26" cy="26" r="1.5" fill="url(#logoGradient2)"/>
      </svg>

      {/* Text Logo */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Micro
          </span>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI
          </span>
        </div>
        <span className="text-[10px] text-gray-400 tracking-wider uppercase -mt-1">
          10x Faster Development
        </span>
      </div>
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
