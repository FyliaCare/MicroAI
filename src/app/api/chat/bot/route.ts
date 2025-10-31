import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// AI Chatbot responses for engaging visitors
const botResponses = {
  welcome: [
    "Hi there! 👋 Welcome to MicroAI Systems! I'm here to help you bring your project ideas to life. We build web applications 10x faster than traditional development. What kind of project are you working on?",
    "Hello! 🚀 Thanks for visiting MicroAI Systems. We specialize in rapid web development - custom apps in 1-2 weeks, websites in 3-5 days. How can we help you today?",
    "Welcome! 💡 I'm the MicroAI assistant. We're experts in Next.js, TypeScript, and building production-ready applications at lightning speed. What brings you here today?"
  ],
  askName: [
    "Great! Before we dive in, what should I call you? 😊",
    "Awesome! May I know your name so we can chat properly?",
    "Perfect! What's your name?"
  ],
  askEmail: [
    "Thanks {name}! Could you share your email so we can send you a detailed quote and keep in touch?",
    "Nice to meet you, {name}! What's the best email to reach you at?",
    "{name}, that sounds exciting! Mind sharing your email so we can follow up with more details?"
  ],
  askProject: [
    "Tell me more about your project - what are you looking to build?",
    "What kind of web application or website do you have in mind?",
    "I'd love to hear more! What's your project about?"
  ],
  askBudget: [
    "Thanks for sharing! Do you have a budget range in mind for this project?",
    "That sounds great! What's your estimated budget?",
    "Excellent! Have you thought about your budget for this?"
  ],
  askTimeline: [
    "Perfect! When would you ideally like this project completed?",
    "Great! What's your target timeline?",
    "When do you need this ready by?"
  ],
  handoff: [
    "Thank you so much, {name}! I've captured all your details. One of our specialists will review your project and get back to you within 24 hours with a custom quote. Anything else I can help with right now?",
    "Awesome, {name}! We've got everything we need. Expect to hear from us within 24 hours with a personalized proposal. Any questions in the meantime?",
    "Perfect, {name}! Your project inquiry has been logged. Our team will reach out within one business day with next steps. Is there anything else you'd like to know?"
  ],
  fallback: [
    "That's interesting! Could you tell me a bit more?",
    "I see! Can you elaborate on that?",
    "Got it! Anything else you'd like to share?"
  ]
}

function getRandomResponse(category: keyof typeof botResponses, replacements?: Record<string, string>) {
  const responses = botResponses[category]
  let response = responses[Math.floor(Math.random() * responses.length)]
  
  if (replacements) {
    Object.entries(replacements).forEach(([key, value]) => {
      response = response.replace(`{${key}}`, value)
    })
  }
  
  return response
}

