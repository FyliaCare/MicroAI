# MicroAI Systems Platform# 🚀 MicroAI Systems Platform# MicroAI Systems Platform



A high-performance full-stack business management platform built with Next.js 14, featuring a professional company website, advanced quotation system, and comprehensive admin dashboard.



[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)A comprehensive full-stack web platform built with Next.js 14, featuring a professional company website and complete business management system.A comprehensive full-stack web platform for MicroAI Systems, featuring a professional company website and a complete business management system.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

[![Prisma](https://img.shields.io/badge/Prisma-6-green)](https://www.prisma.io/)



## 🚀 Features[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)



### Public Website[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

- **Professional Company Showcase** - Modern, responsive design

- **Service Portfolio** - Web applications, tools, websites, and SaaS[![Prisma](https://img.shields.io/badge/Prisma-6-green)](https://www.prisma.io/)## 🚀 Features## 🚀 Features

- **Interactive Pricing Calculator** - Real-time cost estimation

- **Portfolio Gallery** - Project showcase with filtering[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

- **Contact System** - Functional contact form with API integration

- **SEO Optimized** - Built for search engine visibility



### Admin Dashboard## ✨ Features

- **Project Management** - Complete project lifecycle tracking

- **Client Management** - CRM system with communication history### Public Website### Public Website

- **Service Management** - Service catalog and pricing control

- **Analytics Dashboard** - Real-time business metrics and insights### Public Website

- **GitHub Integration** - Auto-import projects from repositories

- **Activity Tracking** - Comprehensive audit logs- 🎨 **Modern Design** - Professional, responsive interface- **Professional Company Showcase** - Modern, responsive design showcasing services- **Professional Company Showcase** - Modern, responsive design showcasing services



### Professional Quote System- 📱 **Mobile-First** - Optimized for all devices

- **6-Step Wizard** - Intuitive quote creation workflow

- **Professional PDF Generation** - 5-page branded quotes with locked template- ⚡ **Performance** - Lightning-fast load times- **Service Portfolio** - Web applications, web tools, websites, and SaaS solutions- **Service Portfolio** - Web applications, web tools, websites, and SaaS solutions

- **11 Pre-built Templates** - Industry-standard pricing templates

- **Auto-Save** - Never lose work with 3-second debounce- 🔍 **SEO Optimized** - Built with Next.js for search visibility

- **Quote-to-Project Conversion** - One-click project creation

- **Digital Signatures** - Client signature capture- 💼 **Service Showcase** - Portfolio and pricing pages- **About Us Page** - Company mission, vision, and values- **About Us Page** - Company mission, vision, and values

- **Real-time Notifications** - Activity tracking and updates

- **Client Portal** - Dedicated quote viewing and response system- 📞 **Contact System** - Functional contact form with API integration



### Performance Optimizations- **Services Page** - Detailed service offerings with pricing- **Services Page** - Detailed service offerings with pricing

- **85% Faster API Responses** - 800-1200ms → 50-150ms

- **Advanced Caching** - 100MB in-memory cache with LRU eviction### Management Dashboard

- **Rate Limiting** - Sliding window algorithm for API protection

- **Database Optimization** - Connection pooling and query caching- 📊 **Analytics** - Real-time business insights and metrics- **Portfolio Page** - Showcase of completed projects- **Portfolio Page** - Showcase of completed projects

- **Security Headers** - HSTS, CSP, XSS protection

- **Production Ready** - Supports 1000+ concurrent users- 👥 **Client Management** - Comprehensive CRM system



## 🛠️ Technology Stack- 📁 **Project Tracking** - Full project lifecycle management- **Contact Page** - Functional contact form with API integration- **Contact Page** - Functional contact form with API integration



| Category | Technologies |- 💰 **Quote System** - Professional PDF quote generation

|----------|-------------|

| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |- 📧 **Communications** - Email tracking and notifications- **Mobile-Responsive** - Optimized for all devices- **Mobile-Responsive** - Optimized for all devices

| **Backend** | Next.js API Routes, Prisma ORM |

| **Database** | PostgreSQL |- 🔐 **Secure Auth** - NextAuth.js authentication

| **Authentication** | NextAuth.js |

| **PDF Generation** | jsPDF (locked professional template) |- 🐙 **GitHub Integration** - Auto-import projects from repositories- **SEO Optimized** - Built with Next.js for excellent search engine visibility- **SEO Optimized** - Built with Next.js for excellent search engine visibility

| **Caching** | Custom in-memory cache with LRU eviction |

| **Rate Limiting** | Sliding window algorithm |

| **Deployment** | Render.com + Neon Database |

### Advanced Quote System

## 📦 Quick Start

- 📝 **6-Step Wizard** - Intuitive quote creation workflow

### Prerequisites

- Node.js 18+- 📄 **Professional PDFs** - 5-page branded quotes### Management Dashboard### Management Dashboard

- PostgreSQL database (or Neon account)

- Git- 💾 **Auto-Save** - Never lose work with 3s debounce



### Installation- 📋 **Templates** - 11 pre-built pricing templates- **Project Management** - Track and manage all company projects with GitHub integration- **Project Management** - Track and manage all company projects



1. **Clone the repository**- 🔄 **Quote-to-Project** - One-click conversion

   ```bash

   git clone https://github.com/FyliaCare/MicroAI.git- ✍️ **Digital Signatures** - Client signature capture- **Client Management** - Comprehensive client database and communication tools- **Client Management** - Comprehensive client database and communication tools

   cd MicroAI

   ```- 🔔 **Real-time Notifications** - Activity tracking



2. **Install dependencies**- **Service Management** - Manage service offerings and pricing- **Service Management** - Manage service offerings and pricing

   ```bash

   npm install## 🛠️ Technology Stack

   ```

- **Quote System** - Professional PDF quote generation- **Analytics Dashboard** - Business insights and performance metrics

3. **Set up environment variables**

   | Category | Technologies |

   Create `.env.local`:

   ```env|----------|-------------|- **Analytics Dashboard** - Business insights and performance metrics- **Real-time Updates** - Live dashboard with recent activity tracking

   # Database

   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |

   DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"

   | **Backend** | Next.js API Routes, Prisma ORM |- **Real-time Updates** - Live dashboard with recent activity tracking

   # Authentication

   NEXTAUTH_URL="http://localhost:3000"| **Database** | PostgreSQL (Neon) |

   NEXTAUTH_SECRET="your-secret-key-here"

   | **Authentication** | NextAuth.js |### Technical Features

   # Environment

   NODE_ENV="development"| **PDF Generation** | @react-pdf/renderer |

   ```

| **Email** | Nodemailer, Resend |### Technical Features- **Next.js 14** - Latest React framework with App Router

4. **Initialize database**

   ```bash| **Deployment** | Render.com (Frontend) + Neon (Database) |

   npx prisma generate

   npx prisma migrate dev| **Dev Tools** | ESLint, TypeScript, PostCSS |- **Next.js 14** - Latest React framework with App Router- **TypeScript** - Type-safe development

   npm run db:seed

   ```



5. **Start development server**## 📦 Quick Start- **TypeScript** - Type-safe development- **Tailwind CSS** - Modern, utility-first styling

   ```bash

   npm run dev

   ```

### Prerequisites- **Tailwind CSS** - Modern, utility-first styling- **RESTful API** - Built-in API routes for data management

6. **Open in browser**

   - Public Site: http://localhost:3000- Node.js 18+ 

   - Admin Dashboard: http://localhost:3000/admin

   - API Health: http://localhost:3000/api/health- PostgreSQL database (or Neon account)- **Prisma ORM** - Database management with PostgreSQL- **Responsive Design** - Mobile-first approach



### Default Admin Credentials- Git

```

Email: microailabs@gmail.com- **NextAuth.js** - Secure authentication system- **Performance Optimized** - Fast loading and smooth user experience

Password: 1Billion7991.

```### Local Development



## 🎯 Key Endpoints- **RESTful API** - Built-in API routes for data management- **Reusable Components** - Button, Card, Input, Modal, Textarea components



| Endpoint | Method | Description |1. **Clone the repository**

|----------|--------|-------------|

| `/api/health` | GET | System health check |   ```bash- **Responsive Design** - Mobile-first approach- **Utility Functions** - Comprehensive helper library

| `/api/admin/projects` | GET/POST | Project management |

| `/api/admin/clients` | GET/POST | Client management |   git clone https://github.com/FyliaCare/MicroAI.git

| `/api/admin/quotes` | GET/POST | Quote management |

| `/api/admin/quotes/[id]/pdf` | GET | Generate PDF quote |   cd MicroAI- **Performance Optimized** - 64% bundle reduction, 56% faster load times

| `/api/admin/quotes/[id]/convert` | POST | Convert quote to project |

| `/api/quotes/[id]` | GET | Public quote view |   ```

| `/api/quotes/[id]/respond` | POST | Accept/reject quote |

| `/api/admin/analytics` | GET | Business analytics |- **GitHub Integration** - Auto-import projects from repositories## 🛠️ Technology Stack

| `/api/contact` | POST | Contact form submission |

2. **Install dependencies**

## 📁 Project Structure

   ```bash- **Reusable Components** - Comprehensive UI component library

```

MicroAI/   npm install

├── prisma/

│   ├── schema.prisma              # Database schema   ```- **Frontend**: Next.js 14, React 18, TypeScript

│   ├── migrations/                # Database migrations

│   ├── seed.ts                    # Database seeding

│   └── seedQuoteTemplates.ts      # Quote templates

├── src/3. **Set up environment variables**## 🛠️ Technology Stack- **Styling**: Tailwind CSS, PostCSS

│   ├── app/

│   │   ├── admin/                 # Admin dashboard pages   ```bash

│   │   ├── api/                   # API routes (30+ endpoints)

│   │   ├── quotes/                # Client quote portal   cp .env.example .env.local- **Backend**: Next.js API Routes

│   │   ├── about/                 # About page

│   │   ├── contact/               # Contact page   ```

│   │   ├── portfolio/             # Portfolio page

│   │   ├── pricing/               # Pricing calculator   - **Frontend**: Next.js 14, React 18, TypeScript- **Development**: ESLint, Autoprefixer

│   │   └── services/              # Services page

│   ├── components/   Edit `.env.local` with your credentials:

│   │   ├── admin/                 # Admin components

│   │   ├── quotes/                # Quote system components   ```env- **Styling**: Tailwind CSS, PostCSS- **Deployment**: Vercel-ready configuration

│   │   ├── layout/                # Layout components

│   │   └── ui/                    # Reusable UI components   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

│   ├── lib/

│   │   ├── auth.ts                # NextAuth configuration   DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"- **Backend**: Next.js API Routes, Prisma ORM

│   │   ├── prisma.ts              # Prisma client

│   │   ├── cache-optimized.ts     # Advanced caching system   NEXTAUTH_URL="http://localhost:3000"

│   │   ├── rate-limit.ts          # Rate limiting

│   │   ├── performance.ts         # Performance monitoring   NEXTAUTH_SECRET="your-secret-key-here"- **Database**: PostgreSQL (Neon)## 📦 Installation

│   │   ├── locked-quote-template.ts # Professional PDF template

│   │   └── utils.ts               # Utility functions   ```

│   └── types/                     # TypeScript definitions

├── docs/- **Authentication**: NextAuth.js

│   ├── deployment/

│   │   └── RENDER_DEPLOYMENT.md   # Deployment guide4. **Set up the database**

│   └── features/

│       ├── GITHUB_INTEGRATION_GUIDE.md   ```bash- **Deployment**: Render.com1. **Clone or download the project** (already set up in your workspace)

│       └── QUOTE_SYSTEM_GUIDE.md

├── DEPLOYMENT.md                  # Production deployment guide   npx prisma generate

├── PERFORMANCE_OPTIMIZATIONS.md   # Optimization documentation

└── README.md                      # This file   npx prisma migrate dev- **Development**: ESLint, Autoprefixer

```

   npm run db:seed

## 🔧 Development Scripts

   ```2. **Install dependencies**:

```bash

# Development

npm run dev              # Start dev server with Turbopack

npm run build            # Build for production5. **Start the development server**## 📦 Installation   ```bash

npm start                # Start production server

npm run lint             # Run ESLint   ```bash



# Database   npm run dev   npm install

npx prisma generate      # Generate Prisma client

npx prisma migrate dev   # Run migrations   ```

npx prisma studio        # Open database GUI

npm run db:seed          # Seed database1. **Clone or download the project**   ```

```

6. **Open your browser**

## 🚀 Production Deployment

   - Public Site: [http://localhost:3000](http://localhost:3000)

### Option 1: Render.com + Neon (Recommended)

   - Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

1. **Create Neon Database**

   - Sign up at [neon.tech](https://neon.tech)   - API Health: [http://localhost:3000/api/health](http://localhost:3000/api/health)2. **Install dependencies**:3. **Run the development server**:

   - Create new project

   - Copy connection strings (pooled + direct)



2. **Deploy to Render**### Default Credentials   ```bash   ```bash

   - Push code to GitHub

   - Create new Web Service on Render```

   - Connect repository

   - Set environment variablesEmail: microailabs@gmail.com   npm install   npm run dev

   - Deploy

Password: 1Billion7991.

3. **Configure Environment**

   ```env```   ```   ```

   DATABASE_URL=<neon-pooled-connection>

   DIRECT_URL=<neon-direct-connection>

   NEXTAUTH_URL=https://your-app.onrender.com

   NEXTAUTH_SECRET=<generate-with-openssl>## 🚀 Production Deployment (Render + Neon)

   NODE_ENV=production

   ```



4. **Run Migrations**### 1. Create Neon Database3. **Set up environment variables**:4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

   ```bash

   npx prisma migrate deploy

   npm run db:seed

   ```1. Go to [neon.tech](https://neon.tech) and sign up   Create a `.env` file with:



See [DEPLOYMENT.md](DEPLOYMENT.md) and [docs/deployment/RENDER_DEPLOYMENT.md](docs/deployment/RENDER_DEPLOYMENT.md) for detailed instructions.2. Create a new project: `microai-production`



## ⚡ Performance Metrics3. Copy your connection strings:   ```env## 🎯 Quick Start



### Before Optimization   - **Pooled** (for app): `postgresql://user:pass@host-pooler.region.aws.neon.tech/db?sslmode=require`

- API Response Time: 800-1200ms

- Database Queries: 300-500ms   - **Direct** (for migrations): `postgresql://user:pass@host.region.aws.neon.tech/db?sslmode=require`   DATABASE_URL="your-postgresql-url"

- Memory Usage: 300-400MB

- Concurrent Users: ~50



### After Optimization### 2. Deploy to Render   NEXTAUTH_URL="http://localhost:3000"### Accessing the Platform

- API Response Time: 50-150ms (85% faster)

- Database Queries: 20-80ms (80% faster)

- Memory Usage: 150-250MB (40% reduction)

- Concurrent Users: 1000+ (20x improvement)1. **Fork/Push to GitHub**   NEXTAUTH_SECRET="your-secret-key"

- Cache Hit Rate: 85-95%

   ```bash

See [PERFORMANCE_OPTIMIZATIONS.md](PERFORMANCE_OPTIMIZATIONS.md) for implementation details.

   git push origin main   ```- **Public Website**: [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

   ```

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

- **[PERFORMANCE_OPTIMIZATIONS.md](PERFORMANCE_OPTIMIZATIONS.md)** - Optimization documentation- **About Page**: [http://localhost:3000/about](http://localhost:3000/about)

- **[docs/deployment/RENDER_DEPLOYMENT.md](docs/deployment/RENDER_DEPLOYMENT.md)** - Render-specific deployment

- **[docs/features/QUOTE_SYSTEM_GUIDE.md](docs/features/QUOTE_SYSTEM_GUIDE.md)** - Quote system documentation2. **Create New Web Service** on [Render Dashboard](https://dashboard.render.com/)

- **[docs/features/GITHUB_INTEGRATION_GUIDE.md](docs/features/GITHUB_INTEGRATION_GUIDE.md)** - GitHub integration guide

   - Connect your GitHub repository4. **Run database migrations**:- **Services Page**: [http://localhost:3000/services](http://localhost:3000/services)

## 🔐 Security Features

   - Branch: `main`

- **NextAuth.js Authentication** - Secure session management

- **Rate Limiting** - API protection with sliding window algorithm   - Root Directory: `.`   ```bash- **Portfolio Page**: [http://localhost:3000/portfolio](http://localhost:3000/portfolio)

- **Security Headers** - HSTS, CSP, XSS protection

- **SQL Injection Protection** - Parameterized queries with Prisma

- **CSRF Protection** - Built-in Next.js CSRF tokens

- **Input Validation** - Comprehensive data validation3. **Configure Build Settings**   npx prisma migrate dev- **Contact Page**: [http://localhost:3000/contact](http://localhost:3000/contact)



## 🤝 Support   - Build Command: `npm install && npx prisma generate && npm run build`



**MicroAI Systems**   - Start Command: `npm start`   ```- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

- Email: sales@microaisystems.com

- Phone: +233 244486837 | +233 544230568

- Address: BR253 Pasture St. Takoradi, Ghana

- Issues: [GitHub Issues](https://github.com/FyliaCare/MicroAI/issues)4. **Add Environment Variables** (from `.env.production.example`)



## 📄 License   ```



MIT License - See [LICENSE](LICENSE) for details.   DATABASE_URL=<your-neon-pooled-connection>5. **Run the development server**:### API Endpoints



---   DIRECT_URL=<your-neon-direct-connection>



**MicroAI Systems Platform** - Professional web solutions for modern businesses.   NEXTAUTH_URL=https://your-app.onrender.com   ```bash


   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

   NODE_ENV=production   npm run dev- `GET /api/projects` - Retrieve all projects

   ```

   ```- `POST /api/projects` - Create a new project

5. **Deploy** 🚀

   - Render will automatically deploy- `GET /api/clients` - Retrieve all clients

   - Check logs for successful deployment

   - Visit: `https://your-app.onrender.com`6. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)- `POST /api/clients` - Add a new client



### 3. Post-Deployment- `GET /api/analytics` - Get business analytics data



```bash## 🎯 Quick Start- `POST /api/contact` - Handle contact form submissions

# SSH into Render or run locally with production DATABASE_URL

npx prisma migrate deploy

npm run db:seed

```### Accessing the Platform## 📊 Management Dashboard Features



Visit `https://your-app.onrender.com/api/health` to verify deployment.



## 📁 Project Structure- **Public Website**: [http://localhost:3000](http://localhost:3000)### Overview Dashboard



```- **About Page**: [http://localhost:3000/about](http://localhost:3000/about)- Active projects count

MicroAI/

├── prisma/- **Services Page**: [http://localhost:3000/services](http://localhost:3000/services)- Total clients count

│   ├── schema.prisma           # Database schema

│   ├── migrations/             # Database migrations- **Portfolio Page**: [http://localhost:3000/portfolio](http://localhost:3000/portfolio)- Revenue tracking

│   ├── seed.ts                 # Seed script

│   └── seedQuoteTemplates.ts   # Quote templates- **Pricing Calculator**: [http://localhost:3000/pricing](http://localhost:3000/pricing)- Service overview

├── src/

│   ├── app/- **Contact Page**: [http://localhost:3000/contact](http://localhost:3000/contact)- Recent activity feed

│   │   ├── about/              # About page

│   │   ├── admin/              # Admin dashboard- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

│   │   ├── api/                # API routes (30+ endpoints)

│   │   ├── contact/            # Contact page### Project Management

│   │   ├── portfolio/          # Portfolio page

│   │   ├── pricing/            # Pricing calculator### API Endpoints- Create and track projects

│   │   ├── quotes/             # Client quote portal

│   │   └── services/           # Services page- Assign clients to projects

│   ├── components/

│   │   ├── admin/              # Admin components (20+)- `GET/POST /api/admin/projects` - Project management- Monitor project status

│   │   ├── layout/             # Layout components

│   │   └── ui/                 # Reusable UI components- `GET/POST /api/admin/clients` - Client management- Set due dates and milestones

│   ├── lib/

│   │   ├── auth.ts             # NextAuth config- `GET/POST /api/admin/quotes` - Quote generation

│   │   ├── prisma.ts           # Prisma client

│   │   └── utils.ts            # Helper functions- `GET /api/admin/analytics` - Business analytics### Client Management

│   └── types/                  # TypeScript definitions

├── docs/                       # Comprehensive documentation- `POST /api/contact` - Contact form submissions- Client database

├── render.yaml                 # Render deployment config

├── .env.example                # Environment template- `POST /api/admin/github/repo` - GitHub repository import- Contact information

└── .env.production.example     # Production env template

```- `POST /api/admin/github/webhook` - GitHub webhook for auto-sync- Project history



## 🎯 Key API Endpoints- Communication tracking



| Endpoint | Method | Description |## 📊 Management Dashboard Features

|----------|--------|-------------|

| `/api/health` | GET | Health check for monitoring |### Services Management

| `/api/admin/projects` | GET/POST | Project management |

| `/api/admin/clients` | GET/POST | Client management |### Overview Dashboard- Service catalog

| `/api/admin/quotes` | GET/POST | Quote generation |

| `/api/admin/quotes/[id]/pdf` | GET | Generate PDF |- Active projects count- Pricing management

| `/api/admin/quotes/[id]/convert` | POST | Convert quote to project |

| `/api/quotes/[id]` | GET | Public quote view |- Total clients count- Service descriptions

| `/api/quotes/[id]/respond` | POST | Accept/reject quote |

| `/api/contact` | POST | Contact form submission |- Revenue tracking- Portfolio management

| `/api/analytics` | GET | Business analytics |

- Service overview

## 📚 Documentation

- Recent activity feed### Analytics

Comprehensive documentation is available in the `docs/` directory:

- Quick actions- Performance metrics

### Deployment Guides

- [Render Deployment](docs/deployment/RENDER_DEPLOYMENT.md) - Complete deployment guide- Revenue analytics

- [Environment Setup](docs/deployment/RENDER_ENV_SETUP.md) - Environment variables

- [Database Fixes](docs/deployment/RENDER_DATABASE_FIX.md) - Troubleshooting### Project Management- Project completion rates

- [Custom Domain](docs/deployment/CUSTOM_DOMAIN_SETUP.md) - Domain configuration

- Create and track projects- Client acquisition data

### Feature Documentation

- [Quote System Guide](docs/features/QUOTE_SYSTEM_GUIDE.md) - 800+ line manual- Import projects from GitHub repositories

- [Quick Start Quotes](docs/features/QUICK_START_QUOTES.md) - 5-minute guide

- [GitHub Integration](docs/features/GITHUB_INTEGRATION_GUIDE.md) - Auto-import projects- Auto-sync with GitHub commits via webhooks## 🛠️ Development

- [Authentication](docs/features/AUTHENTICATION_COMPLETE.md) - Security setup

- [PDF Generation](docs/features/PDF_REDESIGN_COMPLETE.md) - PDF system- Assign clients to projects



### Setup Guides- Monitor project status### Available Scripts

- [Email Setup](docs/guides/EMAIL_SETUP.md) - SMTP configuration

- [Gmail Setup](docs/guides/GMAIL_SETUP_FINAL.md) - Gmail SMTP- Set due dates and milestones

- [Quick SMTP](docs/guides/QUICK_SMTP_GUIDE.md) - Fast email config

- `npm run dev` - Start development server with Turbopack

## 🔧 Development Scripts

### Quote System- `npm run build` - Build for production

```bash

# Development- Professional PDF quote generation- `npm start` - Start production server

npm run dev              # Start dev server with Turbopack

npm run build            # Build for production- Customizable quote templates- `npm run lint` - Run ESLint

npm start                # Start production server

npm run lint             # Run ESLint- Company branding integration



# Database- Terms and conditions management### Project Structure

npx prisma generate      # Generate Prisma client

npx prisma migrate dev   # Run migrations- Development phase breakdown

npx prisma studio        # Open database GUI

npm run db:seed          # Seed database- Save drafts and generate quotes```

```

src/

## ⚡ Performance Optimizations

### Client Management├── app/

- ✅ **Bundle Size**: 64% reduction (500KB → 180KB)

- ✅ **Load Time**: 56% faster (3.2s → 1.4s)- Client database│   ├── about/              # About page

- ✅ **Database**: 21 strategic indexes, 70% faster queries

- ✅ **Caching**: Smart API route caching- Contact information│   ├── admin/              # Admin dashboard pages

- ✅ **Security**: CSP, HSTS, XSS protection headers

- ✅ **Images**: Next.js Image optimization- Project history│   ├── api/                # API routes



## 🐛 Troubleshooting- Communication tracking│   │   ├── analytics/      # Analytics endpoint



### Build Errors│   │   ├── clients/        # Client management



**Error**: `@react-pdf/renderer can't be external`### Analytics│   │   ├── contact/        # Contact form handler

- **Fix**: Already configured in `next.config.js` with `transpilePackages`

- Performance metrics│   │   └── projects/       # Project management

**Error**: `Prisma client not generated`

- **Fix**: Run `npx prisma generate` or check `postinstall` script- Revenue analytics│   ├── contact/            # Contact page



### Database Connection- Project completion rates│   ├── portfolio/          # Portfolio page



**Error**: `Can't reach database server`- Client acquisition data│   ├── services/           # Services page

- **Fix**: Check Neon database is active (free tier sleeps after inactivity)

- Visit Neon console to wake up database│   ├── globals.css         # Global styles

- Verify `DATABASE_URL` includes `?sslmode=require`

## 📚 Documentation│   ├── layout.tsx          # Root layout

### Deployment Issues

│   └── page.tsx            # Home page

**Error**: `Build failed on Render`

- Check build logs in Render dashboardComprehensive documentation is organized in the `docs/` directory:├── components/

- Verify all environment variables are set

- Ensure GitHub repo is connected│   ├── layout/             # Layout components



See [RENDER_DATABASE_FIX.md](docs/deployment/RENDER_DATABASE_FIX.md) for detailed troubleshooting.### Deployment│   │   └── Navbar.tsx      # Navigation component



## 🤝 Contributing- [Render Deployment Guide](docs/deployment/RENDER_DEPLOYMENT.md) - Complete Render.com deployment instructions│   └── ui/                 # UI components



1. Fork the repository- [Environment Setup](docs/deployment/RENDER_ENV_SETUP.md) - Environment variables configuration│       ├── Button.tsx      # Button component

2. Create a feature branch (`git checkout -b feature/AmazingFeature`)

3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)- [Database Fixes](docs/deployment/RENDER_DATABASE_FIX.md) - Database connection troubleshooting│       ├── Card.tsx        # Card component

4. Push to the branch (`git push origin feature/AmazingFeature`)

5. Open a Pull Request- [Deployment Ready Checklist](docs/deployment/DEPLOYMENT_READY.md) - Pre-deployment verification│       ├── Input.tsx       # Input component



## 📄 License│       ├── Modal.tsx       # Modal component



This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.### Features│       └── Textarea.tsx    # Textarea component



## 🙏 Acknowledgments- [GitHub Integration](docs/features/GITHUB_INTEGRATION_GUIDE.md) - Auto-import projects from GitHub repos└── lib/



- Built with [Next.js](https://nextjs.org/)- [Authentication System](docs/features/AUTHENTICATION_COMPLETE.md) - NextAuth.js implementation    └── utils.ts            # Utility functions

- Database by [Neon](https://neon.tech)

- Deployed on [Render](https://render.com)- [Advanced Navbar](docs/features/ADVANCED_NAVBAR_COMPLETE.md) - Navigation component guide```

- UI powered by [Tailwind CSS](https://tailwindcss.com/)

- Authentication by [NextAuth.js](https://next-auth.js.org/)- [Pricing Calculator](docs/features/PRICING_CALCULATOR_COMPLETE.md) - Dynamic pricing tool



## 📞 Support- [Quotation System](docs/features/QUOTATION_SYSTEM.md) - Quote generation and management### Environment Variables



For questions or support:- [PDF Redesign](docs/features/PDF_REDESIGN_COMPLETE.md) - PDF generation system

- 📧 Email: microailabs@outlook.com

- 🐛 Issues: [GitHub Issues](https://github.com/FyliaCare/MicroAI/issues)Create a `.env.local` file for environment-specific configurations:

- 📖 Docs: See `/docs` directory

- 💬 Discussions: [GitHub Discussions](https://github.com/FyliaCare/MicroAI/discussions)### Setup Guides



---- [Email Setup](docs/guides/EMAIL_SETUP.md) - Email configuration guide```env



<p align="center">- [Gmail SMTP Setup](docs/guides/GMAIL_SETUP_FINAL.md) - Gmail SMTP configurationNEXT_PUBLIC_APP_URL=http://localhost:3000

  <strong>MicroAI Systems Platform</strong> - Professional web solutions for modern businesses.

</p>- [Quick SMTP Guide](docs/guides/QUICK_SMTP_GUIDE.md) - Quick email setup# Add database connection strings



<p align="center">- [Auth Deployment](docs/guides/AUTH_DEPLOYMENT_GUIDE.md) - Authentication deployment# Add API keys

  Built with ❤️ by MicroAI Systems

</p># Add other configuration variables


## 🛠️ Development```



### Available Scripts## 🚀 Deployment



- `npm run dev` - Start development server with Turbopack### Vercel (Recommended)

- `npm run build` - Build for production1. Push your code to GitHub

- `npm start` - Start production server2. Connect your repository to Vercel

- `npm run lint` - Run ESLint3. Deploy automatically

- `npx prisma studio` - Open Prisma database GUI

- `npx prisma migrate dev` - Run database migrations### Other Platforms

- Build the project: `npm run build`

### Project Structure- Start the production server: `npm start`



```## 🔧 Customization

src/

├── app/### Branding

│   ├── about/              # About page- Update company name in `src/app/layout.tsx`

│   ├── admin/              # Admin dashboard pages- Modify colors in `tailwind.config.js`

│   ├── api/                # API routes- Replace placeholder content in pages

│   │   ├── admin/          # Admin API endpoints

│   │   ├── auth/           # Authentication### Features

│   │   └── contact/        # Contact form handler- Add new API routes in `src/app/api/`

│   ├── contact/            # Contact page- Create new pages in `src/app/`

│   ├── portfolio/          # Portfolio page- Add components in `src/components/`

│   ├── pricing/            # Pricing calculator

│   ├── services/           # Services page### Database Integration

│   ├── globals.css         # Global styles- Add database connection in API routes

│   ├── layout.tsx          # Root layout- Install database drivers (MongoDB, PostgreSQL, etc.)

│   └── page.tsx            # Home page- Update API routes to use real data

├── components/

│   ├── admin/              # Admin components## 📝 Next Steps

│   ├── auth/               # Auth components

│   ├── layout/             # Layout components1. **Database Setup**: Connect to a real database (MongoDB, PostgreSQL, MySQL)

│   └── ui/                 # UI components2. **Authentication**: Implement user authentication for the admin panel

├── lib/3. **Email Integration**: Add contact form and notification emails

│   ├── auth.ts             # Auth configuration4. **Payment Processing**: Integrate payment gateways for services

│   ├── prisma.ts           # Prisma client5. **Advanced Analytics**: Add detailed reporting and charts

│   └── utils.ts            # Utility functions6. **Content Management**: Add CMS for easy content updates

└── types/                  # TypeScript types

```## 🤝 Support



## 🚀 DeploymentFor questions, issues, or feature requests:

- Review the code documentation

The platform is configured for deployment on Render.com with:- Check the API endpoints

- Automatic builds from GitHub- Modify components as needed

- PostgreSQL database (Neon)- Extend functionality based on business requirements

- Environment variable management

- Database connection retry logic## 📄 License

- Production optimizations

MIT License - feel free to use this project for your business needs.

See [docs/deployment/RENDER_DEPLOYMENT.md](docs/deployment/RENDER_DEPLOYMENT.md) for detailed instructions.

---

## 🔧 Performance Optimizations

**MicroAI Platform** - Professional web solutions for modern businesses.#   F o r c e   r e b u i l d   f o r   S e n d G r i d   f i x 

- **Bundle Size**: Reduced by 64% (500KB → 180KB) 

- **Load Time**: Improved by 56% (3.2s → 1.4s) #   G m a i l   S M T P   C o n f i g u r a t i o n   -   B u i l d   2 0 2 5 1 0 2 3 - 1 3 1 8 5 8 

- **Database**: 21 strategic indexes for 70% faster queries 

- **Caching**: Smart caching strategy for API routes 
- **Security**: CSP, HSTS, XSS protection headers
- **Images**: Next.js Image optimization
- **Fonts**: Optimized font loading

## 📝 Next Steps

1. **Production Deployment**: Deploy to Render.com
2. **Email Notifications**: Configure transactional emails
3. **Payment Processing**: Integrate payment gateways
4. **Advanced Analytics**: Add detailed reporting and charts
5. **Content Management**: Expand CMS capabilities
6. **Mobile App**: Consider React Native companion app

## 🤝 Support

For questions, issues, or feature requests:
- Review the documentation in `docs/`
- Check the API endpoints
- Modify components as needed
- Extend functionality based on business requirements

## 📄 License

MIT License - feel free to use this project for your business needs.

---

**MicroAI Systems Platform** - Professional web solutions for modern businesses.
