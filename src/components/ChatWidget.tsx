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
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50 group"
        aria-label="Open chat"
      >
        <svg
          className="w-6 h-6"
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
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          💬
        </span>
      </button>
    )
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            {session?.assignedTo?.avatar ? (
              <img
                src={session.assignedTo.avatar}
                alt={session.assignedTo.name}
                className="w-full h-full rounded-full"
              />
            ) : (
              <span className="text-lg">💬</span>
            )}
          </div>
          <div>
            <h3 className="font-semibold">
              {session?.assignedTo?.name || 'MicroAI Support'}
            </h3>
            <p className="text-xs opacity-75">
              {showTypingIndicator ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            aria-label="Minimize chat"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {unreadCount > 0 && isMinimized && (
          <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderType === 'visitor' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.senderType === 'visitor'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : msg.messageType === 'system'
                      ? 'bg-gray-200 text-gray-600 text-sm italic'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  {msg.messageType === 'image' && msg.fileUrl && (
                    <img
                      src={msg.fileUrl}
                      alt={msg.fileName}
                      className="rounded-lg mb-2 max-w-full"
                    />
                  )}
                  {msg.messageType === 'file' && msg.fileUrl && (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-1"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span className="text-sm">{msg.fileName}</span>
                    </a>
                  )}
                  <p className="break-words">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.senderType === 'visitor'
                        ? 'text-white/70'
                        : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {showTypingIndicator && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
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
              className="absolute bottom-24 right-8 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t">
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
                className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value)
                  handleTyping()
                }}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-900"
                disabled={uploading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || uploading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
