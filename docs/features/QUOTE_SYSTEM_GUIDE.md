# Quote System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [User Guide](#user-guide)
4. [Technical Documentation](#technical-documentation)
5. [Deployment Guide](#deployment-guide)
6. [API Reference](#api-reference)

---

## Overview

The Quote System is a comprehensive solution for creating, managing, and tracking professional business quotes. It provides a complete workflow from quote creation to project conversion, with client-facing portals, digital signatures, and real-time notifications.

### Key Components
- **Quote Generator**: 6-step wizard for creating detailed quotes
- **Template Library**: Pre-built templates for common services
- **PDF Generator**: Professional 5-page PDF documents
- **Client Portal**: Public quote viewing and acceptance
- **Dashboard**: Complete quote management interface
- **Notifications**: Real-time updates and activity tracking

---

## Features

### 1. Quote Creation & Management
- ✅ 6-step wizard with progress tracking
- ✅ Auto-save with 3-second debounce
- ✅ Draft recovery on page reload
- ✅ Template system for quick creation
- ✅ Real-time calculations
- ✅ Edit mode for existing quotes

### 2. Professional PDF Generation
- ✅ 5-page comprehensive PDF layout
- ✅ Company branding and logo
- ✅ Executive summary
- ✅ Scope of work breakdown
- ✅ Detailed pricing tables
- ✅ Timeline and milestones
- ✅ Terms and conditions
- ✅ Live preview modal

### 3. Client Portal
- ✅ Public quote viewing page
- ✅ Digital signature capture
- ✅ Accept/reject functionality
- ✅ PDF download for clients
- ✅ Expiration date handling
- ✅ Status tracking

### 4. Quote Management Dashboard
- ✅ Statistics overview (total, draft, sent, accepted, value)
- ✅ Search functionality
- ✅ Status filtering (7 statuses)
- ✅ Grid and list views
- ✅ Sort by date/number/amount/client
- ✅ Quick actions (edit, PDF, convert, delete)

### 5. Quote-to-Project Conversion
- ✅ One-click conversion for accepted quotes
- ✅ Auto-populate project data
- ✅ Create milestones from quote
- ✅ Link quote and project bidirectionally
- ✅ Preserve all quote data

### 6. Notifications & Activity Tracking
- ✅ Real-time notification bell (30s polling)
- ✅ Unread count badges
- ✅ Priority-based notifications
- ✅ Activity timeline with visual design
- ✅ Complete audit trail
- ✅ Search and filter capabilities

---

## User Guide

### Creating a New Quote

#### Step 1: Basic Information
1. Navigate to `/admin/quotes/new`
2. Select an existing client or create new
3. Enter quote title and project type
4. Add description (optional)
5. Click "Next"

**Fields:**
- Client (required)
- Quote Title (required)
- Project Type (required)
- Description (optional)
- Valid Until Date (auto-calculated: 30 days)

#### Step 2: Scope of Work
1. Define project objectives
2. Add deliverables (what you'll provide)
3. List exclusions (what's not included)
4. Add assumptions
5. Specify client obligations

**Pro Tip:** Use the "Add Item" button to build comprehensive lists

#### Step 3: Pricing
1. Click "Use Template" to apply pre-built pricing
2. Or manually add pricing items:
   - Category (e.g., "Development", "Design")
   - Description
   - Amount
   - Recurring (yes/no)
   - Frequency (if recurring)
3. System auto-calculates subtotal, tax, and total

**Available Templates:**
- Basic Website ($4,300)
- Business Website ($8,700)
- E-commerce Platform ($21,700)
- Custom Web Application ($43,500)
- Mobile App Development ($65,000)
- Enterprise SaaS Platform ($130,000)

#### Step 4: Timeline
1. Enter estimated duration (e.g., "6-8 weeks")
2. Enter estimated hours
3. Click "Use Template" for milestone templates
4. Or add custom milestones:
   - Title
   - Description
   - Duration (days)
   - Deliverables
   - Payment percentage

#### Step 5: Terms & Conditions
1. Set payment terms:
   - Deposit percentage
   - Milestone payments
   - Final payment
   - Payment methods
   - Late penalty
2. Add terms and conditions text
3. Specify included revisions
4. Set maintenance terms

**Payment Template Options:**
- 50/50 Split
- 30/30/40 Milestones
- 20/30/30/20 Quarterly
- Monthly Retainer

#### Step 6: Review & Submit
1. Review all quote details
2. Click "Preview PDF" to see final document
3. Download PDF for your records
4. Submit quote (saves as draft or sends to client)

**Actions Available:**
- Save as Draft
- Preview PDF
- Download PDF
- Submit Quote

### Managing Quotes

#### Dashboard Overview (`/admin/quotes`)

**Statistics Cards:**
- Total Quotes
- Draft Quotes
- Sent Quotes
- Accepted Quotes
- Total Quote Value

**Actions:**
- Search by quote number, client, or company
- Filter by status (all, draft, sent, viewed, accepted, rejected, expired)
- Sort by date, number, amount, or client
- Switch between grid and list views

**Quote Actions:**
- ✏️ **Edit**: Modify quote details
- 📥 **PDF**: Download PDF version
- 🚀 **Convert**: Convert accepted quote to project
- 🗑️ **Delete**: Remove quote (with confirmation)

### Converting Quotes to Projects

**Prerequisites:**
- Quote must have "accepted" status
- Quote must not already be converted

**Process:**
1. Click the 🚀 Convert button on an accepted quote
2. Review conversion details in modal
3. Click "Convert to Project"
4. System creates new project with:
   - Name from quote title
   - Budget from quote total
   - Client automatically linked
   - Milestones from quote timeline
   - Start date and estimated end date
   - Description from scope of work

5. Redirects to project page
6. Quote is marked with project reference

### Client Portal Workflow

#### Sending Quotes to Clients
1. Complete quote creation
2. Set status to "sent"
3. Share quote link with client: `https://yourdomain.com/quotes/[quote-id]`

#### Client Actions
**When client opens link:**
1. Quote status automatically changes to "viewed"
2. Client can:
   - View all quote details
   - Download PDF copy
   - Accept quote (requires signature)
   - Reject quote

**Accepting a Quote:**
1. Client clicks "Accept Quote"
2. Signature modal opens
3. Client enters full name
4. Client draws signature on canvas
5. Client clicks "Accept Quote"
6. Quote status changes to "accepted"
7. Admin receives notification

**Rejecting a Quote:**
1. Client clicks "Reject Quote"
2. Confirms rejection
3. Quote status changes to "rejected"
4. Admin receives notification

### Notifications

#### Notification Bell
- Located in admin header
- Shows unread count badge
- Click to view recent notifications
- Auto-refreshes every 30 seconds

**Notification Types:**
- 📄 New Quote Created
- 👁️ Quote Viewed by Client
- ✅ Quote Accepted
- ❌ Quote Rejected
- 🔄 Project Update
- 📧 New Contact

**Actions:**
- Click notification to navigate to related item
- Mark individual as read
- Mark all as read

#### Notifications Page (`/admin/notifications`)
- View all notifications
- Filter by all/unread
- Delete old notifications
- Detailed view with metadata

### Activity Log

#### Viewing Activity (`/admin/activity`)
- Timeline view of all system actions
- Visual indicators for action types
- Search across all activities
- Filter by entity type (Quote, Project, Client, Invoice)

**Tracked Actions:**
- ✨ Created
- ✏️ Updated
- 🗑️ Deleted
- ✅ Accepted
- ❌ Rejected
- 👁️ Viewed
- 🔄 Converted

---

## Technical Documentation

### Architecture

#### Frontend Components
```
src/components/admin/quotes/
├── QuoteGenerator.tsx          # Main wizard component
├── QuotePDFDocument.tsx        # PDF template
├── QuoteSummary.tsx            # Summary sidebar
├── ProgressTracker.tsx         # Step indicator
├── PDFPreviewModal.tsx         # PDF preview
├── ConvertToProjectModal.tsx   # Conversion modal
├── components/
│   ├── Step1BasicInfo.tsx
│   ├── Step2Scope.tsx
│   ├── Step3Pricing.tsx
│   ├── Step4Timeline.tsx
│   ├── Step5Terms.tsx
│   ├── Step6Review.tsx
│   └── TemplateModal.tsx
└── utils/
    ├── types.ts                # TypeScript types
    ├── utils.ts                # Helper functions
    └── templates.ts            # Template library
```

#### Public Components
```
src/app/quotes/[id]/
└── page.tsx                    # Public quote view

src/components/quotes/
└── SignatureModal.tsx          # Digital signature
```

#### API Routes
```
src/app/api/
├── admin/
│   ├── quotes/
│   │   ├── route.ts           # List/Create quotes
│   │   └── [id]/
│   │       ├── route.ts       # Get/Update/Delete
│   │       ├── convert/       # Quote-to-Project
│   │       └── pdf/           # Generate PDF
│   ├── notifications/
│   │   ├── route.ts           # List notifications
│   │   ├── [id]/read/         # Mark as read
│   │   └── mark-all-read/     # Batch mark
│   └── activity-logs/
│       └── route.ts           # Activity logs
└── quotes/
    └── [id]/
        ├── route.ts           # Public quote view
        ├── view/              # Mark as viewed
        ├── respond/           # Accept/Reject
        └── pdf/               # Public PDF
```

### Database Schema

#### Quote Model
```prisma
model Quote {
  id              String    @id @default(uuid())
  quoteNumber     String    @unique
  title           String
  description     String?
  status          String    @default("draft")
  total           Float?
  currency        String    @default("USD")
  validUntil      DateTime?
  
  // Client info
  clientId        String?
  client          Client?   @relation(fields: [clientId], references: [id])
  clientName      String?
  clientEmail     String?
  
  // Project link
  projectId       String?   @unique
  project         Project?  @relation(fields: [projectId], references: [id])
  
  // Scope & Pricing
  scopeOfWork     String?   // JSON
  exclusions      String?   // JSON
  pricingItems    String?   // JSON
  milestones      String?   // JSON
  
  // Terms
  paymentTerms    String?   // JSON
  terms           String?
  
  // Signatures
  clientSignature String?
  clientSignedAt  DateTime?
  clientSignedBy  String?
  
  // Timestamps
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  issuedAt        DateTime?
  sentAt          DateTime?
  viewedAt        DateTime?
  respondedAt     DateTime?
}
```

### Auto-Save System

**Implementation:**
- 3-second debounce timer
- Saves to localStorage
- Key: `quote_draft_${userId}`
- Auto-loads on component mount
- Shows "Last saved" timestamp

**Code:**
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem('quote_draft', JSON.stringify(formData))
    setLastSaved(new Date())
  }, 3000)
  
  return () => clearTimeout(timer)
}, [formData])
```

### PDF Generation

**Technology:** @react-pdf/renderer

**Process:**
1. Fetch quote data from API
2. Render React PDF component
3. Convert to buffer server-side
4. Stream as PDF response

**Fonts:** Roboto (400, 700)

**Color Scheme:**
- Primary: Indigo (#4F46E5)
- Secondary: Purple (#7C3AED)
- Text: Slate (#1E293B)

---

## Deployment Guide

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Vercel/Render account (optional)

### Environment Variables

Create `.env` file:
```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"
DIRECT_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key"

# Optional: Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build application
npm run build

# Start production server
npm start
```

### Database Setup

```bash
# Create database
createdb microai

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npx prisma db seed
```

### Vercel Deployment

1. **Connect Repository:**
   - Go to Vercel Dashboard
   - Import Git repository
   - Select main branch

2. **Configure Environment:**
   - Add all environment variables
   - Set `DATABASE_URL` and `DIRECT_URL`
   - Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL`

3. **Build Settings:**
   ```
   Framework: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Verify deployment

### Database Migrations in Production

```bash
# Apply pending migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Verify
npx prisma db pull
```

### Post-Deployment Checklist

- [ ] Verify database connection
- [ ] Test quote creation
- [ ] Test PDF generation
- [ ] Test client portal access
- [ ] Verify notifications working
- [ ] Check activity logging
- [ ] Test quote-to-project conversion
- [ ] Verify signature capture
- [ ] Test email notifications (if configured)

---

## API Reference

### Admin Endpoints

#### List Quotes
```http
GET /api/admin/quotes
```
**Response:**
```json
{
  "success": true,
  "quotes": [...]
}
```

#### Create Quote
```http
POST /api/admin/quotes
Content-Type: application/json

{
  "clientId": "uuid",
  "title": "Website Development",
  "projectType": "business-website",
  ...
}
```

#### Get Quote
```http
GET /api/admin/quotes/[id]
```

#### Update Quote
```http
PUT /api/admin/quotes/[id]
Content-Type: application/json

{
  "title": "Updated Title",
  ...
}
```

#### Delete Quote
```http
DELETE /api/admin/quotes/[id]
```

#### Convert to Project
```http
POST /api/admin/quotes/[id]/convert
```

#### Generate PDF
```http
GET /api/admin/quotes/[id]/pdf
```
**Response:** PDF file download

### Public Endpoints

#### View Quote
```http
GET /api/quotes/[id]
```

#### Mark as Viewed
```http
POST /api/quotes/[id]/view
```

#### Accept/Reject Quote
```http
POST /api/quotes/[id]/respond
Content-Type: application/json

{
  "action": "accept",
  "signature": "data:image/png;base64,...",
  "signerName": "John Doe"
}
```

#### Download PDF
```http
GET /api/quotes/[id]/pdf
```

### Notification Endpoints

#### List Notifications
```http
GET /api/admin/notifications?limit=50&unreadOnly=true
```

#### Mark as Read
```http
POST /api/admin/notifications/[id]/read
```

#### Mark All as Read
```http
POST /api/admin/notifications/mark-all-read
```

### Activity Log Endpoints

#### Get Activity Logs
```http
GET /api/admin/activity-logs?entity=Quote&limit=50
```

---

## Best Practices

### Quote Creation
1. Always select the correct client
2. Use templates as a starting point
3. Customize pricing for each project
4. Include detailed scope of work
5. Set realistic timelines
6. Review before sending to client

### Client Communication
1. Send quote link via email
2. Follow up after 3-5 days
3. Monitor "viewed" status
4. Be prepared to discuss terms
5. Save accepted quotes as PDF

### Quote Management
1. Archive old quotes regularly
2. Use activity log for auditing
3. Convert accepted quotes promptly
4. Track quote success rate
5. Update templates based on feedback

### Security
1. Never share quote IDs publicly
2. Use HTTPS in production
3. Regularly backup database
4. Monitor activity logs
5. Set strong admin passwords

---

## Troubleshooting

### Common Issues

**PDF Generation Fails:**
- Check @react-pdf/renderer installation
- Verify font files are accessible
- Check server memory limits

**Signature Not Saving:**
- Verify canvas is rendering
- Check base64 encoding
- Ensure API endpoint is working

**Auto-Save Not Working:**
- Check browser localStorage
- Verify debounce timer
- Check console for errors

**Notifications Not Updating:**
- Verify polling interval (30s)
- Check API endpoint
- Verify database connection

### Support

For additional help:
- Check GitHub Issues
- Review API documentation
- Contact support team

---

## Changelog

### Version 1.0.0 (Current)
- ✅ Complete quote generation wizard
- ✅ Template library system
- ✅ PDF generation with preview
- ✅ Client portal with signatures
- ✅ Quote-to-project conversion
- ✅ Notifications & activity tracking
- ✅ Dashboard with filtering
- ✅ Auto-save functionality

### Future Enhancements
- 📧 Email automation
- 📊 Analytics dashboard
- 🔗 CRM integration
- 💰 Payment gateway integration
- 📱 Mobile app
- 🌍 Multi-currency support
- 🗣️ Multi-language support

---

## License

Copyright © 2025 MicroAI Systems. All rights reserved.
