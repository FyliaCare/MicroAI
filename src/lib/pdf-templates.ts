import jsPDF from 'jspdf';

// Utility function to safely wrap text
export function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const testWidth = doc.getTextWidth(testLine);
    
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

// Safe JSON parser
export function parseJSON(str: any): any {
  if (!str) return null;
  if (typeof str === 'object') return str;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Format date
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// ====================================================================================
// TEMPLATE 1: MODERN MINIMALIST
// ====================================================================================
export function generateModernMinimalist(doc: jsPDF, quoteData: any) {
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Colors: Soft and minimal
  const primaryColor: [number, number, number] = [51, 51, 51]; // Dark gray #333
  const accentColor: [number, number, number] = [100, 100, 255]; // Soft blue
  const lightGray: [number, number, number] = [245, 245, 245]; // #F5F5F5
  const borderColor: [number, number, number] = [220, 220, 220]; // #DDD

  const addPage = () => {
    doc.addPage();
    y = margin + 10;
  };

  const checkPage = (space: number) => {
    if (y + space > pageHeight - margin) addPage();
  };

  // ===== HEADER =====
  doc.setFillColor(...lightGray);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  doc.setFontSize(32);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', margin, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(quoteData.quoteNumber || 'Q-0001', margin, 40);
  doc.text(formatDate(quoteData.createdAt || new Date()), margin, 47);

  y = 70;

  // ===== CLIENT & COMPANY INFO (Side by Side) =====
  const colWidth = (contentWidth - 10) / 2;
  
  // Client column
  doc.setFillColor(...borderColor);
  doc.rect(margin, y, colWidth, 0.5, 'F'); // Thin line
  y += 5;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('CLIENT INFORMATION', margin, y);
  y += 7;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  
  if (quoteData.clientName) {
    doc.text(quoteData.clientName, margin, y);
    y += 5;
  }
  if (quoteData.clientCompany) {
    doc.text(quoteData.clientCompany, margin, y);
    y += 5;
  }
  if (quoteData.clientEmail) {
    doc.text(quoteData.clientEmail, margin, y);
    y += 5;
  }
  if (quoteData.clientPhone) {
    doc.text(quoteData.clientPhone, margin, y);
    y += 5;
  }

  // Company column (right side)
  const companyX = margin + colWidth + 10;
  let companyY = 75;
  
  doc.setFillColor(...borderColor);
  doc.rect(companyX, companyY, colWidth, 0.5, 'F');
  companyY += 5;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('PREPARED BY', companyX, companyY);
  companyY += 7;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('MicroAI Systems', companyX, companyY);
  companyY += 5;
  doc.text('sales@microaisystems.com', companyX, companyY);
  companyY += 5;
  doc.text('+233 244486837 | +233 544230568', companyX, companyY);
  companyY += 5;
  doc.text('BR253 Pasture St. Takoradi, Ghana', companyX, companyY);

  y = Math.max(y, companyY) + 15;

  // ===== ABOUT MICROAI SYSTEMS =====
  checkPage(35);
  doc.setFillColor(250, 250, 255);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'F');
  
  y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('ABOUT MICROAI SYSTEMS', margin + 5, y);
  
  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  
  const aboutText = 'MicroAI Systems is a leading web development company specializing in custom web applications, e-commerce solutions, and AI-powered business tools. We help businesses transform their online presence through innovative technology and deliver high-quality, scalable solutions that drive business growth.';
  const aboutLines = wrapText(doc, aboutText, contentWidth - 10);
  aboutLines.forEach(line => {
    doc.text(line, margin + 5, y);
    y += 4;
  });
  
  y += 10;

  // ===== PROJECT OVERVIEW =====
  if (quoteData.description) {
    checkPage(30);
    doc.setFillColor(...borderColor);
    doc.rect(margin, y, contentWidth, 0.5, 'F');
    y += 5;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('PROJECT OVERVIEW', margin, y);
    y += 7;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    const lines = wrapText(doc, quoteData.description, contentWidth - 10);
    lines.forEach(line => {
      checkPage(5);
      doc.text(line, margin + 5, y);
      y += 5;
    });
    y += 5;
  }

  // ===== DELIVERABLES TABLE =====
  const items = parseJSON(quoteData.items) || [];
  if (items.length > 0) {
    checkPage(40);
    y += 5;
    
    doc.setFillColor(...borderColor);
    doc.rect(margin, y, contentWidth, 0.5, 'F');
    y += 5;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('DELIVERABLES', margin, y);
    y += 10;

    // Table header
    const tableX = margin;
    const descWidth = contentWidth * 0.50;
    const qtyWidth = contentWidth * 0.15;
    const priceWidth = contentWidth * 0.17;
    const totalWidth = contentWidth * 0.18;

    doc.setFillColor(...lightGray);
    doc.rect(tableX, y, contentWidth, 8, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Description', tableX + 2, y + 5);
    doc.text('Qty', tableX + descWidth + 2, y + 5);
    doc.text('Unit Price', tableX + descWidth + qtyWidth + 2, y + 5);
    doc.text('Amount', tableX + descWidth + qtyWidth + priceWidth + 2, y + 5);
    
    y += 8;

    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    items.forEach((item: any, index: number) => {
      checkPage(12);
      
      const desc = item.description || item.name || 'Service';
      const qty = item.quantity || 1;
      const unitPrice = item.unitPrice || item.price || 0;
      const amount = qty * unitPrice;

      // Row background
      if (index % 2 === 0) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(250, 250, 250);
      }
      doc.rect(tableX, y, contentWidth, 10, 'F');

      // Text with wrapping for description
      const descLines = wrapText(doc, desc, descWidth - 4);
      doc.text(descLines[0], tableX + 2, y + 6);
      doc.text(qty.toString(), tableX + descWidth + 2, y + 6);
      doc.text(formatCurrency(unitPrice, quoteData.currency), tableX + descWidth + qtyWidth + 2, y + 6);
      doc.text(formatCurrency(amount, quoteData.currency), tableX + descWidth + qtyWidth + priceWidth + 2, y + 6);

      y += 10;
    });

    // Thin border around table
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    doc.rect(tableX, y - (items.length * 10) - 8, contentWidth, (items.length * 10) + 8);
  }

  // ===== SCOPE OF WORK =====
  const scope = quoteData.scopeOfWork || [];
  if (scope.length > 0) {
    checkPage(30);
    y += 10;
    
    doc.setFillColor(...borderColor);
    doc.rect(margin, y, contentWidth, 0.5, 'F');
    y += 5;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('SCOPE OF WORK', margin, y);
    y += 7;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    scope.forEach((item: string) => {
      checkPage(7);
      doc.text('•', margin + 3, y);
      const itemLines = wrapText(doc, item, contentWidth - 15);
      doc.text(itemLines[0], margin + 8, y);
      y += 6;
    });
    y += 5;
  }

  // ===== MILESTONES =====
  const milestones = quoteData.milestones || [];
  if (milestones.length > 0) {
    checkPage(30);
    y += 5;
    
    doc.setFillColor(...borderColor);
    doc.rect(margin, y, contentWidth, 0.5, 'F');
    y += 5;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('PROJECT MILESTONES', margin, y);
    y += 10;
    
    milestones.forEach((milestone: any, index: number) => {
      checkPage(15);
      
      doc.setFillColor(250, 250, 255);
      doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
      
      // Milestone number
      doc.setFillColor(...accentColor);
      doc.circle(margin + 6, y + 6, 3, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text((index + 1).toString(), margin + 6, y + 7.5, { align: 'center' });
      
      // Milestone details
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text(milestone.title || milestone.name || `Milestone ${index + 1}`, margin + 12, y + 5);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      let details = '';
      if (milestone.duration) details += `${milestone.duration} | `;
      if (milestone.payment) details += `Payment: ${milestone.payment}`;
      if (details) doc.text(details, margin + 12, y + 9);
      
      y += 14;
    });
    y += 5;
  }

  // ===== FINANCIAL SUMMARY =====
  y += 10;
  checkPage(40);
  
  const summaryX = pageWidth - margin - 70;
  const summaryWidth = 70;
  
  doc.setFillColor(...lightGray);
  doc.roundedRect(summaryX, y, summaryWidth, 35, 2, 2, 'F');
  
  y += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  
  const subtotal = quoteData.subtotal || 0;
  const discount = quoteData.discount || 0;
  const tax = quoteData.tax || 0;
  const total = quoteData.total || subtotal - discount + tax;
  
  doc.text('Subtotal:', summaryX + 3, y);
  doc.text(formatCurrency(subtotal, quoteData.currency), summaryX + summaryWidth - 3, y, { align: 'right' });
  y += 6;
  
  if (discount > 0) {
    doc.setTextColor(200, 0, 0);
    doc.text('Discount:', summaryX + 3, y);
    doc.text(`-${formatCurrency(discount, quoteData.currency)}`, summaryX + summaryWidth - 3, y, { align: 'right' });
    y += 6;
    doc.setTextColor(80, 80, 80);
  }
  
  doc.text('Tax:', summaryX + 3, y);
  doc.text(formatCurrency(tax, quoteData.currency), summaryX + summaryWidth - 3, y, { align: 'right' });
  y += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('TOTAL:', summaryX + 3, y);
  doc.text(formatCurrency(total, quoteData.currency), summaryX + summaryWidth - 3, y, { align: 'right' });

  y += 25;

  // ===== PAYMENT TERMS =====
  const paymentTerms = quoteData.paymentTerms || [];
  if (paymentTerms.length > 0) {
    checkPage(25);
    y += 5;
    
    doc.setFillColor(...borderColor);
    doc.rect(margin, y, contentWidth, 0.5, 'F');
    y += 5;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('PAYMENT TERMS', margin, y);
    y += 7;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    paymentTerms.forEach((term: any, index: number) => {
      checkPage(7);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}.`, margin + 3, y);
      doc.setFont('helvetica', 'normal');
      
      let termText = term.title || term.description || `Payment ${index + 1}`;
      if (term.percentage) termText += ` - ${term.percentage}%`;
      if (term.amount) termText += ` (${formatCurrency(term.amount, quoteData.currency)})`;
      
      const termLines = wrapText(doc, termText, contentWidth - 15);
      doc.text(termLines[0], margin + 8, y);
      y += 6;
    });
    y += 5;
  }

  // ===== ASSUMPTIONS =====
  const assumptions = quoteData.assumptions || [];
  if (assumptions.length > 0) {
    checkPage(25);
    y += 5;
    
    doc.setFillColor(...borderColor);
    doc.rect(margin, y, contentWidth, 0.5, 'F');
    y += 5;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('ASSUMPTIONS', margin, y);
    y += 7;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    assumptions.forEach((assumption: string) => {
      checkPage(6);
      doc.text('•', margin + 3, y);
      const assumptionLines = wrapText(doc, assumption, contentWidth - 15);
      doc.text(assumptionLines[0], margin + 8, y);
      y += 5;
    });
    y += 5;
  }

  // ===== TERMS & CONDITIONS =====
  if (quoteData.terms) {
    checkPage(30);
    y += 10;
    
    doc.setFillColor(...borderColor);
    doc.rect(margin, y, contentWidth, 0.5, 'F');
    y += 5;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('TERMS & CONDITIONS', margin, y);
    y += 7;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    const termsLines = wrapText(doc, quoteData.terms, contentWidth - 10);
    termsLines.forEach(line => {
      checkPage(4);
      doc.text(line, margin + 5, y);
      y += 4;
    });
  }

  // ===== FOOTER =====
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('MicroAI Systems | www.microaisystems.com | microailabs@outlook.com | +233 244486837', pageWidth / 2, pageHeight - 10, { align: 'center' });
}

// ====================================================================================
// TEMPLATE 2: CORPORATE EXECUTIVE
// ====================================================================================
export function generateCorporateExecutive(doc: jsPDF, quoteData: any) {
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 25;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Colors: Professional navy blue theme
  const navyBlue: [number, number, number] = [19, 41, 75]; // #132A4B
  const gold: [number, number, number] = [184, 134, 11]; // #B8860B
  const lightBlue: [number, number, number] = [240, 244, 248];
  const darkText: [number, number, number] = [40, 40, 40];

  const addPage = () => {
    doc.addPage();
    
    // Add header on new pages
    doc.setFillColor(...navyBlue);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.text(quoteData.title || 'Project Quotation', margin, 10);
    doc.text(`Quote ${quoteData.quoteNumber}`, pageWidth - margin, 10, { align: 'right' });
    
    y = 25;
  };

  const checkPage = (space: number) => {
    if (y + space > pageHeight - 30) addPage();
  };

  // ===== COVER PAGE =====
  doc.setFillColor(...navyBlue);
  doc.rect(0, 0, pageWidth, 100, 'F');
  
  // Gold accent bar
  doc.setFillColor(...gold);
  doc.rect(0, 95, pageWidth, 5, 'F');
  
  doc.setFontSize(40);
  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.text('PROPOSAL', pageWidth / 2, 45, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('times', 'normal');
  doc.text(quoteData.title || 'Web Development Project', pageWidth / 2, 65, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Quote Number: ${quoteData.quoteNumber}`, pageWidth / 2, 85, { align: 'center' });

  y = 115;

  // Info box
  doc.setFillColor(...lightBlue);
  doc.roundedRect(margin, y, contentWidth, 50, 3, 3, 'F');
  
  y += 10;
  const leftCol = margin + 10;
  const rightCol = margin + (contentWidth / 2) + 10;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...gold);
  doc.text('PREPARED FOR:', leftCol, y);
  doc.text('PREPARED BY:', rightCol, y);
  
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  doc.setFontSize(9);
  
  doc.text(quoteData.clientName || 'Client Name', leftCol, y);
  doc.text('MicroAI Systems', rightCol, y);
  y += 5;
  doc.text(quoteData.clientCompany || 'Company', leftCol, y);
  doc.text('Professional Web Development', rightCol, y);
  y += 5;
  doc.text(quoteData.clientEmail || 'client@email.com', leftCol, y);
  doc.text('microailabs@outlook.com', rightCol, y);
  y += 5;
  doc.text(quoteData.clientPhone || '+233 244486837', leftCol, y);
  doc.text('+233 244486837 | +233 544230568', rightCol, y);
  
  y += 10;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${formatDate(quoteData.createdAt || new Date())}`, leftCol, y);
  doc.text(`Valid Until: ${formatDate(quoteData.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}`, rightCol, y);

  y += 25;

  // ===== EXECUTIVE SUMMARY =====
  checkPage(40);
  
  doc.setFillColor(...navyBlue);
  doc.rect(margin - 5, y, contentWidth + 10, 12, 'F');
  
  doc.setFontSize(14);
  doc.setFont('times', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('EXECUTIVE SUMMARY', pageWidth / 2, y + 8, { align: 'center' });
  
  y += 20;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  
  const execSummary = quoteData.description || 'This proposal outlines our comprehensive approach to delivering a professional web solution tailored to your business needs.';
  const summaryLines = wrapText(doc, execSummary, contentWidth - 20);
  summaryLines.forEach(line => {
    checkPage(5);
    doc.text(line, margin + 10, y);
    y += 5;
  });

  y += 15;

  // ===== PROJECT SCOPE =====
  const scope = parseJSON(quoteData.scopeOfWork);
  if (scope && scope.length > 0) {
    checkPage(30);
    
    doc.setFillColor(...gold);
    doc.rect(margin, y, 3, 10, 'F');
    
    doc.setFontSize(13);
    doc.setFont('times', 'bold');
    doc.setTextColor(...navyBlue);
    doc.text('PROJECT SCOPE', margin + 8, y + 7);
    
    y += 15;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    
    scope.forEach((item: string) => {
      checkPage(6);
      doc.setFillColor(...gold);
      doc.circle(margin + 12, y - 1.5, 1.5, 'F');
      doc.text(item, margin + 18, y);
      y += 6;
    });
    
    y += 10;
  }

  // ===== INVESTMENT BREAKDOWN =====
  const items = parseJSON(quoteData.items) || [];
  if (items.length > 0) {
    checkPage(50);
    
    doc.setFillColor(...gold);
    doc.rect(margin, y, 3, 10, 'F');
    
    doc.setFontSize(13);
    doc.setFont('times', 'bold');
    doc.setTextColor(...navyBlue);
    doc.text('INVESTMENT BREAKDOWN', margin + 8, y + 7);
    
    y += 18;

    // Professional table
    const tableX = margin;
    const descWidth = contentWidth * 0.55;
    const qtyWidth = contentWidth * 0.12;
    const priceWidth = contentWidth * 0.16;
    const totalWidth = contentWidth * 0.17;

    // Header
    doc.setFillColor(...navyBlue);
    doc.rect(tableX, y, contentWidth, 10, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('DELIVERABLE', tableX + 3, y + 6);
    doc.text('QTY', tableX + descWidth + 2, y + 6);
    doc.text('RATE', tableX + descWidth + qtyWidth + 2, y + 6);
    doc.text('AMOUNT', tableX + descWidth + qtyWidth + priceWidth + 2, y + 6);
    
    y += 10;

    // Rows
    doc.setFont('helvetica', 'normal');
    
    items.forEach((item: any, index: number) => {
      checkPage(10);
      
      if (index % 2 === 0) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(...lightBlue);
      }
      doc.rect(tableX, y, contentWidth, 9, 'F');

      doc.setTextColor(...darkText);
      doc.setFontSize(9);
      
      const desc = item.description || item.name || 'Service';
      const qty = item.quantity || 1;
      const unitPrice = item.unitPrice || item.price || 0;
      const amount = qty * unitPrice;

      const descLines = wrapText(doc, desc, descWidth - 6);
      doc.text(descLines[0], tableX + 3, y + 6);
      doc.text(qty.toString(), tableX + descWidth + 2, y + 6);
      doc.text(formatCurrency(unitPrice, quoteData.currency), tableX + descWidth + qtyWidth + 2, y + 6);
      doc.text(formatCurrency(amount, quoteData.currency), tableX + descWidth + qtyWidth + priceWidth + 2, y + 6);

      y += 9;
    });

    // Border
    doc.setDrawColor(...navyBlue);
    doc.setLineWidth(0.5);
    doc.rect(tableX, y - (items.length * 9) - 10, contentWidth, (items.length * 9) + 10);
  }

  // ===== INVESTMENT SUMMARY =====
  y += 15;
  checkPage(45);
  
  const summaryBoxWidth = 85;
  const summaryBoxX = pageWidth - margin - summaryBoxWidth;
  
  doc.setFillColor(...lightBlue);
  doc.roundedRect(summaryBoxX, y, summaryBoxWidth, 42, 2, 2, 'F');
  
  y += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  
  const subtotal = quoteData.subtotal || 0;
  const discount = quoteData.discount || 0;
  const tax = quoteData.tax || 0;
  const total = quoteData.total || subtotal - discount + tax;
  
  doc.text('Subtotal:', summaryBoxX + 5, y);
  doc.text(formatCurrency(subtotal, quoteData.currency), summaryBoxX + summaryBoxWidth - 5, y, { align: 'right' });
  y += 6;
  
  if (discount > 0) {
    doc.text('Discount:', summaryBoxX + 5, y);
    doc.text(`-${formatCurrency(discount, quoteData.currency)}`, summaryBoxX + summaryBoxWidth - 5, y, { align: 'right' });
    y += 6;
  }
  
  doc.text('Tax:', summaryBoxX + 5, y);
  doc.text(formatCurrency(tax, quoteData.currency), summaryBoxX + summaryBoxWidth - 5, y, { align: 'right' });
  y += 8;
  
  // Gold line
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.8);
  doc.line(summaryBoxX + 5, y, summaryBoxX + summaryBoxWidth - 5, y);
  y += 6;
  
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...navyBlue);
  doc.text('TOTAL INVESTMENT:', summaryBoxX + 5, y);
  doc.text(formatCurrency(total, quoteData.currency), summaryBoxX + summaryBoxWidth - 5, y, { align: 'right' });

  y += 25;

  // ===== ACCEPTANCE =====
  checkPage(40);
  
  doc.setFillColor(...navyBlue);
  doc.rect(margin - 5, y, contentWidth + 10, 12, 'F');
  
  doc.setFontSize(14);
  doc.setFont('times', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('ACCEPTANCE', pageWidth / 2, y + 8, { align: 'center' });
  
  y += 20;
  
  doc.setFillColor(...lightBlue);
  doc.roundedRect(margin, y, contentWidth, 35, 2, 2, 'F');
  
  y += 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  doc.text('By signing below, you accept this proposal and authorize MicroAI Systems to proceed with the project.', margin + 5, y);
  
  y += 15;
  const sigWidth = (contentWidth - 10) / 2;
  
  doc.setDrawColor(...navyBlue);
  doc.setLineWidth(0.5);
  doc.line(margin + 5, y, margin + 5 + sigWidth - 5, y);
  doc.line(margin + sigWidth + 10, y, pageWidth - margin - 5, y);
  
  y += 5;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Client Signature & Date', margin + 5, y);
  doc.text('MicroAI Systems Representative', margin + sigWidth + 10, y);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('MicroAI Systems | Professional Web Development Solutions', pageWidth / 2, pageHeight - 10, { align: 'center' });
}

// ====================================================================================
// TEMPLATE 3: CREATIVE AGENCY
// ====================================================================================
export function generateCreativeAgency(doc: jsPDF, quoteData: any) {
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Colors: Bold and vibrant
  const primaryPurple: [number, number, number] = [123, 31, 162]; // #7B1FA2
  const accentOrange: [number, number, number] = [255, 109, 0]; // #FF6D00
  const lightPurple: [number, number, number] = [243, 229, 245];
  const darkGray: [number, number, number] = [33, 33, 33];

  const addPage = () => {
    doc.addPage();
    y = margin + 10;
  };

  const checkPage = (space: number) => {
    if (y + space > pageHeight - 25) addPage();
  };

  // ===== COVER WITH GRADIENT SIMULATION =====
  // Top purple section
  doc.setFillColor(...primaryPurple);
  doc.rect(0, 0, pageWidth, 70, 'F');
  
  // Diagonal orange accent
  doc.setFillColor(...accentOrange);
  doc.triangle(0, 60, 0, 70, 40, 70, 'F');
  doc.triangle(pageWidth - 40, 70, pageWidth, 70, pageWidth, 60, 'F');
  
  doc.setFontSize(44);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTE', margin + 5, 40);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(quoteData.title || 'Web Development Project', margin + 5, 55);

  y = 85;

  // Colorful info cards
  doc.setFillColor(...lightPurple);
  doc.roundedRect(margin, y, contentWidth, 50, 5, 5, 'F');
  
  // Orange accent strip
  doc.setFillColor(...accentOrange);
  doc.roundedRect(margin, y, contentWidth, 8, 5, 5, 'F');
  
  y += 13;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryPurple);
  doc.text('CLIENT', margin + 10, y);
  doc.text('QUOTE DETAILS', margin + (contentWidth / 2) + 10, y);
  
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);
  
  doc.text(quoteData.clientName || 'Client Name', margin + 10, y);
  doc.text(`Number: ${quoteData.quoteNumber}`, margin + (contentWidth / 2) + 10, y);
  y += 5;
  doc.text(quoteData.clientCompany || 'Company Name', margin + 10, y);
  doc.text(`Date: ${formatDate(quoteData.createdAt || new Date())}`, margin + (contentWidth / 2) + 10, y);
  y += 5;
  doc.text(quoteData.clientEmail || 'client@email.com', margin + 10, y);
  doc.text(`Valid: 30 days`, margin + (contentWidth / 2) + 10, y);

  y += 25;

  // ===== PROJECT DESCRIPTION =====
  checkPage(30);
  
  doc.setFillColor(...accentOrange);
  doc.rect(margin - 3, y, 6, 10, 'F');
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryPurple);
  doc.text('What We\'ll Build', margin + 8, y + 7);
  
  y += 15;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);
  
  const descLines = wrapText(doc, quoteData.description || 'A modern, responsive web solution designed to elevate your brand.', contentWidth - 15);
  descLines.forEach(line => {
    checkPage(5);
    doc.text(line, margin + 8, y);
    y += 5;
  });

  y += 15;

  // ===== DELIVERABLES WITH COLORFUL BADGES =====
  const items = parseJSON(quoteData.items) || [];
  if (items.length > 0) {
    checkPage(40);
    
    doc.setFillColor(...accentOrange);
    doc.rect(margin - 3, y, 6, 10, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryPurple);
    doc.text('Deliverables & Pricing', margin + 8, y + 7);
    
    y += 18;

    items.forEach((item: any, index: number) => {
      checkPage(20);
      
      // Card background
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, y, contentWidth, 18, 3, 3, 'FD');
      
      // Color badge
      doc.setFillColor(...primaryPurple);
      doc.roundedRect(margin, y, 8, 18, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...darkGray);
      
      const desc = item.description || item.name || 'Service';
      const qty = item.quantity || 1;
      const unitPrice = item.unitPrice || item.price || 0;
      const amount = qty * unitPrice;
      
      const descLines = wrapText(doc, desc, contentWidth - 80);
      doc.text(descLines[0], margin + 12, y + 7);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Qty: ${qty}`, margin + 12, y + 13);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...accentOrange);
      doc.text(formatCurrency(amount, quoteData.currency), pageWidth - margin - 5, y + 11, { align: 'right' });
      
      y += 22;
    });
  }

  // ===== TOTAL IN BIG COLORFUL BOX =====
  y += 5;
  checkPage(35);
  
  doc.setFillColor(...primaryPurple);
  doc.roundedRect(margin, y, contentWidth, 30, 5, 5, 'F');
  
  const total = quoteData.total || 0;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL INVESTMENT', margin + 10, y + 12);
  
  doc.setFontSize(24);
  doc.setTextColor(...accentOrange);
  doc.text(formatCurrency(total, quoteData.currency), pageWidth - margin - 10, y + 20, { align: 'right' });

  y += 40;

  // ===== LET'S GET STARTED =====
  checkPage(35);
  
  doc.setFillColor(...lightPurple);
  doc.roundedRect(margin, y, contentWidth, 30, 5, 5, 'F');
  
  y += 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryPurple);
  doc.text('Ready to Get Started?', pageWidth / 2, y, { align: 'center' });
  
  y += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);
  doc.text('Approve this quote and we\'ll kick off your project immediately!', pageWidth / 2, y, { align: 'center' });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('MicroAI Systems | Creative Web Solutions', pageWidth / 2, pageHeight - 10, { align: 'center' });
}

