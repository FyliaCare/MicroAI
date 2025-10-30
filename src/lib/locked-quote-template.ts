/**
 * PROFESSIONAL LOCKED QUOTE TEMPLATE
 * 
 * This is a hardcore professional template with fixed sections.
 * Only pricing, items, and specific client details can be customized through UI.
 * All other content (company profile, expertise, process, terms) is locked in code.
 * 
 * This ensures:
 * - Consistent professional branding
 * - No accidental removal of important sections
 * - Complete, sophisticated quotes every time
 */

import jsPDF from 'jspdf';
import { getStandardPricingItems, getStandardRecurringCosts } from './quote-defaults';

// ==================== LOCKED CONTENT (CODE-LEVEL ONLY) ====================

const LOCKED_COMPANY = {
  name: 'MicroAI Systems',
  tagline: 'Enterprise-Grade Web Solutions',
  email: 'sales@microaisystems.com',
  phone: '+233 244486837 | +233 544230568',
  address: 'BR253 Pasture St. Takoradi, Ghana',
  website: 'www.microaisystems.com',
  
  // Professional company description
  about: `MicroAI Systems is a premier web development company specializing in enterprise-grade digital solutions. With a proven track record of delivering cutting-edge web applications, e-commerce platforms, and AI-powered business tools, we transform complex business requirements into elegant, scalable software solutions.

Our team combines technical excellence with business acumen to deliver projects that not only meet specifications but exceed expectations. We pride ourselves on transparent communication, agile methodologies, and long-term partnership with our clients.`,

  // Core expertise areas with detailed descriptions
  expertise: [
    {
      title: 'Web Development',
      description: 'Full-stack web development using modern frameworks including React, Next.js, Node.js, and TypeScript. We specialize in building scalable, high-performance web applications with responsive design, real-time features, and seamless API integrations. Our development approach ensures clean, maintainable code, comprehensive testing, and optimal performance across all devices and browsers.',
    },
    {
      title: 'Web Design',
      description: 'User-centric design that seamlessly combines aesthetics with functionality. We create comprehensive design systems from initial wireframes to high-fidelity prototypes. Our design process includes user research, information architecture, interactive mockups, and brand-consistent visual design. We focus on creating intuitive interfaces that not only look stunning but also drive engagement, conversions, and deliver exceptional user experiences.',
    },
    {
      title: 'Web Tools & Automation',
      description: 'Custom business tools and intelligent automation solutions that streamline your operations and boost productivity. We develop internal dashboards, CRM systems, inventory management tools, and workflow automation platforms. Our solutions integrate with your existing systems, automate repetitive tasks, provide real-time analytics, and give you complete control over your business processes with intuitive interfaces and powerful features.',
    },
    {
      title: 'SaaS Development',
      description: 'End-to-end SaaS platform development with enterprise-grade features including subscription management, multi-tenancy architecture, payment gateway integration, user authentication, and role-based access control. We build scalable cloud infrastructure, implement automated billing systems, create admin dashboards, and develop API ecosystems. Our solutions are designed to grow with your business and turn your innovative idea into a profitable, sustainable software business.',
    },
  ],

  // Why choose us section
  whyChooseUs: [
    {
      title: 'Technical Excellence',
      description: 'Our developers are experts in modern frameworks and best practices, ensuring robust, maintainable code.',
    },
    {
      title: 'Agile Methodology',
      description: 'We use iterative development with regular check-ins, keeping you informed and involved throughout.',
    },
    {
      title: 'Proven Track Record',
      description: 'Successfully delivered 100+ projects across various industries with 98% client satisfaction rate.',
    },
    {
      title: 'Post-Launch Support',
      description: 'We don\'t disappear after launch. Comprehensive support and maintenance packages available.',
    },
  ],

  // Development process
  process: [
    {
      step: 1,
      title: 'Discovery & Planning',
      description: 'We analyze your requirements, research your market, and create a detailed technical specification.',
      duration: '1-2 weeks',
    },
    {
      step: 2,
      title: 'Design & Architecture',
      description: 'UI/UX design mockups, database architecture, and system design are created and approved.',
      duration: '1-2 weeks',
    },
    {
      step: 3,
      title: 'Development Sprints',
      description: 'Agile development in 2-week sprints with regular demos and feedback sessions.',
      duration: 'Varies',
    },
    {
      step: 4,
      title: 'Quality Assurance',
      description: 'Comprehensive testing including functionality, security, performance, and user acceptance testing.',
      duration: '1-2 weeks',
    },
    {
      step: 5,
      title: 'Deployment & Training',
      description: 'Production deployment, team training, documentation delivery, and knowledge transfer.',
      duration: '1 week',
    },
  ],
};

