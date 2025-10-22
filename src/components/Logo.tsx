import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  className?: string
  linkTo?: string
  height?: number
  width?: number
}

export default function Logo({ className = '', linkTo = '/', height = 40, width = 160 }: LogoProps) {
  const logoContent = (
    <div className={`relative ${className}`}>
      <Image 
        src="/mailogo.png" 
        alt="MicroAI Logo" 
        width={width}
        height={height}
        className="object-contain"
        priority
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
