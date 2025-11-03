'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { X, Minimize2, Send, Paperclip, Smile, ArrowDown } from 'lucide-react'

interface Message {
  id: string
  senderType: string
  senderName: string
  message: string
  messageType: string
  fileUrl?: string
  fileName?: string
  createdAt: string
  isRead: boolean
}

interface ChatSession {
  id: string
  status: string
  messages: Message[]
  assignedTo?: {
    id: string
    name: string
    avatar?: string
  }
}

export default function ChatWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showTypingIndicator, setShowTypingIndicator] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Poll for updates - MUST be before early return
  useEffect(() => {
    if (!session || !isOpen) return

    const pollInterval = setInterval(async () => {
      try {
        const lastMessageId = messages[messages.length - 1]?.id
        const response = await fetch(
          `/api/chat/poll?sessionId=${session.id}&lastMessageId=${lastMessageId || ''}&isAdmin=false`
        )

        const data = await response.json()
        if (data.success) {
          // Add new messages
          if (data.newMessages.length > 0) {
            setMessages((prev) => [...prev, ...data.newMessages])
            
            // Play notification sound if minimized
            if (isMinimized) {
              setUnreadCount((prev) => prev + data.newMessages.length)
            }
          }

          // Update typing indicator
          setShowTypingIndicator(data.typingIndicators.length > 0)

          // Update session status
          if (data.sessionStatus === 'closed') {
            clearInterval(pollInterval)
          }
        }
      } catch (error) {
        console.error('Error polling:', error)
      }
    }, 2000)

    return () => clearInterval(pollInterval)
  }, [session, messages, isOpen, isMinimized])

  // Mark messages as read when opened - MUST be before early return
  useEffect(() => {
    if (isOpen && !isMinimized && session) {
      setUnreadCount(0)
      
      fetch(`/api/chat/messages/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          senderType: 'admin',
        }),
      }).catch(err => console.error('Error marking messages as read:', err))
    }
  }, [isOpen, isMinimized, session])
  
  // Hide chat widget on admin and client portal pages - MUST be after all hooks
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/client')) {
    return null
  }

  // Scroll handling - MUST be defined before use
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (!messagesContainerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShowScrollButton(!isNearBottom)
  }

  // Generate or get visitor ID
  const getVisitorId = () => {
    let visitorId = localStorage.getItem('chat_visitor_id')
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('chat_visitor_id', visitorId)
    }
    return visitorId
  }

  // Get visitor info
  const getVisitorInfo = () => {
    return {
      visitorId: getVisitorId(),
      visitorDevice: navigator.userAgent,
      visitorBrowser: navigator.userAgent.split(' ').pop() || 'Unknown',
      currentPage: window.location.href,
      referrer: document.referrer || 'Direct',
    }
  }

  // Initialize chat session
  const initSession = async () => {
    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getVisitorInfo()),
      })

      const data = await response.json()
      if (data.success) {
        setSession(data.session)
        setMessages(data.session.messages)
        
        // Trigger bot welcome message for new sessions
        if (data.session.messages.length === 0) {
          setTimeout(async () => {
            try {
              const welcomeResponse = await fetch(
                `/api/chat/bot/welcome?sessionId=${data.session.id}`
              )
              const welcomeData = await welcomeResponse.json()
              if (welcomeData.success && welcomeData.message) {
                setMessages((prev) => [...prev, welcomeData.message])
                scrollToBottom()
              }
            } catch (error) {
              console.error('Error getting welcome message:', error)
            }
          }, 1500) // 1.5 second delay for natural feel
        }
      }
    } catch (error) {
      console.error('Error initializing chat:', error)
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !session) return

    const tempId = `temp_${Date.now()}`
    const tempMessage: Message = {
      id: tempId,
      senderType: 'visitor',
      senderName: 'You',
      message: inputMessage,
      messageType: 'text',
      createdAt: new Date().toISOString(),
      isRead: false,
    }

    setMessages([...messages, tempMessage])
    setInputMessage('')
    scrollToBottom()

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          senderType: 'visitor',
          senderName: 'Visitor',
          message: inputMessage,
          messageType: 'text',
        }),
      })

      const data = await response.json()
      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? data.message : msg))
        )
        
        // Trigger bot response
        setTimeout(async () => {
          try {
            const botResponse = await fetch('/api/chat/bot', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId: session.id,
                message: inputMessage,
              }),
            })
            
            const botData = await botResponse.json()
            if (botData.success && botData.message) {
              setMessages((prev) => [...prev, botData.message])
              scrollToBottom()
            }
          } catch (error) {
            console.error('Error getting bot response:', error)
          }
        }, 1000) // 1 second delay for typing effect
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Handle typing indicator
  const handleTyping = () => {
    if (!session) return

    setIsTyping(true)
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Send typing indicator
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.id,
        userType: 'visitor',
        isTyping: true,
      }),
    }).catch(err => console.error('Error sending typing indicator:', err))

    // Stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      fetch('/api/chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          userType: 'visitor',
          isTyping: false,
        }),
      }).catch(err => console.error('Error stopping typing indicator:', err))
    }, 3000)
  }

  // Upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !session) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sessionId', session.id)

      const uploadResponse = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadResponse.json()
      
      if (uploadData.success) {
        // Send file message
        const response = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.id,
            senderType: 'visitor',
            senderName: 'Visitor',
            message: `Sent a file: ${uploadData.fileName}`,
            messageType: file.type.startsWith('image/') ? 'image' : 'file',
            fileUrl: uploadData.fileUrl,
            fileName: uploadData.fileName,
            fileSize: uploadData.fileSize,
            fileType: uploadData.fileType,
          }),
        })

        const data = await response.json()
        if (data.success) {
          setMessages([...messages, data.message])
          scrollToBottom()
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploading(false)
    }
  }

  // Open chat
  const openChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
    if (!session) {
      initSession()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={openChat}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
        aria-label="Open chat"
      >
        <div className="relative">
          {/* Animated ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full animate-pulse" />
          
          {/* Main button */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transform transition-all duration-300 hover:rotate-12">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            
            {/* Notification badge */}
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce shadow-lg">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Chat with us! 💬
              <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1" />
            </div>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white rounded-3xl shadow-2xl z-50 flex flex-col transition-all duration-300 border border-gray-200 ${
        isMinimized ? 'w-80 h-16' : 'w-[calc(100vw-2rem)] sm:w-[420px] h-[calc(100vh-2rem)] sm:h-[650px] max-h-[700px]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-5 rounded-t-3xl flex items-center justify-between relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16" />
        </div>
        
        <div className="flex items-center space-x-3 relative z-10">
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30">
              {session?.assignedTo?.avatar ? (
                <img
                  src={session.assignedTo.avatar}
                  alt={session.assignedTo.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl">🤖</span>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg">
              {session?.assignedTo?.name || 'MicroAI Assistant'}
            </h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-xs font-medium opacity-90">
                {showTypingIndicator ? 'Typing...' : 'Online • Reply in minutes'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 relative z-10">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-2.5 rounded-xl transition-all hover:scale-110"
            aria-label="Minimize chat"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-2.5 rounded-xl transition-all hover:scale-110 hover:rotate-90"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {unreadCount > 0 && isMinimized && (
          <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white"
          >
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👋</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Welcome to MicroAI Support!</h3>
                <p className="text-sm text-gray-600">We typically reply within minutes</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderType === 'visitor' ? 'justify-end' : 'justify-start'
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] ${
                    msg.senderType === 'visitor'
                      ? 'order-2'
                      : 'order-1'
                  }`}
                >
                  {/* Show avatar for bot messages */}
                  {msg.senderType !== 'visitor' && msg.messageType !== 'system' && (
                    <div className="flex items-center space-x-2 mb-1 ml-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs">
                        🤖
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {msg.senderName}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={`rounded-2xl px-5 py-3 ${
                      msg.senderType === 'visitor'
                        ? 'bg-gradient-to-br from-blue-600 via-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200'
                        : msg.messageType === 'system'
                        ? 'bg-gray-100 text-gray-600 text-sm italic border border-gray-200'
                        : 'bg-white text-gray-800 shadow-md border border-gray-100'
                    }`}
                  >
                    {msg.messageType === 'image' && msg.fileUrl && (
                      <img
                        src={msg.fileUrl}
                        alt={msg.fileName}
                        className="rounded-xl mb-2 max-w-full hover:scale-105 transition-transform cursor-pointer"
                      />
                    )}
                    {msg.messageType === 'file' && msg.fileUrl && (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-1 hover:underline"
                      >
                        <Paperclip className="w-4 h-4" />
                        <span className="text-sm font-medium">{msg.fileName}</span>
                      </a>
                    )}
                    <p className="break-words leading-relaxed">{msg.message}</p>
                    <p
                      className={`text-xs mt-2 flex items-center space-x-1 ${
                        msg.senderType === 'visitor'
                          ? 'text-white/80'
                          : 'text-gray-500'
                      }`}
                    >
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.senderType === 'visitor' && (
                        <span className="ml-1">✓✓</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {showTypingIndicator && (
              <div className="flex justify-start animate-fade-in">
                <div>
                  <div className="flex items-center space-x-2 mb-1 ml-1">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs">
                      🤖
                    </div>
                    <span className="text-xs font-medium text-gray-700">Assistant</span>
                  </div>
                  <div className="bg-white rounded-2xl px-5 py-4 shadow-md border border-gray-100">
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to bottom button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-28 right-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-all duration-300 animate-bounce"
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100 rounded-b-3xl">
            {/* Quick replies - optional */}
            {messages.length === 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => {
                    setInputMessage('I need a quote for my project')
                    setTimeout(() => sendMessage(), 100)
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap transition-colors"
                >
                  💰 Get a quote
                </button>
                <button
                  onClick={() => {
                    setInputMessage('Tell me about your services')
                    setTimeout(() => sendMessage(), 100)
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap transition-colors"
                >
                  🚀 Our services
                </button>
                <button
                  onClick={() => {
                    setInputMessage('How long does a project take?')
                    setTimeout(() => sendMessage(), 100)
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 whitespace-nowrap transition-colors"
                >
                  ⏱️ Timeline
                </button>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-gray-400 hover:text-blue-600 transition-all p-2.5 hover:bg-blue-50 rounded-xl disabled:opacity-50"
                aria-label="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value)
                    handleTyping()
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all placeholder:text-gray-400"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || uploading}
                className="bg-gradient-to-br from-blue-600 via-blue-600 to-purple-600 text-white p-3 rounded-2xl hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative group"
                aria-label="Send message"
              >
                <Send className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
            
            {/* Powered by */}
            <div className="text-center mt-3">
              <p className="text-xs text-gray-400">
                Powered by <span className="font-semibold text-gray-600">MicroAI</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