// ====================================================================================
// TEMPLATE 4: TECH STARTUP
// ====================================================================================
export function generateTechStartup(doc: jsPDF, quoteData: any) {
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 22;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Colors: Modern tech vibes
  const techBlue: [number, number, number] = [13, 110, 253]; // #0D6EFD
  const techGreen: [number, number, number] = [25, 135, 84]; // #198754
  const bgGray: [number, number, number] = [248, 249, 250];
  const textDark: [number, number, number] = [33, 37, 41];

  const addPage = () => {
    doc.addPage();
    y = margin + 10;
  };

  const checkPage = (space: number) => {
    if (y + space > pageHeight - 25) addPage();
  };

  // ===== HEADER =====
  doc.setFillColor(...techBlue);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  doc.setFontSize(36);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', margin, 30);
  
  doc.setFillColor(...techGreen);
  doc.circle(pageWidth - 30, 25, 12, 'F');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('✓', pageWidth - 34, 30);

  y = 60;

  // Quote info bar
  doc.setFillColor(...bgGray);
  doc.rect(margin, y, contentWidth, 15, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textDark);
  doc.text(`Quote #${quoteData.quoteNumber}`, margin + 5, y + 6);
  doc.text(`|`, margin + 50, y + 6);
  doc.text(`Date: ${formatDate(quoteData.createdAt || new Date())}`, margin + 55, y + 6);
  doc.text(`|`, margin + 110, y + 6);
  doc.text(`Valid: 30 days`, margin + 115, y + 6);

  y += 25;

  // ===== CLIENT & COMPANY CARDS =====
  const cardHeight = 45;
  const cardWidth = (contentWidth - 10) / 2;
  
  // Client card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, cardWidth, cardHeight, 4, 4, 'FD');
  
  doc.setFillColor(...techBlue);
  doc.roundedRect(margin, y, cardWidth, 10, 4, 4, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('CLIENT', margin + 5, y + 7);
  
  let cardY = y + 16;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textDark);
  doc.text(quoteData.clientName || 'Client Name', margin + 5, cardY);
  cardY += 5;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(quoteData.clientCompany || 'Company', margin + 5, cardY);
  cardY += 5;
  doc.text(quoteData.clientEmail || 'email@example.com', margin + 5, cardY);
  cardY += 5;
  doc.text(quoteData.clientPhone || '+233 XX XXX XXXX', margin + 5, cardY);
  
  // Company card
  const companyX = margin + cardWidth + 10;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(companyX, y, cardWidth, cardHeight, 4, 4, 'FD');
  
  doc.setFillColor(...techGreen);
  doc.roundedRect(companyX, y, cardWidth, 10, 4, 4, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('FROM', companyX + 5, y + 7);
  
  cardY = y + 16;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textDark);
  doc.text('MicroAI Systems', companyX + 5, cardY);
  cardY += 5;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Web Development', companyX + 5, cardY);
  cardY += 5;
  doc.text('sales@microaisystems.com', companyX + 5, cardY);
  cardY += 5;
  doc.text('+233 244486837 | +233 544230568', companyX + 5, cardY);
  cardY += 5;
  doc.text('BR253 Pasture St. Takoradi, Ghana', companyX + 5, cardY);

  y += cardHeight + 20;

  // ===== PROJECT OVERVIEW =====
  checkPage(30);
  
  doc.setFillColor(...techBlue);
  doc.rect(margin, y, 4, 10, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...techBlue);
  doc.text('Project Overview', margin + 8, y + 7);
  
  y += 13;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textDark);
  
  const descLines = wrapText(doc, quoteData.description || 'Modern web development solution tailored to your needs.', contentWidth - 10);
  descLines.forEach(line => {
    checkPage(5);
    doc.text(line, margin + 5, y);
    y += 5;
  });

  y += 15;

  // ===== DELIVERABLES TABLE =====
  const items = parseJSON(quoteData.items) || [];
  if (items.length > 0) {
    checkPage(40);
    
    doc.setFillColor(...techGreen);
    doc.rect(margin, y, 4, 10, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...techGreen);
    doc.text('Deliverables', margin + 8, y + 7);
    
    y += 18;

    // Modern table
    const tableX = margin;
    const descWidth = contentWidth * 0.60;
    const priceWidth = contentWidth * 0.40;

    items.forEach((item: any, index: number) => {
      checkPage(16);
      
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.3);
      doc.roundedRect(tableX, y, contentWidth, 14, 2, 2, 'FD');
      
      // Green status indicator
      doc.setFillColor(...techGreen);
      doc.circle(tableX + 8, y + 7, 2, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textDark);
      
      const desc = item.description || item.name || 'Service';
      const qty = item.quantity || 1;
      const unitPrice = item.unitPrice || item.price || 0;
      const amount = qty * unitPrice;
      
      const descLines = wrapText(doc, desc, descWidth - 20);
      doc.text(descLines[0], tableX + 13, y + 7);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(`Quantity: ${qty}`, tableX + 13, y + 11);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...techBlue);
      doc.text(formatCurrency(amount, quoteData.currency), pageWidth - margin - 5, y + 9, { align: 'right' });
      
      y += 17;
    });
  }

  // ===== TOTAL BOX =====
  y += 10;
  checkPage(40);
  
  doc.setFillColor(...techBlue);
  doc.roundedRect(margin, y, contentWidth, 35, 5, 5, 'F');
  
  const total = quoteData.total || 0;
  const subtotal = quoteData.subtotal || 0;
  const tax = quoteData.tax || 0;
  
  y += 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('Subtotal:', margin + 10, y);
  doc.text(formatCurrency(subtotal, quoteData.currency), pageWidth - margin - 10, y, { align: 'right' });
  y += 6;
  doc.text('Tax:', margin + 10, y);
  doc.text(formatCurrency(tax, quoteData.currency), pageWidth - margin - 10, y, { align: 'right' });
  y += 10;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', margin + 10, y);
  doc.text(formatCurrency(total, quoteData.currency), pageWidth - margin - 10, y, { align: 'right' });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('MicroAI Systems | Modern Web Solutions', pageWidth / 2, pageHeight - 10, { align: 'center' });
}

