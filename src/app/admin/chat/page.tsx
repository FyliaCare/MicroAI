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
    })

    typingTimeoutRef.current = setTimeout(() => {
      fetch('/api/chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSession.id,
          userType: 'admin',
          isTyping: false,
        }),
      })
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
    })
  }

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Poll for updates
  useEffect(() => {
    fetchSessions()
    const interval = setInterval(fetchSessions, 5000)
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
    <div className="h-screen flex bg-gray-50">
      {/* Sessions List */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-3">Live Chat</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterStatus('active')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('closed')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'closed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Closed
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No chat sessions
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => selectSession(session)}
                className={`w-full p-4 border-b text-left hover:bg-gray-50 transition-colors ${
                  activeSession?.id === session.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {session.visitorName?.[0] || 'V'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {session.visitorName || 'Anonymous Visitor'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session._count.messages} messages
                      </p>
                    </div>
                  </div>
                  {session.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {session.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {session.messages[0]?.message || 'No messages yet'}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    session.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {session.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(session.lastMessageAt).toLocaleTimeString()}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeSession ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {activeSession.visitorName?.[0] || 'V'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {activeSession.visitorName || 'Anonymous Visitor'}
                </h3>
                <p className="text-sm text-gray-500">
                  {activeSession.visitorEmail || 'No email provided'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!activeSession.assignedToId && (
                <button
                  onClick={assignToSelf}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Assign to Me
                </button>
              )}
              {activeSession.status === 'active' && (
                <button
                  onClick={closeSession}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Close Chat
                </button>
              )}
              <button
                onClick={() => setShowVisitorInfo(!showVisitorInfo)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Messages */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderType === 'admin' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.senderType === 'admin'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : msg.messageType === 'system'
                          ? 'bg-gray-200 text-gray-600 text-sm italic'
                          : 'bg-white shadow-sm'
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
                      <div className={`flex items-center space-x-2 mt-1 ${
                        msg.senderType === 'admin' ? 'text-white/70' : 'text-gray-400'
                      } text-xs`}>
                        <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                        {msg.senderType === 'admin' && (
                          msg.isRead ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-900 placeholder-gray-400"
                    disabled={uploading || activeSession.status === 'closed'}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || uploading || activeSession.status === 'closed'}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Visitor Info Panel */}
            {showVisitorInfo && (
              <div className="w-80 bg-white border-l p-4 overflow-y-auto">
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
