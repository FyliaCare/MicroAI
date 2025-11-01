'use client'

interface CTAButtonProps {
  className?: string
  children: React.ReactNode
}

export default function CTAButton({ className, children }: CTAButtonProps) {
  const handleClick = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    setTimeout(() => {
      const chatButton = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement
      if (chatButton) {
        chatButton.click()
      }
    }, 500)
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
