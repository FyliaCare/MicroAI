'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Message {
  type: 'bot' | 'user'
  text: string
}

interface ProjectData {
  projectIdea?: string
  projectType?: string
  timeline?: string
  budget?: string
  name?: string
  email?: string
  phone?: string
}

interface AIProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AIProjectModal({ isOpen, onClose }: AIProjectModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: "👋 Hi! I'm MicroAI's project assistant. I'm here to help bring your idea to life - even if it's just a rough concept! Let's start simple: What kind of project are you thinking about?" }
  ])
  const [input, setInput] = useState('')
  const [step, setStep] = useState(0)
  const [projectData, setProjectData] = useState<ProjectData>({})
  const [isTyping, setIsTyping] = useState(false)
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      
      // Focus input field
      if (inputRef.current) {
        inputRef.current.focus()
      }

      // Handle ESC key to close modal
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const questions = [
    { field: 'projectIdea', question: "Great! Can you tell me more about your idea? Even just a few sentences or bullet points work perfectly. What problem are you trying to solve or what do you want to build?" },
    { field: 'projectType', question: "Awesome! 🚀 What type of solution fits best?\n\n1️⃣ Web Application\n2️⃣ SaaS Platform\n3️⃣ Website\n4️⃣ Web Tool/Utility\n5️⃣ Not sure yet\n\nJust type the number or name!" },
    { field: 'timeline', question: "Perfect! ⏱️ When would you ideally like to launch?\n\n1️⃣ ASAP (1-2 weeks)\n2️⃣ Within a month\n3️⃣ Flexible timeline\n4️⃣ Just exploring for now" },
    { field: 'budget', question: "Got it! 💰 Do you have a budget range in mind?\n\n1️⃣ Under $5k\n2️⃣ $5k - $15k\n3️⃣ $15k - $50k\n4️⃣ $50k+\n5️⃣ Need a quote first" },
    { field: 'name', question: "Excellent! Now let's set up a Teams call to discuss this in detail. 📞 What's your name?" },
    { field: 'email', question: "Nice to meet you! What's the best email to reach you?" },
    { field: 'phone', question: "And finally, what's your phone number? (Optional - just press Enter to skip)" }
  ]

  const addBotMessage = (text: string) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text }])
      setIsTyping(false)
    }, 800)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: input }])
    
    // Save the data
    const currentQuestion = questions[step]
    if (currentQuestion) {
      setProjectData(prev => ({ ...prev, [currentQuestion.field]: input }))
    }

    setInput('')

    // Move to next question or finish
    if (step < questions.length - 1) {
      setStep(step + 1)
      addBotMessage(questions[step + 1].question)
    } else {
      // All questions answered
      addBotMessage("🎉 Perfect! I have all the information. We're processing your request and will send you a Teams meeting invite shortly to your email. In the meantime, feel free to check out our portfolio!\n\nThanks for choosing MicroAI - where we build 10x faster! ⚡")
      
      // Submit the data to API
      const finalData = { ...projectData, phone: input }
      
      // Send to API endpoint
      fetch('/api/project-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('✅ Project inquiry submitted successfully:', data)
        })
        .catch(error => {
          console.error('❌ Error submitting project inquiry:', error)
        })
      
      // Close modal after delay
      setTimeout(() => {
        onClose()
        // Reset for next time
        setMessages([{ type: 'bot', text: "👋 Hi! I'm MicroAI's project assistant. I'm here to help bring your idea to life - even if it's just a rough concept! Let's start simple: What kind of project are you thinking about?" }])
        setStep(0)
        setProjectData({})
      }, 5000)
    }
  }

  if (!isOpen || !mounted) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent closing when clicking the backdrop (force user to use close button)
    e.stopPropagation()
  }

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent click events from bubbling to backdrop
    e.stopPropagation()
  }

  const modalContent = (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeInBackdrop 0.3s ease-out',
        zIndex: 999999,
      }}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/30 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-scaleIn"
        onClick={handleModalClick}
        style={{
          margin: 'auto',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">MicroAI Project Assistant</h3>
              <p className="text-sm text-blue-400">Powered by AI • 10x Faster ⚡</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-red-500/20 transition-all text-2xl w-10 h-10 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800 border border-gray-700 text-gray-100'
                } whitespace-pre-wrap`}
              >
                {message.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-500"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-700">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-6 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            💡 Even rough ideas work! We&apos;ll help you refine the details.
          </p>
        </form>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