// Analyze message and determine bot state
function analyzeMessage(message: string, currentState: string): { nextState: string, response: string, data?: any } {
  const lowerMessage = message.toLowerCase()
  
  // Check for name patterns
  const namePatterns = [
    /my name is (\w+)/i,
    /i'm (\w+)/i,
    /i am (\w+)/i,
    /call me (\w+)/i,
    /(\w+) here/i
  ]
  
  // Check for email patterns
  const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
  
  // Check for phone patterns
  const phonePattern = /(\+?\d{1,4}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/
  
  // State machine logic
  switch (currentState) {
    case 'INITIAL':
      // Look for project intent
      if (lowerMessage.includes('website') || lowerMessage.includes('app') || 
          lowerMessage.includes('platform') || lowerMessage.includes('system') ||
          lowerMessage.includes('build') || lowerMessage.includes('develop')) {
        return {
          nextState: 'COLLECT_NAME',
          response: getRandomResponse('askName')
        }
      }
      return {
        nextState: 'COLLECT_PROJECT',
        response: getRandomResponse('askProject')
      }
    
    case 'COLLECT_PROJECT':
      // Move to name collection
      return {
        nextState: 'COLLECT_NAME',
        response: getRandomResponse('askName'),
        data: { projectDescription: message }
      }
    
    case 'COLLECT_NAME':
      let name = ''
      for (const pattern of namePatterns) {
        const match = message.match(pattern)
        if (match) {
          name = match[1]
          break
        }
      }
      
      if (!name && message.split(' ').length <= 3) {
        name = message.trim()
      }
      
      if (name) {
        return {
          nextState: 'COLLECT_EMAIL',
          response: getRandomResponse('askEmail', { name }),
          data: { name }
        }
      }
      return {
        nextState: 'COLLECT_NAME',
        response: "I didn't quite catch your name. Could you tell me again?"
      }
    
    case 'COLLECT_EMAIL':
      const emailMatch = message.match(emailPattern)
      if (emailMatch) {
        return {
          nextState: 'COLLECT_PROJECT_DETAILS',
          response: getRandomResponse('askProject'),
          data: { email: emailMatch[1] }
        }
      }
      return {
        nextState: 'COLLECT_EMAIL',
        response: "I need a valid email address to send you the quote. Could you share that?"
      }
    
    case 'COLLECT_PROJECT_DETAILS':
      return {
        nextState: 'COLLECT_BUDGET',
        response: getRandomResponse('askBudget'),
        data: { projectDetails: message }
      }
    
    case 'COLLECT_BUDGET':
      return {
        nextState: 'COLLECT_TIMELINE',
        response: getRandomResponse('askTimeline'),
        data: { budget: message }
      }
    
    case 'COLLECT_TIMELINE':
      const sessionData = { timeline: message }
      return {
        nextState: 'COMPLETE',
        response: getRandomResponse('handoff', { name: 'there' }),
        data: sessionData
      }
    
    default:
      return {
        nextState: currentState,
        response: getRandomResponse('fallback')
      }
  }
}

// POST /api/chat/bot - Handle bot conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, message } = body

    if (!sessionId || !message) {
      return NextResponse.json(
        { success: false, error: 'sessionId and message required' },
        { status: 400 }
      )
    }

    // Get session to retrieve bot state
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    // Parse metadata
    let metadata: any = {}
    try {
      metadata = session.metadata ? JSON.parse(session.metadata) : {}
    } catch (e) {
      metadata = {}
    }

    const currentState = metadata.botState || 'INITIAL'
    const collectedData = metadata.collectedData || {}

    // Analyze message and get bot response
    const result = analyzeMessage(message, currentState)

    // Update collected data
    const updatedData = { ...collectedData, ...result.data }

    // Update session metadata
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        metadata: JSON.stringify({
          botState: result.nextState,
          collectedData: updatedData,
          lastBotResponse: Date.now()
        }),
        visitorName: updatedData.name || session.visitorName,
        visitorEmail: updatedData.email || session.visitorEmail,
      },
    })

    // If conversation is complete, create project request
    if (result.nextState === 'COMPLETE' && updatedData.email) {
      try {
        await prisma.projectRequest.create({
          data: {
            requestNumber: `REQ-${Date.now()}`,
            clientName: updatedData.name || 'Anonymous',
            clientEmail: updatedData.email,
            projectName: 'Live Chat Inquiry',
            projectType: 'web',
            description: updatedData.projectDetails || updatedData.projectDescription || message,
            requirements: updatedData.projectDetails || updatedData.projectDescription || message,
            budgetRange: updatedData.budget || 'Not specified',
            timeline: updatedData.timeline || 'ASAP',
            status: 'pending',
            source: 'chat',
          },
        })
      } catch (error) {
        console.error('Error creating project request:', error)
      }
    }

    // Send bot response
    const botMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        senderType: 'admin',
        senderName: 'MicroAI Assistant',
        message: result.response,
        messageType: 'text',
      },
    })

    return NextResponse.json({
      success: true,
      message: botMessage,
      botState: result.nextState,
    })
  } catch (error) {
    console.error('Error in bot conversation:', error)
    return NextResponse.json(
      { success: false, error: 'Bot conversation failed' },
      { status: 500 }
    )
  }
}

// GET /api/chat/bot/welcome - Send welcome message to new session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId required' },
        { status: 400 }
      )
    }

    // Check if bot already sent welcome
    const existingMessages = await prisma.chatMessage.findFirst({
      where: {
        sessionId,
        senderType: 'admin',
        senderName: 'MicroAI Assistant',
      },
    })

    if (existingMessages) {
      return NextResponse.json({
        success: true,
        alreadySent: true,
      })
    }

    // Send welcome message
    const welcomeMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        senderType: 'admin',
        senderName: 'MicroAI Assistant',
        message: getRandomResponse('welcome'),
        messageType: 'system',
      },
    })

    // Initialize bot state
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        metadata: JSON.stringify({
          botState: 'INITIAL',
          collectedData: {},
          botEnabled: true,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      message: welcomeMessage,
    })
  } catch (error) {
    console.error('Error sending welcome message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send welcome' },
      { status: 500 }
    )
  }
}
