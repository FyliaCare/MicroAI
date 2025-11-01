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
      {/* Official MicroAI Systems Logo */}
      <img 
        src="/MICROAI SYSTEMS OFFICIAL LOGO.png" 
        alt="MicroAI Systems" 
        style={{ height: `${height}px`, width: 'auto' }}
        className="object-contain"
      />
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
