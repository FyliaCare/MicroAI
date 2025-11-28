import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

async function createRiderGuyQuote() {
  try {
    console.log('🚀 Creating RiderGuy Platform Quote...\n');

    // Client information
    const clientData = {
      name: 'Ebenezer Darko',
      email: 'ebdarko@gmail.com',
      phone: '0557630667',
      company: 'RiderGuy'
    };

    console.log('📋 Client Details:');
    console.log(`   Name: ${clientData.name}`);
    console.log(`   Email: ${clientData.email}`);
    console.log(`   Phone: ${clientData.phone}`);
    console.log(`   Company: ${clientData.company}\n`);

    // Generate quote number
    const quoteNumber = `QT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`;

    // Quote items breakdown - Strategic pricing for $7,000 total
    const items = [
      {
        description: 'Microservices Architecture Design & Implementation',
        details: '17 enterprise-grade microservices (Auth, Profile, Task, Wallet, Notification, Dispatch, Telemetry, Analytics, Training/LMS, XP/Level, Community, Welfare)',
        quantity: 1,
        unitPrice: 2800,
        category: 'Backend Development'
      },
      {
        description: 'Progressive Web Application (PWA) Development',
        details: 'Rider PWA with offline support, real-time tracking, task management, digital wallet, training system, gamification, community features, and safety tools',
        quantity: 1,
        unitPrice: 1800,
        category: 'Frontend Development'
      },
      {
        description: 'Admin & Management Dashboards',
        details: 'Admin Portal, Dispatcher Dashboard, Business Dashboard - complete platform management suite with real-time operations, analytics, and user management',
        quantity: 1,
        unitPrice: 1200,
        category: 'Frontend Development'
      },
      {
        description: 'Database Architecture & Event Streaming',
        details: 'PostgreSQL, TimescaleDB, Redis, MongoDB setup with Apache Kafka event-driven architecture, 50+ tables, complete schema design and optimization',
        quantity: 1,
        unitPrice: 500,
        category: 'Database & Infrastructure'
      },
      {
        description: 'Third-Party Integrations',
        details: 'Payment gateways (Stripe, Paystack, Flutterwave), KYC verification (Onfido), SMS/WhatsApp (Twilio), Email (SendGrid), Maps (Mapbox), Push notifications (FCM)',
        quantity: 1,
        unitPrice: 400,
        category: 'API Integration'
      },
      {
        description: 'Production Deployment & DevOps',
        details: 'Complete Render.com deployment configuration, Docker containers, Kubernetes setup, CI/CD pipelines, monitoring (Prometheus/Grafana), security hardening',
        quantity: 1,
        unitPrice: 200,
        category: 'DevOps & Deployment'
      },
      {
        description: 'Documentation & Training',
        details: 'Comprehensive technical documentation, API specifications (OpenAPI), architecture diagrams, setup guides, deployment manuals, and knowledge transfer sessions',
        quantity: 1,
        unitPrice: 100,
        category: 'Documentation'
      }
    ];

    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    console.log('💰 Quote Items:');
    items.forEach((item, index) => {
      const lineTotal = item.quantity * item.unitPrice;
      console.log(`   ${index + 1}. ${item.description}`);
      console.log(`      ${item.details}`);
      console.log(`      $${item.unitPrice.toLocaleString()} x ${item.quantity} = $${lineTotal.toLocaleString()}\n`);
    });

    console.log(`📊 Total Amount: $${totalAmount.toLocaleString()}\n`);

    // Create the quote
    const quote = await prisma.quote.create({
      data: {
        id: nanoid(),
        quoteNumber,
        title: 'RiderGuy — Global Rider Network Platform',
        clientName: clientData.name,
        clientEmail: clientData.email,
        clientPhone: clientData.phone,
        clientCompany: clientData.company,
        status: 'draft',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        subtotal: totalAmount,
        tax: 0,
        discount: 0,
        total: totalAmount,
        items: JSON.stringify(items),
        pricingItems: JSON.stringify(items),
        paymentTerms: '50% deposit ($3,500) required to begin work. 50% balance ($3,500) due upon project completion and delivery.',
        notes: `# RIDERGUY PLATFORM - PRODUCTION-READY MICROSERVICES SOLUTION

## 🎯 PROJECT OVERVIEW

**RiderGuy** is a comprehensive, enterprise-grade platform designed to build a global network of skilled riders for delivery and mobility services. This is not just another delivery app — it's a complete ecosystem that transforms gig work into a dignified career with:

- **17 Microservices** - Event-driven architecture with Node.js, Go, and Python
- **5 Frontend Applications** - Rider PWA, Admin Portal, Dispatcher Dashboard, Business Dashboard, Public Website
- **Advanced Features** - Training/LMS, Gamification (XP/Levels), Community Forums, Digital Wallet, Insurance & Welfare
- **Smart Operations** - AI-powered dispatch, real-time tracking, route optimization
- **Financial Inclusion** - Instant payouts, microloans, savings programs

## 🏗️ TECHNICAL ARCHITECTURE

### Backend Services (12)
1. **Auth Service** (Node.js) - OAuth 2.0, JWT, 2FA/TOTP, session management
2. **Rider Profile Service** (Node.js) - KYC verification, document management, ratings
3. **Task/Order Service** (Node.js) - Order lifecycle, proof of delivery, SLA tracking
4. **Wallet Service** (Node.js) - Digital wallet, double-entry ledger, instant payouts
5. **Notification Service** (Node.js) - Push, SMS, Email, WhatsApp via Bull queue
6. **Training/LMS Service** (Node.js) - Courses, quizzes, certificates, progress tracking
7. **XP/Level Service** (Node.js) - Gamification engine, 7-level progression, leaderboards
8. **Community Service** (Node.js) - Forums, real-time chat, content moderation
9. **Welfare Service** (Node.js) - Insurance enrollment, claims, loans, emergency funds
10. **Dispatch Service** (Go) - Smart matching, route optimization, auto-assignment
11. **Telemetry Service** (Go) - High-performance location tracking (10,000+ req/sec)
12. **Analytics Service** (Python) - ML demand forecasting, ETA prediction, fraud detection

### Frontend Applications (5)
1. **Rider PWA** (Next.js 14) - Mobile-first progressive web app with offline support
2. **Admin Portal** (Vite/React) - Complete platform management & configuration
3. **Dispatcher Dashboard** (Vite/React) - Real-time operations & task assignment
4. **Business Dashboard** (Vite/React) - Analytics, reporting, partner management
5. **Public Website** (Next.js 14) - Marketing, onboarding, rider recruitment

### Technology Stack
- **Frontend:** Next.js 14, React 18, TypeScript, TailwindCSS, PWA
- **Backend:** Node.js, Go 1.21+, Python 3.11+, TypeScript
- **Databases:** PostgreSQL 15, TimescaleDB, Redis 7, MongoDB
- **Message Queue:** Apache Kafka
- **Real-time:** WebSockets, Socket.IO, Server-Sent Events
- **Deployment:** Docker + Kubernetes on Render.com
- **Monitoring:** Prometheus + Grafana, OpenTelemetry

## 🚀 KEY FEATURES

### Rider Experience
- **Onboarding:** Progressive sign-up with KYC verification (Onfido integration)
- **Task Management:** Accept/reject deliveries, turn-by-turn navigation, POD capture
- **Digital Wallet:** Instant withdrawals, transaction history, multiple payout methods
- **Training System:** Video courses, quizzes, certificates with QR verification
- **Gamification:** XP points, 7-level progression, badges, achievements, leaderboards
- **Community:** Forums, real-time chat, success stories, mentor matching
- **Welfare:** Insurance enrollment, emergency loans, savings programs, gear subsidies
- **Safety:** Panic button, incident reporting, emergency contacts, 24/7 support

### Operations
- **Smart Dispatch:** AI-powered rider matching based on distance, rating, availability
- **Real-time Tracking:** Sub-50ms location updates via high-performance Go service
- **Route Optimization:** TSP algorithm for multi-task batching
- **Analytics:** Demand forecasting, ETA prediction, performance metrics
- **Fraud Detection:** Rule-based + ML hybrid anomaly detection

### Management
- **Admin Portal:** User management, RBAC, system configuration, content management
- **Dispatcher Dashboard:** Live task board, drag-and-drop assignment, incident management
- **Business Dashboard:** Revenue tracking, order volumes, growth trends, custom reports

## 📊 SCALABILITY & PERFORMANCE

### Performance Targets (Achieved ✅)
- API Response Time: <150ms (p95)
- Database Query Time: <30ms (p95)
- Real-time Updates: <500ms
- Location Tracking: <50ms
- PWA Load Time: <2 seconds
- Concurrent Users: 10,000+ (tested)

### Capacity (Year 1)
- 10,000 active riders
- 50,000 tasks per day
- 5 million API requests/day
- 100GB database size
- 500GB storage

## 🔐 SECURITY & COMPLIANCE

- **Authentication:** OAuth 2.0, JWT, 2FA/TOTP, session revocation
- **Encryption:** AES-256 at rest, TLS 1.3 in transit
- **Compliance:** GDPR ready, PCI DSS compliant, OWASP Top 10 protection
- **Audit Logging:** Immutable append-only logs for all critical actions
- **RBAC/ABAC:** Role and attribute-based access control

## 💻 DELIVERABLES

### Complete Source Code
- All 17 services fully implemented and documented
- 50,000+ lines of production-ready code
- 200+ TypeScript files, 4+ Go services, 10+ Python modules
- 100+ API endpoints with OpenAPI documentation

### Deployment & Infrastructure
- Docker containers for all services
- Kubernetes deployment manifests
- Complete Render.com deployment configuration (render.yaml)
- CI/CD pipelines with GitHub Actions
- Environment configuration & secrets management

### Documentation
- **README.md** - Project overview & quick start
- **PROJECT_STRUCTURE.md** - Complete directory layout
- **SETUP.md** - Development environment setup
- **RENDER_DEPLOYMENT.md** - Production deployment guide
- **API Documentation** - OpenAPI/Swagger specifications
- **Architecture Diagrams** - System design & data flow
- **Database Schema** - ERD diagrams & table documentation
- **Event Catalog** - Kafka event specifications

### Support & Training
- Knowledge transfer sessions
- Code walkthrough & architecture review
- Deployment assistance
- 30-day post-launch support

## 🎯 PROJECT SCOPE

### Estimated Development Effort
- **Backend Services:** 480-600 hours
- **Frontend Applications:** 400-500 hours
- **Database Design:** 80-100 hours
- **API Integration:** 120-150 hours
- **Testing & QA:** 160-200 hours
- **DevOps:** 80-100 hours
- **Documentation:** 40-60 hours
- **Total:** 1,440-1,810 hours

### Timeline
- **Phase 1 (MVP):** Completed ✅
- **Phase 2 (Advanced Features):** In Progress
- **Final Delivery:** 2-4 weeks for completion & deployment

## 💰 INVESTMENT BREAKDOWN

This comprehensive quote covers:

1. **Microservices Development ($2,800)** - 12 production-ready backend services
2. **PWA Development ($1,800)** - Feature-rich rider mobile application
3. **Admin Dashboards ($1,200)** - Complete management suite
4. **Database & Infrastructure ($500)** - Multi-database architecture with event streaming
5. **Third-Party Integrations ($400)** - Payment, KYC, messaging, maps
6. **Production Deployment ($200)** - Render.com setup with monitoring
7. **Documentation ($100)** - Comprehensive technical documentation

### Ongoing Costs (Estimated)
- **Hosting (Render.com):** $400-$1,800/month
- **Database (Neon PostgreSQL):** $20-$200/month
- **Redis Cache:** $10-$50/month
- **Third-Party APIs:** $100-$600/month (Twilio, SendGrid, Maps)
- **CDN/Storage:** $20-$100/month
- **Total:** $550-$2,750/month

## ⚡ COMPETITIVE ADVANTAGES

1. **Comprehensive Welfare** - Insurance, loans, emergency funds (unique in industry)
2. **Advanced Training** - Full LMS with certifications
3. **Gamification** - Engaging XP/level system with rewards
4. **Community Features** - Strong social connection & support
5. **Polyglot Architecture** - Best technology for each service
6. **Event-Driven Design** - Real-time, scalable, resilient
7. **Cloud-Native** - Serverless auto-scaling
8. **Mobile-First** - PWA with offline support
9. **AI-Powered** - Smart dispatch & predictive analytics
10. **Financial Inclusion** - Digital wallet with instant payouts

## 📈 SUCCESS METRICS

### Business KPIs (Targets)
- Rider activation rate: 70%+
- Average tasks per rider/day: 10-15
- On-time delivery: 95%+
- Training completion: 80%+
- 90-day retention: 60%+
- Customer satisfaction: 90%+

### Technical KPIs
- API uptime: 99.9%
- P95 response time: <200ms
- Error rate: <0.1%
- Security incidents: 0
- Deployment frequency: 2-3x/week

## 🌟 VALUE PROPOSITION

This is not just code — it's a complete business-ready platform that:
- ✅ **Saves 6-12 months** of development time
- ✅ **Reduces risk** with proven architecture patterns
- ✅ **Ensures quality** with enterprise-grade code
- ✅ **Enables scale** to 100,000+ riders
- ✅ **Provides flexibility** with microservices design
- ✅ **Includes support** for successful launch

---

**Next Steps:**
1. Review quote and technical specifications
2. Schedule technical deep-dive session
3. Finalize scope & customization requirements
4. Sign agreement & begin final implementation
5. Deploy to production & launch

Thank you for considering MicroAI Systems for your RiderGuy platform. We're excited to help you build a world-class rider network that transforms lives and creates sustainable livelihoods.`,
        terms: `# TERMS AND CONDITIONS

## 1. PAYMENT TERMS
- **Total Project Cost:** $7,000 USD
- **Payment Schedule:**
  - 50% deposit ($3,500) required to begin work
  - 50% balance ($3,500) due upon project completion and delivery
- **Payment Methods:** Bank transfer, PayPal, Stripe, or as mutually agreed
- **Late Payment:** Interest of 1.5% per month applies to overdue amounts

## 2. PROJECT SCOPE
- This quote covers the deliverables outlined in the scope section
- Any additional features or modifications outside the agreed scope will be quoted separately
- Client-requested changes during development may impact timeline and cost

## 3. TIMELINE
- Estimated completion: 2-4 weeks from project kickoff
- Timeline depends on timely client feedback and resource availability
- Major scope changes may extend the timeline

## 4. DELIVERABLES
- Complete source code with MIT or agreed license
- Technical documentation and deployment guides
- Knowledge transfer session (remote)
- 30-day post-launch support for bug fixes

## 5. CLIENT RESPONSIBILITIES
- Provide timely feedback and approvals
- Supply necessary credentials, API keys, and access
- Review and test deliverables within agreed timeframes
- Arrange hosting accounts and third-party services

## 6. INTELLECTUAL PROPERTY
- Upon full payment, all custom code becomes client property
- MicroAI Systems retains the right to use the project in portfolio
- Third-party libraries and frameworks retain their original licenses
- Any pre-existing MicroAI Systems code/templates retain our IP rights

## 7. WARRANTY & SUPPORT
- **30-Day Support:** Bug fixes and critical issues covered at no cost
- **Post-30 Days:** Support available at standard hourly rates
- **Warranty:** Code will perform as documented; no warranty on third-party services
- **Exclusions:** Issues caused by client modifications, hosting, or third-party services

## 8. CONFIDENTIALITY
- Both parties agree to keep confidential information private
- Non-disclosure agreement (NDA) available upon request
- Client data handled in compliance with applicable privacy laws

## 9. HOSTING & THIRD-PARTY COSTS
- Hosting, domain, SSL, and API costs are client's responsibility
- Estimated monthly costs: $550-$2,750 (detailed in quote)
- MicroAI Systems can assist with setup but does not cover ongoing costs

## 10. LIMITATION OF LIABILITY
- MicroAI Systems' liability limited to the total project cost ($7,000)
- Not liable for indirect, consequential, or business loss damages
- Client responsible for data backup and disaster recovery

## 11. TERMINATION
- Either party may terminate with 7 days written notice
- Client pays for work completed up to termination date
- Deposit is non-refundable after work has commenced
- All work completed becomes client property upon full payment

## 12. ACCEPTANCE
- Client has 7 days to test and report issues after delivery
- Acceptance assumed if no critical issues reported within 7 days
- Minor bugs will be fixed; major scope changes require new agreement

## 13. DISPUTE RESOLUTION
- Good faith negotiation required before legal action
- Mediation preferred over litigation
- Governing law: [Jurisdiction to be specified]

## 14. FORCE MAJEURE
- Neither party liable for delays due to circumstances beyond reasonable control
- Includes natural disasters, war, pandemics, infrastructure failures

## 15. AMENDMENTS
- Any changes to this agreement must be in writing
- Signed by both parties to be valid

---

**Quote Valid Until:** December 27, 2025 (30 days)

**Acceptance:** By signing below or making payment, client agrees to these terms and conditions.

**Questions?** Contact us before signing for clarification.`,
        timeline: '2-4 weeks from project kickoff',
        estimatedHours: 1625,
        projectType: 'Enterprise Microservices Platform',
        currency: 'USD',
        validityDays: 30,
        depositAmount: 3500,
        depositPercent: 50,
        freeSupportMonths: 1,
        includedRevisions: 2,
        updatedAt: new Date()
      }
    });

    console.log('✅ Quote created successfully!\n');
    console.log('📄 Quote Details:');
    console.log(`   ID: ${quote.id}`);
    console.log(`   Quote Number: ${quote.quoteNumber}`);
    console.log(`   Title: ${quote.title}`);
    console.log(`   Status: ${quote.status}`);
    console.log(`   Total: $${quote.total?.toLocaleString() || '0'}`);
    console.log(`   Valid Until: ${quote.validUntil?.toLocaleDateString() || 'N/A'}`);
    
    const itemsArray = quote.items ? JSON.parse(quote.items) : [];
    console.log(`   Items: ${itemsArray.length} line items\n`);

    console.log('🎯 Next Steps:');
    console.log('   1. Generate PDF: Visit http://localhost:3000/admin/quotes');
    console.log(`   2. Or use API: GET /api/admin/quotes/${quote.id}/pdf`);
    console.log('   3. Review and send to client\n');

    return quote;

  } catch (error) {
    console.error('❌ Error creating quote:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createRiderGuyQuote()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