// ====================================================================================
// TEMPLATE 5: PREMIUM LUXURY
// ====================================================================================
export function generatePremiumLuxury(doc: jsPDF, quoteData: any) {
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 28;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Colors: Elegant and sophisticated
  const gold: [number, number, number] = [218, 165, 32]; // #DAA520
  const deepBlack: [number, number, number] = [20, 20, 20];
  const cream: [number, number, number] = [250, 245, 235];
  const darkGray: [number, number, number] = [60, 60, 60];

  const addPage = () => {
    doc.addPage();
    
    // Elegant header
    doc.setDrawColor(...gold);
    doc.setLineWidth(1);
    doc.line(margin, 20, pageWidth - margin, 20);
    
    y = 35;
  };

  const checkPage = (space: number) => {
    if (y + space > pageHeight - 35) addPage();
  };

  // ===== ELEGANT HEADER =====
  doc.setDrawColor(...gold);
  doc.setLineWidth(2);
  doc.line(margin, 30, pageWidth - margin, 30);
  doc.line(margin, 33, pageWidth - margin, 33);
  
  doc.setFontSize(48);
  doc.setTextColor(...gold);
  doc.setFont('times', 'bold');
  doc.text('PROPOSAL', pageWidth / 2, 65, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('times', 'italic');
  doc.setTextColor(...darkGray);
  doc.text(quoteData.title || 'Bespoke Web Development', pageWidth / 2, 80, { align: 'center' });
  
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(margin + 30, 85, pageWidth - margin - 30, 85);

  y = 100;

  // Ornamental frame
  doc.setFillColor(...cream);
  doc.roundedRect(margin, y, contentWidth, 55, 8, 8, 'F');
  
  doc.setDrawColor(...gold);
  doc.setLineWidth(1.5);
  doc.roundedRect(margin, y, contentWidth, 55, 8, 8, 'D');
  
  y += 12;
  
  doc.setFontSize(10);
  doc.setFont('times', 'bold');
  doc.setTextColor(...gold);
  doc.text('PREPARED FOR', margin + 15, y);
  doc.text('PROPOSAL DATE', margin + (contentWidth / 2) + 15, y);
  
  y += 7;
  doc.setFontSize(11);
  doc.setFont('times', 'normal');
  doc.setTextColor(...deepBlack);
  doc.text(quoteData.clientName || 'Distinguished Client', margin + 15, y);
  doc.text(formatDate(quoteData.createdAt || new Date()), margin + (contentWidth / 2) + 15, y);
  
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(...darkGray);
  doc.text(quoteData.clientCompany || 'Company', margin + 15, y);
  doc.text(`Quote: ${quoteData.quoteNumber}`, margin + (contentWidth / 2) + 15, y);
  
  y += 6;
  doc.text(quoteData.clientEmail || 'client@email.com', margin + 15, y);
  doc.text(`Valid for 30 days`, margin + (contentWidth / 2) + 15, y);

  y += 25;

  // Gold accent line
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  doc.line(margin + 15, y, pageWidth - margin - 15, y);

  y += 20;

  // ===== EXECUTIVE SUMMARY =====
  checkPage(30);
  
  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.setTextColor(...gold);
  doc.text('Introduction', margin + 5, y);
  
  y += 10;
  
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.setTextColor(...deepBlack);
  
  const intro = quoteData.description || 'We present this proposal for a distinguished web development project, crafted with precision and expertise.';
  const introLines = wrapText(doc, intro, contentWidth - 15);
  introLines.forEach(line => {
    checkPage(5);
    doc.text(line, margin + 8, y);
    y += 5.5;
  });

  y += 20;

  // ===== INVESTMENT SCHEDULE =====
  const items = parseJSON(quoteData.items) || [];
  if (items.length > 0) {
    checkPage(40);
    
    doc.setFontSize(16);
    doc.setFont('times', 'bold');
    doc.setTextColor(...gold);
    doc.text('Investment Schedule', margin + 5, y);
    
    y += 15;

    items.forEach((item: any, index: number) => {
      checkPage(20);
      
      // Elegant row
      doc.setFillColor(...cream);
      doc.roundedRect(margin, y, contentWidth, 16, 4, 4, 'F');
      
      doc.setDrawColor(...gold);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, 16, 4, 4, 'D');
      
      // Gold number badge
      doc.setFillColor(...gold);
      doc.circle(margin + 10, y + 8, 4, 'F');
      doc.setFontSize(10);
      doc.setFont('times', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text((index + 1).toString(), margin + 10, y + 10, { align: 'center' });
      
      doc.setFontSize(11);
      doc.setFont('times', 'normal');
      doc.setTextColor(...deepBlack);
      
      const desc = item.description || item.name || 'Service';
      const qty = item.quantity || 1;
      const unitPrice = item.unitPrice || item.price || 0;
      const amount = qty * unitPrice;
      
      const descLines = wrapText(doc, desc, contentWidth - 80);
      doc.text(descLines[0], margin + 18, y + 7);
      
      doc.setFontSize(9);
      doc.setFont('times', 'italic');
      doc.setTextColor(...darkGray);
      doc.text(`Quantity: ${qty}`, margin + 18, y + 12);
      
      doc.setFontSize(12);
      doc.setFont('times', 'bold');
      doc.setTextColor(...gold);
      doc.text(formatCurrency(amount, quoteData.currency), pageWidth - margin - 8, y + 10, { align: 'right' });
      
      y += 20;
    });
  }

  // ===== TOTAL INVESTMENT =====
  y += 15;
  checkPage(50);
  
  doc.setFillColor(...deepBlack);
  doc.roundedRect(margin, y, contentWidth, 45, 6, 6, 'F');
  
  // Gold border
  doc.setDrawColor(...gold);
  doc.setLineWidth(2);
  doc.roundedRect(margin, y, contentWidth, 45, 6, 6, 'D');
  
  y += 15;
  
  const subtotal = quoteData.subtotal || 0;
  const tax = quoteData.tax || 0;
  const total = quoteData.total || subtotal + tax;
  
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('Subtotal:', margin + 15, y);
  doc.text(formatCurrency(subtotal, quoteData.currency), pageWidth - margin - 15, y, { align: 'right' });
  y += 7;
  doc.text('Tax:', margin + 15, y);
  doc.text(formatCurrency(tax, quoteData.currency), pageWidth - margin - 15, y, { align: 'right' });
  
  y += 10;
  doc.setFontSize(14);
  doc.setFont('times', 'bold');
  doc.setTextColor(...gold);
  doc.text('TOTAL INVESTMENT:', margin + 15, y);
  doc.text(formatCurrency(total, quoteData.currency), pageWidth - margin - 15, y, { align: 'right' });

  y += 30;

  // ===== ACCEPTANCE =====
  checkPage(45);
  
  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.setTextColor(...gold);
  doc.text('Acceptance', margin + 5, y);
  
  y += 12;
  
  doc.setFillColor(...cream);
  doc.roundedRect(margin, y, contentWidth, 38, 5, 5, 'F');
  
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 38, 5, 5, 'D');
  
  y += 10;
  doc.setFontSize(9);
  doc.setFont('times', 'italic');
  doc.setTextColor(...darkGray);
  doc.text('Your signature below signifies acceptance of this proposal and authorization to commence.', margin + 8, y);
  
  y += 15;
  const sigWidth = (contentWidth - 20) / 2;
  
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.8);
  doc.line(margin + 10, y, margin + 10 + sigWidth - 5, y);
  doc.line(margin + sigWidth + 15, y, pageWidth - margin - 10, y);
  
  y += 5;
  doc.setFontSize(8);
  doc.setFont('times', 'normal');
  doc.setTextColor(...darkGray);
  doc.text('Client Signature', margin + 10, y);
  doc.text('MicroAI Systems', margin + sigWidth + 15, y);

  // Elegant footer
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
  
  doc.setFontSize(8);
  doc.setFont('times', 'italic');
  doc.setTextColor(...darkGray);
  doc.text('MicroAI Systems | Distinguished Web Development', pageWidth / 2, pageHeight - 15, { align: 'center' });
}

// Export the locked professional template
export { generateProfessionalLockedTemplate } from './locked-quote-template';
