import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// AI Chatbot responses for engaging visitors
const botResponses = {
  welcome: [
    "Hi there! 👋 I'm the MicroAI Assistant.\n\nI can help you:\n• Start a new project (I'll collect your info and connect you with our team)\n• Answer questions about our services, pricing, timeline\n• Guide you through the platform\n\nWhat would you like to do?",
    "Hello! 🚀 Welcome to MicroAI Systems.\n\nI'm here to:\n✓ Help you start a project quickly\n✓ Answer common questions\n✓ Connect you with our specialist team\n\nHow can I assist you today?",
    "Welcome! 💡 I'm your MicroAI assistant.\n\nI can:\n• Collect your project details and connect you with our team\n• Answer questions about services, pricing, and timelines\n• Help you navigate the platform\n\nWhat brings you here?"
  ],
  askName: [
    "Great! What's your name? 😊",
    "Perfect! May I have your name?",
    "Awesome! What should I call you?"
  ],
  askEmail: [
    "Thanks {name}! What's your email so our team can reach out?",
    "Nice to meet you, {name}! Could you share your email?",
    "{name}, what's the best email to contact you?"
  ],
  askProject: [
    "What kind of project do you have in mind? Just a brief description is fine!",
    "Tell me briefly about your project idea",
    "What would you like to build? A quick summary works!"
  ],
  connectAdmin: [
    "Perfect, {name}! I'm connecting you with a specialist now. They'll take over and discuss your {project} in detail. One moment... 🔄",
    "Great! I've got your info. Connecting you to our team now to discuss your {project}. Hang tight! ⚡",
    "Excellent! Let me hand you over to a specialist who can help with your {project}. Connecting now... 💬"
  ],
  handoff: [
    "Thank you, {name}! Your project request has been received. Our team will review and respond within 24 hours. You can also wait here and someone will join the chat soon!",
    "{name}, we've got your details! Expect a response within 24 hours, or feel free to stay in the chat - someone may join shortly!",
    "All set, {name}! We'll follow up within one business day. You're also welcome to wait in the chat if available!"
  ],
  // Platform help responses
  platformHelp: {
    howToQuote: "To request a quote: Visit our homepage, click 'Get Started' or 'Request Quote', fill in your project details, and submit. You'll receive a response within 24 hours! Want me to start collecting your project info now?",
    howToContact: "You can reach us via:\n• This live chat\n• Email: sales@microaisystems.com\n• Contact form on our website\nHow else can I help?",
    pricing: "Our pricing varies by project complexity:\n• Simple websites: $2k-$5k\n• Web applications: $5k-$15k\n• Complex platforms: $15k+\nWant a custom quote for your specific project?",
    timeline: "Our typical timelines:\n• Landing pages: 3-5 days\n• Business websites: 1-2 weeks\n• Web apps: 2-4 weeks\n• Custom platforms: 4-8 weeks\nWhat kind of project are you planning?",
    technologies: "We specialize in:\n• Next.js & React\n• TypeScript\n• Node.js\n• PostgreSQL\n• Tailwind CSS\n• AWS/Vercel deployment\nBuilding something with these? Tell me more!",
    portfolio: "Check out our portfolio at microaisystems.com/portfolio to see our previous work! Want to discuss a similar project?",
    services: "We offer:\n• Custom web applications\n• Business websites\n• E-commerce platforms\n• SaaS products\n• API development\n• Consulting\nWhich interests you?"
  },
  fallback: [
    "That's interesting! Could you tell me a bit more?",
    "I see! Can you elaborate on that?",
    "Got it! Anything else you'd like to share?"
  ]
}

function getRandomResponse(category: keyof typeof botResponses, replacements?: Record<string, string>) {
  const responses = botResponses[category]
  
  // Type guard to ensure it's an array
  if (!Array.isArray(responses)) {
    console.error(`Expected array for category ${category}, got object`)
    return "I'm here to help! What would you like to know?"
  }
  
  let response = responses[Math.floor(Math.random() * responses.length)]
  
  if (replacements) {
    Object.entries(replacements).forEach(([key, value]) => {
      response = response.replace(`{${key}}`, value)
    })
  }
  
  return response
}

// Check for platform help questions
function checkPlatformQuestion(message: string): string | null {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.match(/how (do|can|to).*(quote|request|get started|submit)/i)) {
    return 'howToQuote'
  }
  if (lowerMessage.match(/(contact|reach|email|phone|talk to)/i)) {
    return 'howToContact'
  }
  if (lowerMessage.match(/(price|cost|pricing|how much|budget|expensive)/i)) {
    return 'pricing'
  }
  if (lowerMessage.match(/(timeline|how long|duration|fast|quick)/i)) {
    return 'timeline'
  }
  if (lowerMessage.match(/(technology|tech stack|tools|framework|what.*use)/i)) {
    return 'technologies'
  }
  if (lowerMessage.match(/(portfolio|work|examples|projects)/i)) {
    return 'portfolio'
  }
  if (lowerMessage.match(/(service|what.*do|offer|provide)/i)) {
    return 'services'
  }
  
  return null
}

