// Updated: Table spacing, expertise redesign, payment schedule details
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jsPDF from 'jspdf';
import {
  generateModernMinimalist,
  generateCorporateExecutive,
  generateCreativeAgency,
  generateTechStartup,
  generatePremiumLuxury,
  generateProfessionalLockedTemplate,
  parseJSON,
} from '@/lib/pdf-templates';
import { getQuoteDefaults } from '@/lib/quote-defaults';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PDF generation started for quote:', params.id);
    const quoteId = params.id;

    // Fetch quote from database
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        client: true,
      },
    });

    if (!quote) {
      console.log('Quote not found:', quoteId);
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    console.log('Quote found:', quote.quoteNumber);

    // Get standard defaults based on project type
    const defaults = getQuoteDefaults(quote.projectType || undefined);

    // Prepare quote data with intelligent defaults
    const quoteData = {
      id: quote.id,
      quoteNumber: quote.quoteNumber,
      title: quote.title,
      description: quote.description || '',
      
      // Client info
      clientName: quote.clientName || quote.client?.name || 'Client',
      clientCompany: quote.clientCompany || quote.client?.company || '',
      clientEmail: quote.clientEmail || quote.client?.email || '',
      clientPhone: quote.clientPhone || quote.client?.phone || '',
      clientAddress: quote.clientAddress || quote.client?.address || '',
      
      // Company info (use defaults)
      companyName: quote.companyName || defaults.companyName,
      companyEmail: quote.companyEmail || defaults.companyEmail,
      companyPhone: quote.companyPhone || defaults.companyPhone,
      companyAddress: quote.companyAddress || defaults.companyAddress,
      companyWebsite: quote.companyWebsite || defaults.companyWebsite,
      
      // Project details
      projectType: quote.projectType || '',
      timeline: quote.timeline || defaults.timeline,
      estimatedHours: quote.estimatedHours || defaults.estimatedHours,
      
      // Parsed JSON fields with smart defaults
      items: parseJSON(quote.items) || [],
      milestones: parseJSON(quote.milestones) || defaults.milestones || [],
      paymentTerms: parseJSON(quote.paymentTerms) || defaults.paymentTerms || [],
      scopeOfWork: parseJSON(quote.scopeOfWork) || defaults.scopeOfWork || [],
      exclusions: parseJSON(quote.exclusions) || [],
      assumptions: parseJSON(quote.assumptions) || defaults.assumptions || [],
      techStack: parseJSON(quote.techStack) || [],
      
      // Financial
      subtotal: quote.subtotal || 0,
      tax: quote.tax || 0,
      taxRate: quote.taxRate || 0,
      discount: quote.discount || 0,
      discountType: quote.discountType || 'fixed',
      total: quote.total || 0,
      currency: quote.currency || 'USD',
      
      // Dates
      createdAt: quote.createdAt,
      issuedAt: quote.issuedAt || quote.createdAt,
      validUntil: quote.validUntil,
      
      // Terms (use standard terms)
      terms: quote.terms || defaults.terms || '',
      
      // Template style
      templateStyle: (quote as any).templateStyle || 'modern-minimalist',
    };

    console.log('Quote data prepared, template:', quoteData.templateStyle);

    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Generate PDF based on selected template
    switch (quoteData.templateStyle) {
      case 'professional-locked':
        generateProfessionalLockedTemplate(doc, quoteData);
        break;
      case 'corporate-executive':
        generateCorporateExecutive(doc, quoteData);
        break;
      case 'creative-agency':
        generateCreativeAgency(doc, quoteData);
        break;
      case 'tech-startup':
        generateTechStartup(doc, quoteData);
        break;
      case 'premium-luxury':
        generatePremiumLuxury(doc, quoteData);
        break;
      case 'modern-minimalist':
      default:
        generateModernMinimalist(doc, quoteData);
        break;
    }

    console.log('PDF generated successfully with template:', quoteData.templateStyle);

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Return the PDF buffer
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quote-${quote.quoteNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
