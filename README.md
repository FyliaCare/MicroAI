# MicroAI Platform

A comprehensive full-stack web platform for MicroAI, featuring a professional company website and a complete business management system.

## 🚀 Features

### Public Website
- **Professional Company Showcase** - Modern, responsive design showcasing services
- **Service Portfolio** - Web applications, web tools, websites, and SaaS solutions
- **About Us Page** - Company mission, vision, and values
- **Services Page** - Detailed service offerings with pricing
- **Portfolio Page** - Showcase of completed projects
- **Contact Page** - Functional contact form with API integration
- **Mobile-Responsive** - Optimized for all devices
- **SEO Optimized** - Built with Next.js for excellent search engine visibility

### Management Dashboard
- **Project Management** - Track and manage all company projects
- **Client Management** - Comprehensive client database and communication tools
- **Service Management** - Manage service offerings and pricing
- **Analytics Dashboard** - Business insights and performance metrics
- **Real-time Updates** - Live dashboard with recent activity tracking

### Technical Features
- **Next.js 14** - Latest React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, utility-first styling
- **RESTful API** - Built-in API routes for data management
- **Responsive Design** - Mobile-first approach
- **Performance Optimized** - Fast loading and smooth user experience
- **Reusable Components** - Button, Card, Input, Modal, Textarea components
- **Utility Functions** - Comprehensive helper library

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Backend**: Next.js API Routes
- **Development**: ESLint, Autoprefixer
- **Deployment**: Vercel-ready configuration

## 📦 Installation

1. **Clone or download the project** (already set up in your workspace)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Quick Start

### Accessing the Platform

- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **About Page**: [http://localhost:3000/about](http://localhost:3000/about)
- **Services Page**: [http://localhost:3000/services](http://localhost:3000/services)
- **Portfolio Page**: [http://localhost:3000/portfolio](http://localhost:3000/portfolio)
- **Contact Page**: [http://localhost:3000/contact](http://localhost:3000/contact)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

### API Endpoints

- `GET /api/projects` - Retrieve all projects
- `POST /api/projects` - Create a new project
- `GET /api/clients` - Retrieve all clients
- `POST /api/clients` - Add a new client
- `GET /api/analytics` - Get business analytics data
- `POST /api/contact` - Handle contact form submissions

## 📊 Management Dashboard Features

### Overview Dashboard
- Active projects count
- Total clients count
- Revenue tracking
- Service overview
- Recent activity feed

### Project Management
- Create and track projects
- Assign clients to projects
- Monitor project status
- Set due dates and milestones

### Client Management
- Client database
- Contact information
- Project history
- Communication tracking

### Services Management
- Service catalog
- Pricing management
- Service descriptions
- Portfolio management

### Analytics
- Performance metrics
- Revenue analytics
- Project completion rates
- Client acquisition data

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/
│   ├── about/              # About page
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   │   ├── analytics/      # Analytics endpoint
│   │   ├── clients/        # Client management
│   │   ├── contact/        # Contact form handler
│   │   └── projects/       # Project management
│   ├── contact/            # Contact page
│   ├── portfolio/          # Portfolio page
│   ├── services/           # Services page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── layout/             # Layout components
│   │   └── Navbar.tsx      # Navigation component
│   └── ui/                 # UI components
│       ├── Button.tsx      # Button component
│       ├── Card.tsx        # Card component
│       ├── Input.tsx       # Input component
│       ├── Modal.tsx       # Modal component
│       └── Textarea.tsx    # Textarea component
└── lib/
    └── utils.ts            # Utility functions
```

### Environment Variables

Create a `.env.local` file for environment-specific configurations:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Add database connection strings
# Add API keys
# Add other configuration variables
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
- Build the project: `npm run build`
- Start the production server: `npm start`

## 🔧 Customization

### Branding
- Update company name in `src/app/layout.tsx`
- Modify colors in `tailwind.config.js`
- Replace placeholder content in pages

### Features
- Add new API routes in `src/app/api/`
- Create new pages in `src/app/`
- Add components in `src/components/`

### Database Integration
- Add database connection in API routes
- Install database drivers (MongoDB, PostgreSQL, etc.)
- Update API routes to use real data

## 📝 Next Steps

1. **Database Setup**: Connect to a real database (MongoDB, PostgreSQL, MySQL)
2. **Authentication**: Implement user authentication for the admin panel
3. **Email Integration**: Add contact form and notification emails
4. **Payment Processing**: Integrate payment gateways for services
5. **Advanced Analytics**: Add detailed reporting and charts
6. **Content Management**: Add CMS for easy content updates

## 🤝 Support

For questions, issues, or feature requests:
- Review the code documentation
- Check the API endpoints
- Modify components as needed
- Extend functionality based on business requirements

## 📄 License

MIT License - feel free to use this project for your business needs.

---

**MicroAI Platform** - Professional web solutions for modern businesses.