// Comprehensive locked terms & conditions
const LOCKED_TERMS = {
  title: 'TERMS & CONDITIONS',
  
  clauses: [
    {
      number: 1,
      title: 'PROJECT SCOPE',
      content: 'The scope of work is limited to items explicitly mentioned in the "Deliverables" section of this quotation. Any additional features, modifications, or requests outside the agreed scope will be subject to a separate quotation and require written approval from both parties before commencement.',
    },
    {
      number: 2,
      title: 'PAYMENT TERMS',
      content: 'Payment must be made according to the schedule outlined in the "Payment Schedule" section. All payments are due within 7 days of invoice date unless otherwise agreed. Late payments will incur interest at 5% per month on outstanding amounts. MicroAI Systems reserves the right to suspend work on overdue accounts until payment is received.',
    },
    {
      number: 3,
      title: 'PROJECT TIMELINE',
      content: 'The estimated timeline is contingent upon timely receipt of all required materials, content, feedback, and approvals from the client. Delays in client responses or provision of materials may extend the delivery date proportionally. Major scope changes may require timeline renegotiation.',
    },
    {
      number: 4,
      title: 'CLIENT RESPONSIBILITIES',
      content: 'Client agrees to: (a) Provide all necessary materials including content, images, logos, and branding assets within agreed timeframes; (b) Designate a primary point of contact with decision-making authority; (c) Provide timely feedback and approvals at each milestone; (d) Grant access to necessary third-party services, accounts, and credentials; (e) Review and approve deliverables within 5 business days of submission.',
    },
    {
      number: 5,
      title: 'INTELLECTUAL PROPERTY',
      content: 'Upon receipt of full payment, all custom code, design work, and documentation created specifically for this project becomes the sole property of the client. However, MicroAI Systems retains rights to: (a) Use the project as a portfolio piece unless a separate NDA prohibits this; (b) Reuse general programming techniques, algorithms, and non-project-specific code; (c) Third-party libraries, frameworks, and open-source components remain under their respective licenses.',
    },
    {
      number: 6,
      title: 'REVISIONS & CHANGE REQUESTS',
      content: 'Each milestone includes two rounds of revisions within the defined scope. Additional revisions or out-of-scope changes will be billed at $75/hour. Major feature additions or scope changes will require a new quotation and may affect the project timeline.',
    },
    {
      number: 7,
      title: 'HOSTING & DEPLOYMENT',
      content: 'Unless otherwise specified, the quoted price includes initial deployment setup. The client is responsible for ongoing hosting costs. We recommend and can arrange cloud hosting on AWS, Azure, or similar platforms. First month of hosting is included; subsequent months will be billed separately or managed directly by the client.',
    },
    {
      number: 8,
      title: 'WARRANTY & SUPPORT',
      content: 'MicroAI Systems provides a 30-day warranty covering bugs and functionality issues related to work delivered under this agreement. This warranty covers defects in the delivered work only, not issues arising from: third-party services, client modifications, hosting problems, or new feature requests. Extended support and maintenance packages are available separately.',
    },
    {
      number: 9,
      title: 'CONFIDENTIALITY',
      content: 'Both parties agree to maintain confidentiality of all proprietary information shared during the project. MicroAI Systems will not disclose client data, business strategies, or technical specifications to third parties without written consent. All team members are bound by confidentiality agreements.',
    },
    {
      number: 10,
      title: 'TESTING & ACCEPTANCE',
      content: 'Client will have the opportunity to review and test all deliverables in a staging environment. Written approval or 5 business days without objection constitutes acceptance. Issues identified within the warranty period will be addressed at no additional cost if within the original scope.',
    },
    {
      number: 11,
      title: 'TERMINATION',
      content: 'Either party may terminate this agreement with 14 days written notice. Upon termination: (a) Client will be invoiced for all work completed to date; (b) MicroAI Systems will deliver all work in progress in its current state; (c) Client will pay for any non-refundable third-party costs incurred; (d) Source code and IP rights will only transfer upon full payment of outstanding invoices.',
    },
    {
      number: 12,
      title: 'LIMITATION OF LIABILITY',
      content: 'MicroAI Systems\' total liability under this agreement is limited to the total amount paid by the client for the project. We are not liable for: indirect, consequential, or punitive damages; loss of business, revenue, or data; costs of substitute services; or damages arising from client misuse of the delivered product.',
    },
    {
      number: 13,
      title: 'FORCE MAJEURE',
      content: 'Neither party shall be liable for delays or failures in performance resulting from acts beyond reasonable control, including natural disasters, war, terrorism, pandemics, labor disputes, or government actions.',
    },
    {
      number: 14,
      title: 'COMPLIANCE & STANDARDS',
      content: 'All work will be developed following industry best practices and standards including: responsive design for modern browsers, WCAG 2.1 accessibility guidelines (Level AA where applicable), GDPR compliance for data handling, and secure coding practices to prevent common vulnerabilities.',
    },
    {
      number: 15,
      title: 'QUOTE VALIDITY',
      content: 'This quotation is valid for 30 days from the date of issue. Prices are subject to change after this period. To proceed, a signed copy of this quote and the initial deposit are required.',
    },
  ],
};

