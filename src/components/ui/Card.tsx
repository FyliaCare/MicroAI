interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false 
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-300' : ''
  
  return (
    <div className={`bg-white rounded-lg shadow ${paddingClasses[padding]} ${hoverClass} ${className}`}>
      {children}
    </div>
  )
}