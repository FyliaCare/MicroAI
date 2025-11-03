'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Send, Paperclip, X, Check, CheckCheck, User, MapPin, Globe, Clock, Star, Tag } from 'lucide-react'

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
  readAt?: string
}

interface ChatSession {
  id: string
  visitorId?: string
  visitorName?: string
  visitorEmail?: string
  visitorPhone?: string
  visitorIp?: string
  visitorDevice?: string
  visitorBrowser?: string
  visitorLocation?: string
  currentPage?: string
  referrer?: string
  status: string
  assignedToId?: string
  rating?: number
  feedback?: string
  tags?: string
  startedAt: string
  closedAt?: string
  lastMessageAt: string
  messages: Message[]
  unreadCount: number
  _count: {
    messages: number
  }
  assignedTo?: {
    id: string
    name: string
    avatar?: string
  }
}

export default function AdminChatPage() {
  const { data: session } = useSession()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('active')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showVisitorInfo, setShowVisitorInfo] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/chat/sessions?status=${filterStatus}`)
      const data = await response.json()
      
      if (data.success) {
        setSessions(data.sessions)
        
        // Update active session if it's in the list
        if (activeSession) {
          const updatedSession = data.sessions.find((s: ChatSession) => s.id === activeSession.id)
          if (updatedSession) {
            setActiveSession(updatedSession)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch messages for active session
  const fetchMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}&limit=100`)
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.messages)
        scrollToBottom()
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !activeSession || !session?.user) return

    const tempId = `temp_${Date.now()}`
    const tempMessage: Message = {
      id: tempId,
      senderType: 'admin',
      senderName: session.user.name || 'Admin',
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
          sessionId: activeSession.id,
          senderType: 'admin',
          senderId: session.user.id,
          senderName: session.user.name || 'Admin',
          message: inputMessage,
          messageType: 'text',
        }),
      })

      const data = await response.json()
      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? data.message : msg))
        )
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Handle typing indicator
  const handleTyping = () => {
    if (!activeSession) return

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    fetch('/api/chat/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: activeSession.id,
        userType: 'admin',
        isTyping: true,
      }),
    }).catch(err => console.error('Error sending typing indicator:', err))

    typingTimeoutRef.current = setTimeout(() => {
      fetch('/api/chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSession.id,
          userType: 'admin',
          isTyping: false,
        }),
      }).catch(err => console.error('Error stopping typing indicator:', err))
    }, 3000)
  }

  // Upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !activeSession || !session?.user) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sessionId', activeSession.id)

      const uploadResponse = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadResponse.json()
      
      if (uploadData.success) {
        const response = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: activeSession.id,
            senderType: 'admin',
            senderId: session.user.id,
            senderName: session.user.name || 'Admin',
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

  // Assign session to self
  const assignToSelf = async () => {
    if (!activeSession || !session?.user) return

    try {
      const response = await fetch(`/api/chat/sessions/${activeSession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedToId: session.user.id,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setActiveSession(data.session)
        fetchSessions()
      }
    } catch (error) {
      console.error('Error assigning session:', error)
    }
  }

  // Close session
  const closeSession = async () => {
    if (!activeSession) return

    try {
      const response = await fetch(`/api/chat/sessions/${activeSession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'closed',
        }),
      })

      const data = await response.json()
      if (data.success) {
        setActiveSession(null)
        fetchSessions()
      }
    } catch (error) {
      console.error('Error closing session:', error)
    }
  }

  // Select session
  const selectSession = (session: ChatSession) => {
    setActiveSession(session)
    fetchMessages(session.id)
    
    // Mark messages as read
    fetch(`/api/chat/messages/mark-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.id,
        senderType: 'visitor',
      }),
    }).catch(err => console.error('Error marking messages as read:', err))
  }

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Poll for updates
  useEffect(() => {
    fetchSessions().catch(err => console.error('Session fetch error:', err))
    const interval = setInterval(() => {
      fetchSessions().catch(err => console.error('Session fetch error:', err))
    }, 5000)
    return () => clearInterval(interval)
  }, [filterStatus])

  // Poll for new messages in active session
  useEffect(() => {
    if (!activeSession) return

    const pollInterval = setInterval(async () => {
      try {
        const lastMessageId = messages[messages.length - 1]?.id
        const response = await fetch(
          `/api/chat/poll?sessionId=${activeSession.id}&lastMessageId=${lastMessageId || ''}&isAdmin=true`
        )

        const data = await response.json()
        if (data.success && data.newMessages.length > 0) {
          setMessages((prev) => [...prev, ...data.newMessages])
          scrollToBottom()
        }
      } catch (error) {
        console.error('Error polling:', error)
      }
    }, 2000)

    return () => clearInterval(pollInterval)
  }, [activeSession, messages])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex bg-[#f0f2f5] md:bg-gray-50" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Sessions List - WhatsApp Style */}
      <div className={`${activeSession ? 'hidden md:flex' : 'flex'} w-full md:w-96 bg-white md:border-r flex-col`}>
        {/* WhatsApp Header */}
        <div className="bg-[#00a884] p-4 md:p-3">
          <h2 className="text-xl md:text-lg font-semibold text-white mb-3 md:mb-2">Chats</h2>
          <div className="flex space-x-1">
            <button
              onClick={() => setFilterStatus('active')}
              className={`flex-1 px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                filterStatus === 'active'
                  ? 'bg-white text-[#00a884]'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white text-[#00a884]'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('closed')}
              className={`flex-1 px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                filterStatus === 'closed'
                  ? 'bg-white text-[#00a884]'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Closed
            </button>
          </div>
        </div>

        {/* Chat List - WhatsApp Style */}
        <div className="flex-1 overflow-y-auto bg-white">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <svg className="w-20 h-20 mx-auto mb-3 opacity-30" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" />
              </svg>
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => selectSession(session)}
                className={`w-full px-4 py-3 border-b border-gray-100 text-left hover:bg-[#f5f6f6] transition-colors ${
                  activeSession?.id === session.id ? 'bg-[#f0f2f5]' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 md:w-11 md:h-11 rounded-full bg-[#00a884] flex items-center justify-center text-white font-medium text-lg">
                      {session.visitorName?.[0]?.toUpperCase() || '?'}
                    </div>
                    {session.status === 'active' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">
                        {session.visitorName || 'Visitor'}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {new Date(session.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {session.messages && session.messages.length > 0 && session.messages[session.messages.length - 1]?.senderType === 'admin' && (
                          <CheckCheck className="w-3 h-3 inline mr-1 text-blue-500" />
                        )}
                        {session.messages && session.messages.length > 0 ? session.messages[session.messages.length - 1]?.message : 'No messages'}
                      </p>
                      {session.unreadCount > 0 && (
                        <span className="ml-2 bg-[#00a884] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium flex-shrink-0">
                          {session.unreadCount > 9 ? '9+' : session.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area - WhatsApp Style */}
      {activeSession ? (
        <div className="flex-1 flex flex-col w-full">
          {/* WhatsApp Header */}
          <div className="bg-[#f0f2f5] border-b border-gray-200 px-4 py-2 md:py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* Back Button (Mobile) */}
              <button
                onClick={() => setActiveSession(null)}
                className="md:hidden p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Avatar & Info */}
              <div className="w-10 h-10 md:w-9 md:h-9 rounded-full bg-[#00a884] flex items-center justify-center text-white font-medium flex-shrink-0">
                {activeSession.visitorName?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">
                  {activeSession.visitorName || 'Visitor'}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {activeSession.status === 'active' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-1 md:space-x-2">
              {!activeSession.assignedToId && (
                <button
                  onClick={assignToSelf}
                  className="hidden md:flex px-3 py-1.5 bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] transition-colors text-xs font-medium"
                >
                  Assign
                </button>
              )}
              {activeSession.status === 'active' && (
                <button
                  onClick={closeSession}
                  className="hidden md:flex px-3 py-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xs font-medium"
                >
                  Close
                </button>
              )}
              <button
                onClick={() => setShowVisitorInfo(!showVisitorInfo)}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Messages - WhatsApp Style */}
            <div className="flex-1 flex flex-col">
              {/* WhatsApp Pattern Background */}
              <div 
                className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23e5ddd5\'/%3E%3Cpath d=\'M20 10h60M20 30h60M20 50h60M20 70h60M20 90h60\' stroke=\'%23d1c4b8\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/svg%3E")',
                  backgroundColor: '#e5ddd5'
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderType === 'admin' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* WhatsApp Message Bubble */}
                    <div
                      className={`relative max-w-[85%] md:max-w-[70%] rounded-lg px-3 py-2 ${
                        msg.senderType === 'admin'
                          ? 'bg-[#d9fdd3] text-gray-900'
                          : msg.messageType === 'system'
                          ? 'bg-[#fff4ce] text-gray-700 text-xs text-center'
                          : 'bg-white text-gray-900 shadow-sm'
                      }`}
                      style={{
                        borderRadius: msg.senderType === 'admin' 
                          ? '7.5px 7.5px 0px 7.5px' 
                          : '7.5px 7.5px 7.5px 0px'
                      }}
                    >
                      {/* Message Content */}
                      {msg.messageType === 'image' && msg.fileUrl && (
                        <img
                          src={msg.fileUrl}
                          alt={msg.fileName}
                          className="rounded-md mb-1 max-w-full"
                        />
                      )}
                      {msg.messageType === 'file' && msg.fileUrl && (
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-1 p-2 bg-gray-50 rounded"
                        >
                          <Paperclip className="w-4 h-4" />
                          <span className="text-sm">{msg.fileName}</span>
                        </a>
                      )}
                      <p className="text-sm break-words mb-1">{msg.message}</p>
                      
                      {/* Time & Status */}
                      <div className={`flex items-center justify-end space-x-1 ${
                        msg.senderType === 'admin' ? 'text-gray-500' : 'text-gray-400'
                      } text-xs`}>
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.senderType === 'admin' && (
                          msg.isRead ? (
                            <CheckCheck className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Check className="w-4 h-4 text-gray-400" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* WhatsApp Input Bar */}
              <div className="p-2 md:p-3 bg-[#f0f2f5] border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  />
                  
                  {/* Attachment Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-gray-500 hover:text-[#00a884] transition-colors p-2 hover:bg-white rounded-full flex-shrink-0"
                  >
                    <Paperclip className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  
                  {/* Input Field */}
                  <div className="flex-1 bg-white rounded-full px-4 py-2.5 md:py-3 flex items-center">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => {
                        setInputMessage(e.target.value)
                        handleTyping()
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message"
                      className="flex-1 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base"
                      disabled={uploading || activeSession.status === 'closed'}
                    />
                  </div>
                  
                  {/* Send Button */}
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || uploading || activeSession.status === 'closed'}
                    className="bg-[#00a884] text-white p-3 rounded-full hover:bg-[#008f6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md"
                  >
                    <Send className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Visitor Info Panel - WhatsApp Style */}
            {showVisitorInfo && (
              <div className="hidden md:block w-80 bg-white border-l p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Visitor Info</h3>
                  <button
                    onClick={() => setShowVisitorInfo(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {activeSession.visitorName && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Name</label>
                      <p className="text-sm font-medium">{activeSession.visitorName}</p>
                    </div>
                  )}

                  {activeSession.visitorEmail && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Email</label>
                      <p className="text-sm font-medium">{activeSession.visitorEmail}</p>
                    </div>
                  )}

                  {activeSession.visitorPhone && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Phone</label>
                      <p className="text-sm font-medium">{activeSession.visitorPhone}</p>
                    </div>
                  )}

                  {activeSession.visitorLocation && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <label className="text-xs text-gray-500 uppercase">Location</label>
                        <p className="text-sm font-medium">{activeSession.visitorLocation}</p>
                      </div>
                    </div>
                  )}

                  {activeSession.currentPage && (
                    <div className="flex items-start space-x-2">
                      <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <label className="text-xs text-gray-500 uppercase">Current Page</label>
                        <p className="text-sm font-medium break-words">{activeSession.currentPage}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Started At</label>
                      <p className="text-sm font-medium">
                        {new Date(activeSession.startedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {activeSession.rating && (
                    <div className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <div>
                        <label className="text-xs text-gray-500 uppercase">Rating</label>
                        <p className="text-sm font-medium">{activeSession.rating}/5</p>
                      </div>
                    </div>
                  )}

                  {activeSession.feedback && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Feedback</label>
                      <p className="text-sm font-medium">{activeSession.feedback}</p>
                    </div>
                  )}

                  {activeSession.visitorDevice && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase">Device Info</label>
                      <p className="text-xs text-gray-600 break-words">{activeSession.visitorDevice}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-lg font-medium">Select a chat to start</p>
            <p className="text-sm mt-2">Choose a conversation from the list</p>
          </div>
        </div>
      )}
    </div>
  )
}