// Analyze message and determine bot state
function analyzeMessage(message: string, currentState: string, collectedData: any = {}): { nextState: string, response: string, data?: any, notifyAdmin?: boolean } {
  const lowerMessage = message.toLowerCase()
  
  // Check for platform questions first (can be asked at any time)
  const platformQ = checkPlatformQuestion(message)
  if (platformQ && currentState !== 'COLLECT_NAME' && currentState !== 'COLLECT_EMAIL') {
    const helpResponse = (botResponses.platformHelp as any)[platformQ]
    return {
      nextState: currentState, // Keep current state
      response: helpResponse
    }
  }
  
  // Check for name patterns
  const namePatterns = [
    /my name is (\w+)/i,
    /i'm (\w+)/i,
    /i am (\w+)/i,
    /call me (\w+)/i,
    /^(\w+)$/i // Single word as name
  ]
  
  // Check for email patterns
  const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
  
  // Check if message contains both name AND email (smart detection)
  const emailInMessage = message.match(emailPattern)
  const nameMatch = namePatterns.map(p => message.match(p)).find(m => m)
  
  // State machine logic - Optimized for quick handoff
  switch (currentState) {
    case 'INITIAL':
      // Smart detection: if they provide email immediately, skip to project
      if (emailInMessage) {
        return {
          nextState: 'COLLECT_PROJECT_BRIEF',
          response: `Great! I've got your email (${emailInMessage[1]}). What kind of project do you have in mind? Just a brief description!`,
          data: { email: emailInMessage[1] },
          notifyAdmin: true
        }
      }
      
      // Check if asking a question or wants to start project
      const hasProjectIntent = lowerMessage.match(/(website|app|platform|system|build|develop|create|need|want|project|quote|pricing)/i)
      
      if (hasProjectIntent) {
        return {
          nextState: 'COLLECT_NAME',
          response: "Perfect! Let's get you connected with our team. What's your name?",
          notifyAdmin: true // Notify admin that visitor wants to start a project
        }
      }
      // They might be asking a question
      return {
        nextState: 'COLLECT_NAME',
        response: "I'm here to help! What's your name so I can assist you better?"
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
        response: "What's your name? Just your first name is fine!"
      }
    
    case 'COLLECT_EMAIL':
      const emailMatch = message.match(emailPattern)
      if (emailMatch) {
        return {
          nextState: 'COLLECT_PROJECT_BRIEF',
          response: `Perfect! Now tell me briefly about your project idea - what do you want to build?`,
          data: { email: emailMatch[1] }
        }
      }
      return {
        nextState: 'COLLECT_EMAIL',
        response: "I need your email to connect you with our team. What's your email address?"
      }
    
    case 'COLLECT_PROJECT_BRIEF':
      // Got project brief - immediately connect to admin
      const projectType = message.toLowerCase().includes('website') ? 'website' :
                         message.toLowerCase().includes('app') ? 'app' :
                         message.toLowerCase().includes('platform') ? 'platform' : 'project'
      
      return {
        nextState: 'CONNECTING_ADMIN',
        response: getRandomResponse('connectAdmin', { 
          name: collectedData.name || 'there',
          project: projectType
        }),
        data: { projectBrief: message },
        notifyAdmin: true // Notify admin to take over chat
      }
    
    case 'CONNECTING_ADMIN':
      // Visitor sent another message while waiting - acknowledge
      return {
        nextState: 'ADMIN_CHAT',
        response: `Thanks for your patience! Your message has been noted. A team member will join shortly.`,
        data: { additionalInfo: message }
      }
    
    case 'ADMIN_CHAT':
      // Admin should be handling now, but bot acknowledges
      return {
        nextState: 'ADMIN_CHAT',
        response: `I've passed your message to our team. They'll respond soon!`
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
    const result = analyzeMessage(message, currentState, collectedData)

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
        status: result.nextState === 'CONNECTING_ADMIN' ? 'pending' : session.status,
      },
    })

    // Notify admin when visitor wants to start a project or when connecting
    if (result.notifyAdmin) {
      try {
        const notificationTitle = result.nextState === 'CONNECTING_ADMIN' 
          ? '💬 New Chat - Ready for Handoff'
          : '👋 New Visitor Started Chat'
        
        const notificationMessage = result.nextState === 'CONNECTING_ADMIN'
          ? `${updatedData.name || 'Visitor'} (${updatedData.email || 'email pending'}) is ready to discuss their project: "${updatedData.projectBrief?.substring(0, 60)}..."`
          : `A visitor just started a chat and expressed interest in a project`

        await prisma.notification.create({
          data: {
            type: 'chat_new',
            title: notificationTitle,
            message: notificationMessage,
            link: `/admin/chat?session=${sessionId}`,
            isRead: false,
          },
        })
      } catch (error) {
        console.error('Error creating notification:', error)
      }
    }

    // Create project request when admin handoff happens
    if (result.nextState === 'CONNECTING_ADMIN' && updatedData.email) {
      try {
        const projectRequest = await prisma.projectRequest.create({
          data: {
            requestNumber: `REQ-${Date.now()}`,
            clientName: updatedData.name || 'Chat Visitor',
            clientEmail: updatedData.email,
            projectName: `${updatedData.name}'s Project`,
            projectType: 'web',
            description: updatedData.projectBrief || message,
            requirements: updatedData.projectBrief || message,
            budgetRange: 'To be discussed',
            timeline: 'To be discussed',
            status: 'pending',
            source: 'chat',
          },
        })

        // Create another notification for the project request
        await prisma.notification.create({
          data: {
            type: 'project_new',
            title: '📋 New Project Request from Chat',
            message: `${updatedData.name} submitted project: "${updatedData.projectBrief?.substring(0, 50)}..."`,
            link: `/admin/project-requests`,
            isRead: false,
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