// Standard assumptions that apply to all projects
const LOCKED_ASSUMPTIONS = {
  title: 'PROJECT ASSUMPTIONS',
  items: [
    'Client will provide all necessary content (text, images, videos) in final, approved formats with proper licensing rights.',
    'One primary point of contact will be designated by the client with authority to make decisions and provide approvals.',
    'Client will provide timely feedback within 5 business days of each milestone submission to maintain project timeline.',
    'Project requirements and specifications will remain stable after approval; major changes will require scope adjustment.',
    'Client will provide access to all necessary third-party accounts, APIs, services, and credentials required for integrations.',
    'Development will use a staging environment accessible to the client for review before production deployment.',
    'Browser compatibility will target the latest two versions of Chrome, Firefox, Safari, and Edge.',
    'The website/application will be fully responsive and optimized for desktop (1920px+), tablet (768px-1024px), and mobile (375px-767px) devices.',
    'All third-party services and APIs used will remain available and maintain their current pricing and terms.',
    'Client has the legal right to use all provided content, branding materials, and has necessary business licenses.',
    'SSL certificate and domain name will be provided by the client or arranged through us at additional cost.',
    'Any copywriting or content creation beyond provided materials will be billed separately.',
    'Backend/admin training will be provided for up to 2 team members; additional training sessions available upon request.',
    'Source code will be delivered via GitHub or similar version control platform with full commit history.',
    'Final payment and any outstanding change requests must be completed before production deployment.',
  ],
};

// Professional services overview
const LOCKED_SERVICES = {
  title: 'WHAT\'S INCLUDED',
  categories: [
    {
      category: 'Design & User Experience',
      items: [
        'User research and persona development',
        'Wireframing and user flow diagrams',
        'High-fidelity mockups for all page types',
        'Mobile-responsive design for all devices',
        'Brand-consistent visual design',
        'Interactive prototypes for approval',
      ],
    },
    {
      category: 'Development & Engineering',
      items: [
        'Clean, well-documented source code',
        'Responsive frontend development',
        'Backend API and database architecture',
        'Third-party service integrations',
        'Security implementation and SSL setup',
        'Performance optimization and caching',
      ],
    },
    {
      category: 'Quality Assurance',
      items: [
        'Comprehensive functionality testing',
        'Cross-browser compatibility testing',
        'Mobile device testing',
        'Security vulnerability scanning',
        'Performance and load testing',
        'User acceptance testing (UAT)',
      ],
    },
    {
      category: 'Deployment & Handover',
      items: [
        'Production deployment and configuration',
        'Domain and SSL certificate setup',
        'Database migration and optimization',
        'Admin/team training session',
        'Complete technical documentation',
        'Source code delivery via GitHub',
        '30 days of post-launch bug fixes',
      ],
    },
  ],
};

// ==================== PDF GENERATOR ====================

export function generateProfessionalLockedTemplate(doc: jsPDF, quoteData: any) {
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;
  let currentPage = 1;

  // Brand colors
  const primaryColor: [number, number, number] = [25, 25, 112]; // Midnight Blue
  const accentColor: [number, number, number] = [0, 123, 255]; // Professional Blue
  const goldAccent: [number, number, number] = [255, 193, 7]; // Gold
  const lightGray: [number, number, number] = [245, 245, 250];
  const mediumGray: [number, number, number] = [200, 200, 200];
  const darkText: [number, number, number] = [50, 50, 50];

  // Helper functions
  const addPage = () => {
    doc.addPage();
    currentPage++;
    y = margin;
    addPageHeader();
    y = margin + 25;
  };

  const checkPage = (spaceNeeded: number) => {
    if (y + spaceNeeded > pageHeight - 25) {
      addPage();
    }
  };

  const addPageHeader = () => {
    if (currentPage > 1) {
      // Header bar
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 20, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(LOCKED_COMPANY.name, margin, 12);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Quote ${quoteData.quoteNumber}`, pageWidth - margin, 12, { align: 'right' });
    }
  };

  const addPageFooter = () => {
    const footerY = pageHeight - 12;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(
      `${LOCKED_COMPANY.name} | ${LOCKED_COMPANY.email} | ${LOCKED_COMPANY.phone} | ${LOCKED_COMPANY.website}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );
    doc.text(`Page ${currentPage}`, pageWidth - margin, footerY, { align: 'right' });
  };

  const wrapText = (text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testWidth = doc.getTextWidth(testLine);
      
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency;
    return `${symbol}${amount.toFixed(2)}`;
  };

  const formatDate = (date: any): string => {
    if (!date) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // ==================== PAGE 1: COVER & INTRO ====================
  
  // Top accent bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Company name and tagline
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(LOCKED_COMPANY.name, margin, 25);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(LOCKED_COMPANY.tagline, margin, 35);
  
  // Gold accent line
  doc.setDrawColor(...goldAccent);
  doc.setLineWidth(3);
  doc.line(margin, 40, margin + 60, 40);
  
  y = 65;
  
  // QUOTATION title
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('QUOTATION', margin, y);
  
  y += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  doc.text(`Quote Number: ${quoteData.quoteNumber}`, margin, y);
  y += 6;
  doc.text(`Date: ${formatDate(quoteData.issuedAt || quoteData.createdAt)}`, margin, y);
  y += 6;
  if (quoteData.validUntil) {
    doc.text(`Valid Until: ${formatDate(quoteData.validUntil)}`, margin, y);
    y += 6;
  }
  
  y += 15;
  
  // Client and Company info in two columns
  const colWidth = (contentWidth - 15) / 2;
  
  // CLIENT INFORMATION
  doc.setFillColor(...lightGray);
  doc.roundedRect(margin, y, colWidth, 60, 3, 3, 'F');
  
  let clientY = y + 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('CLIENT INFORMATION', margin + 5, clientY);
  
  clientY += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkText);
  doc.text(quoteData.clientName || 'Client Name', margin + 5, clientY);
  
  clientY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  if (quoteData.clientCompany) {
    doc.text(quoteData.clientCompany, margin + 5, clientY);
    clientY += 4;
  }
  if (quoteData.clientEmail) {
    doc.text(quoteData.clientEmail, margin + 5, clientY);
    clientY += 4;
  }
  if (quoteData.clientPhone) {
    doc.text(quoteData.clientPhone, margin + 5, clientY);
    clientY += 4;
  }
  if (quoteData.clientAddress) {
    const addrLines = wrapText(quoteData.clientAddress, colWidth - 10);
    addrLines.forEach(line => {
      doc.text(line, margin + 5, clientY);
      clientY += 4;
    });
  }
  
  // PREPARED BY
  const companyX = margin + colWidth + 15;
  doc.setFillColor(...primaryColor);
  doc.roundedRect(companyX, y, colWidth, 60, 3, 3, 'F');
  
  let companyY = y + 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('PREPARED BY', companyX + 5, companyY);
  
  companyY += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(LOCKED_COMPANY.name, companyX + 5, companyY);
  
  companyY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(LOCKED_COMPANY.email, companyX + 5, companyY);
  companyY += 4;
  doc.text(LOCKED_COMPANY.phone, companyX + 5, companyY);
  companyY += 4;
  doc.text(LOCKED_COMPANY.address, companyX + 5, companyY);
  companyY += 4;
  doc.text(LOCKED_COMPANY.website, companyX + 5, companyY);
  
  y += 70;
  
  // PROJECT TITLE
  checkPage(30);
  doc.setFillColor(...accentColor);
  doc.roundedRect(margin, y, contentWidth, 25, 3, 3, 'F');
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(quoteData.title || 'Project Quotation', margin + 5, y + 10);
  
  if (quoteData.description) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const descLines = wrapText(quoteData.description, contentWidth - 10);
    let descY = y + 16;
    descLines.slice(0, 2).forEach(line => {
      doc.text(line, margin + 5, descY);
      descY += 4;
    });
  }
  
  y += 35;
  
  // ABOUT MICROAI SYSTEMS
  checkPage(50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('ABOUT MICROAI SYSTEMS', margin, y);
  
  y += 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  
  // Split paragraphs and add extra spacing between them
  const aboutParagraphs = LOCKED_COMPANY.about.split('\n\n');
  aboutParagraphs.forEach((paragraph, pIndex) => {
    const aboutLines = wrapText(paragraph.trim(), contentWidth);
    aboutLines.forEach(line => {
      checkPage(5);
      doc.text(line, margin, y);
      y += 5;
    });
    // Add extra spacing between paragraphs
    if (pIndex < aboutParagraphs.length - 1) {
      y += 3;
    }
  });
  
  y += 10;
  
  // OUR EXPERTISE (professional list format with enhanced spacing)
  checkPage(80);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('OUR CORE EXPERTISE', margin, y);
  
  y += 8;
  doc.setDrawColor(...goldAccent);
  doc.setLineWidth(2);
  doc.line(margin, y, margin + 70, y);
  
  y += 15;
  
  // Display expertise as a vertical list with enhanced spacing
  LOCKED_COMPANY.expertise.forEach((item: any, index: number) => {
    checkPage(35);
    
    // Service number badge and title
    doc.setFillColor(...accentColor);
    doc.circle(margin + 4, y + 2, 3.5, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text((index + 1).toString(), margin + 4, y + 3.5, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(item.title, margin + 12, y + 3);
    
    y += 10;
    
    // Service description with enhanced background and border
    doc.setFillColor(248, 250, 255);
    doc.setDrawColor(220, 230, 245);
    doc.setLineWidth(0.5);
    const descLines = wrapText(item.description, contentWidth - 12);
    const descHeight = descLines.length * 4.5 + 6;
    doc.roundedRect(margin + 4, y - 3, contentWidth - 4, descHeight, 3, 3, 'FD');
    
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    let descY = y + 1;
    descLines.forEach((line: string) => {
      doc.text(line, margin + 8, descY);
      descY += 4.5;
    });
    
    y = descY + 8;
  });
  
  y += 5;
  
  addPageFooter();
  
  // ==================== PAGE 2: DELIVERABLES & PRICING ====================
  addPage();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('PROJECT DELIVERABLES & INVESTMENT', margin, y);
  
  y += 10;
  doc.setDrawColor(...goldAccent);
  doc.setLineWidth(2);
  doc.line(margin, y, margin + 80, y);
  
  y += 12;
  
  // Deliverables table - Use standard pricing breakdown if no custom items provided
  let items = quoteData.items || [];
  
  // If no items provided, use standard pricing breakdown
  if (items.length === 0 && quoteData.total && quoteData.total > 0) {
    items = getStandardPricingItems(quoteData.total);
  }
  
  if (items.length > 0) {
    // Table header
    doc.setFillColor(...primaryColor);
    doc.rect(margin, y, contentWidth, 10, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('DESCRIPTION', margin + 3, y + 7);
    doc.text('QTY', margin + contentWidth - 70, y + 7);
    doc.text('UNIT PRICE', margin + contentWidth - 50, y + 7);
    doc.text('AMOUNT', margin + contentWidth - 3, y + 7, { align: 'right' });
    
    y += 10;
    
    // Table rows with detailed descriptions
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkText);
    
    items.forEach((item: any, index: number) => {
      // Check if we need more space (name + 2 lines description = ~18px)
      checkPage(20);
      
      const bgColor: [number, number, number] = index % 2 === 0 ? [255, 255, 255] : lightGray;
      const hasDescription = item.description && item.description !== item.name;
      const rowHeight = hasDescription ? 18 : 12;
      
      doc.setFillColor(...bgColor);
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
      
      // Item name (bold)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(item.name || 'Item', margin + 3, y + 5);
      
      // Item description (smaller, wrapped text)
      if (hasDescription) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(80, 80, 80);
        const descLines = wrapText(item.description, contentWidth - 90);
        doc.text(descLines[0], margin + 3, y + 9);
        if (descLines.length > 1) {
          doc.text(descLines[1], margin + 3, y + 12.5);
        }
        if (descLines.length > 2) {
          doc.text(descLines[2], margin + 3, y + 16);
        }
        doc.setTextColor(...darkText);
      }
      
      // Quantity (center-aligned)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const qtyY = hasDescription ? y + 9 : y + 7;
      doc.text((item.quantity || 1).toString(), margin + contentWidth - 68, qtyY);
      
      // Unit Price
      doc.text(formatCurrency(item.unitPrice || item.price || 0, quoteData.currency), margin + contentWidth - 48, qtyY);
      
      // Amount (right-aligned, bold)
      const amount = (item.quantity || 1) * (item.unitPrice || item.price || 0);
      doc.setFont('helvetica', 'bold');
      doc.text(formatCurrency(amount, quoteData.currency), margin + contentWidth - 3, qtyY, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      
      y += rowHeight;
    });
    
    y += 5;
  }
  
  // Financial summary box
  checkPage(45);
  const summaryWidth = 70;
  const summaryX = pageWidth - margin - summaryWidth;
  
  doc.setFillColor(...lightGray);
  doc.roundedRect(summaryX, y, summaryWidth, 40, 2, 2, 'F');
  
  y += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  
  doc.text('Subtotal:', summaryX + 5, y);
  doc.text(formatCurrency(quoteData.subtotal || 0, quoteData.currency), summaryX + summaryWidth - 5, y, { align: 'right' });
  y += 6;
  
  if ((quoteData.discount || 0) > 0) {
    doc.setTextColor(220, 0, 0);
    doc.text('Discount:', summaryX + 5, y);
    doc.text(`-${formatCurrency(quoteData.discount, quoteData.currency)}`, summaryX + summaryWidth - 5, y, { align: 'right' });
    y += 6;
    doc.setTextColor(...darkText);
  }
  
  doc.text('Tax:', summaryX + 5, y);
  doc.text(formatCurrency(quoteData.tax || 0, quoteData.currency), summaryX + summaryWidth - 5, y, { align: 'right' });
  y += 8;
  
  doc.setFillColor(...primaryColor);
  doc.rect(summaryX, y - 5, summaryWidth, 12, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL:', summaryX + 5, y + 2);
  doc.text(formatCurrency(quoteData.total || 0, quoteData.currency), summaryX + summaryWidth - 5, y + 2, { align: 'right' });
  
  y += 20;
  
  addPageFooter();
  
  // ==================== PAGE 3: WHAT'S INCLUDED ====================
  addPage();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(LOCKED_SERVICES.title, margin, y);
  
  y += 10;
  doc.setDrawColor(...goldAccent);
  doc.setLineWidth(2);
  doc.line(margin, y, margin + 60, y);
  
  y += 12;
  
  LOCKED_SERVICES.categories.forEach((category) => {
    checkPage(30);
    
    // Category header
    doc.setFillColor(...accentColor);
    doc.roundedRect(margin, y, contentWidth, 8, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(category.category, margin + 5, y + 5.5);
    
    y += 12;
    
    // Category items
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    
    category.items.forEach((item) => {
      checkPage(5);
      doc.setTextColor(...goldAccent);
      doc.text('✓', margin + 3, y);
      doc.setTextColor(...darkText);
      doc.text(item, margin + 8, y);
      y += 5;
    });
    
    y += 5;
  });
  
  addPageFooter();
  
  // ==================== PAGE 4: PROCESS & TIMELINE ====================
  addPage();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('OUR DEVELOPMENT PROCESS', margin, y);
  
  y += 10;
  doc.setDrawColor(...goldAccent);
  doc.setLineWidth(2);
  doc.line(margin, y, margin + 80, y);
  
  y += 15;
  
  LOCKED_COMPANY.process.forEach((phase) => {
    checkPage(35);
    
    // Phase number circle
    doc.setFillColor(...accentColor);
    doc.circle(margin + 8, y + 5, 6, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(phase.step.toString(), margin + 8, y + 7, { align: 'center' });
    
    // Phase details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(phase.title, margin + 18, y + 4);
    
    doc.setFontSize(8.5);
    doc.setTextColor(...darkText);
    const descLines = wrapText(phase.description, contentWidth - 20);
    let phaseY = y + 10;
    descLines.forEach(line => {
      doc.text(line, margin + 18, phaseY);
      phaseY += 4;
    });
    
    y = phaseY + 8;
  });
  
  addPageFooter();
  
  // ==================== PAGE 5: PAYMENT SCHEDULE ====================
  if (quoteData.paymentTerms && quoteData.paymentTerms.length > 0) {
    addPage();
    
    // Page title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('PAYMENT SCHEDULE', margin, y);
    
    y += 10;
    doc.setDrawColor(...goldAccent);
    doc.setLineWidth(2);
    doc.line(margin, y, margin + 80, y);
    
    y += 12;
    
    // Introduction section
    doc.setFillColor(245, 248, 255);
    doc.roundedRect(margin, y, contentWidth, 28, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Payment Plan Overview', margin + 5, y + 6);
    
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const introText = `This project follows a milestone-based payment structure to ensure transparency and align payments with project progress. All payments must be received within 7 days of invoice issuance. This structured approach protects both parties and ensures smooth project delivery.`;
    const introLines = wrapText(introText, contentWidth - 10);
    let introY = y + 12;
    introLines.forEach(line => {
      doc.text(line, margin + 5, introY);
      introY += 4.5;
    });
    
    y += 32;
    
    // Project total banner
    doc.setFillColor(...accentColor);
    doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Total Project Investment:', margin + 5, y + 8);
    doc.setFontSize(14);
    doc.text(formatCurrency(quoteData.total || 0, quoteData.currency), margin + contentWidth - 5, y + 8, { align: 'right' });
    
    y += 18;
    
    // Payment breakdown header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Payment Milestones', margin, y);
    
    y += 10;
    
    // Payment cards
    quoteData.paymentTerms.forEach((term: any, index: number) => {
      checkPage(35);
      
      // Payment card with border
      doc.setDrawColor(200, 210, 230);
      doc.setLineWidth(0.5);
      doc.setFillColor(252, 253, 255);
      doc.roundedRect(margin, y, contentWidth, 28, 3, 3, 'FD');
      
      // Payment number badge (larger and more prominent)
      doc.setFillColor(...accentColor);
      doc.circle(margin + 10, y + 14, 7, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text((index + 1).toString(), margin + 10, y + 16, { align: 'center' });
      
      // Payment title
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      const paymentTitle = term.title || term.description || `Payment ${index + 1}`;
      doc.text(paymentTitle, margin + 22, y + 8);
      
      // Percentage display (simplified - just show percentage)
      if (term.percentage) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(240, 245, 255);
        doc.setDrawColor(...accentColor);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin + contentWidth - 42, y + 3, 35, 10, 2, 2, 'FD');
        doc.setTextColor(...accentColor);
        doc.text(`${term.percentage}%`, margin + contentWidth - 24.5, y + 10, { align: 'center' });
      }
      
      // Due date/milestone
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const dueText = term.dueDate || term.description || (term.title ? `Due upon: ${term.title}` : `Payment milestone ${index + 1}`);
      doc.text(dueText, margin + 22, y + 14);
      
      // Additional description (wrapped)
      if (term.description && term.title) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        const descLines = wrapText(term.description, contentWidth - 30);
        let descY = y + 19;
        descLines.slice(0, 2).forEach(line => {
          doc.text(line, margin + 22, descY);
          descY += 4;
        });
      }
      
      y += 32;
    });
    
    y += 5;
    
    // Payment terms & conditions box
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(220, 180, 80);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(120, 80, 0);
    doc.text('Important Payment Information', margin + 5, y + 7);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 70, 0);
    
    const paymentNotes = [
      '• All payments must be received within 7 days of invoice date unless otherwise agreed in writing.',
      '• Late payments may incur an interest charge of 5% per month on the outstanding balance.',
      '• Project work may be suspended if payment is not received within the agreed timeframe.',
      '• Final deliverables and source code will be released only after full payment is received.',
      '• Accepted payment methods: Bank transfer, Credit/Debit card, Mobile money (details in invoice).',
    ];
    
    let noteY = y + 13;
    paymentNotes.forEach(note => {
      const noteLines = wrapText(note, contentWidth - 10);
      noteLines.forEach(line => {
        doc.text(line, margin + 5, noteY);
        noteY += 4;
      });
    });
    
    y += 42;
    
    // Contact for payment queries
    doc.setFillColor(245, 250, 255);
    doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 120);
    doc.text('Payment queries? Contact us at:', margin + 5, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accentColor);
    doc.text(`${LOCKED_COMPANY.email} | ${LOCKED_COMPANY.phone}`, margin + 5, y + 9);
    
    addPageFooter();
  }
  
  // ==================== PAGE 6+: TERMS & CONDITIONS ====================
  addPage();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(LOCKED_TERMS.title, margin, y);
  
  y += 10;
  doc.setDrawColor(...goldAccent);
  doc.setLineWidth(2);
  doc.line(margin, y, margin + 80, y);
  
  y += 12;
  
  LOCKED_TERMS.clauses.forEach((clause) => {
    checkPage(20);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(`${clause.number}. ${clause.title}`, margin, y);
    
    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    
    const contentLines = wrapText(clause.content, contentWidth);
    contentLines.forEach(line => {
      checkPage(4);
      doc.text(line, margin, y);
      y += 4;
    });
    
    y += 6;
  });
  
  addPageFooter();
  
  // ==================== ASSUMPTIONS PAGE ====================
  addPage();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(LOCKED_ASSUMPTIONS.title, margin, y);
  
  y += 10;
  doc.setDrawColor(...goldAccent);
  doc.setLineWidth(2);
  doc.line(margin, y, margin + 60, y);
  
  y += 12;
  
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  
  LOCKED_ASSUMPTIONS.items.forEach((assumption, index) => {
    checkPage(8);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}.`, margin, y);
    
    doc.setFont('helvetica', 'normal');
    const assumptionLines = wrapText(assumption, contentWidth - 10);
    doc.text(assumptionLines[0], margin + 7, y);
    
    let assumptionY = y + 4;
    for (let i = 1; i < assumptionLines.length; i++) {
      doc.text(assumptionLines[i], margin + 7, assumptionY);
      assumptionY += 4;
    }
    
    y = assumptionY + 2;
  });
  
  y += 15;
  
  // Acceptance section
  checkPage(50);
  
  doc.setFillColor(...lightGray);
  doc.roundedRect(margin, y, contentWidth, 45, 3, 3, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('QUOTATION ACCEPTANCE', margin + 5, y + 10);
  
  y += 18;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  doc.text('By signing below, you acknowledge that you have read, understood, and agree to all terms, conditions,', margin + 5, y);
  y += 4;
  doc.text('and assumptions outlined in this quotation. Signing constitutes acceptance of this proposal.', margin + 5, y);
  
  y += 12;
  
  // Signature lines
  const sigWidth = (contentWidth - 20) / 2;
  
  doc.setDrawColor(...mediumGray);
  doc.setLineWidth(0.5);
  doc.line(margin + 5, y, margin + 5 + sigWidth, y);
  doc.line(margin + 15 + sigWidth, y, margin + 15 + sigWidth + sigWidth, y);
  
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Client Signature & Date', margin + 5, y + 4);
  doc.text(`${LOCKED_COMPANY.name} Representative & Date`, margin + 15 + sigWidth, y + 4);
  
  addPageFooter();
}
