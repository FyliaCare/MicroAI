/**
 * SIGNATURE & ACCEPTANCE SECTION
 * Formal acceptance and signature blocks
 */

import { Paragraph, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign, TextRun } from 'docx'
import { ISO_COLORS, TYPOGRAPHY, MARGINS, formatDate, createSectionHeader, createSpace, createBodyParagraph, createInfoBox } from '../templates/iso-professional'

interface SignatureData {
  quoteNumber: string
  validUntil: Date
  clientName: string
  companyName: string
}

export function generateSignatureSection(data: SignatureData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = []
  
  // Section Header
  elements.push(createSectionHeader('Acceptance & Authorization', '✍️'))
  
  // Acceptance Statement
  elements.push(
    ...createInfoBox(
      'Quote Acceptance',
      [
        `By signing below, you accept this quotation (${data.quoteNumber}) and agree to the terms and conditions outlined in this document.`,
        `This quotation is valid until ${formatDate(data.validUntil)}.`,
        'Signature below constitutes a binding agreement between both parties.',
      ],
      'info'
    ),
    createSpace('large')
  )
  
  // What Happens Next
  elements.push(
    createBodyParagraph('Upon Acceptance:', { bold: true, spacingAfter: 180 }),
    createBodyParagraph('1. Sign and return this document', { indent: 480, spacingAfter: 120 }),
    createBodyParagraph('2. Initial payment/deposit will be invoiced', { indent: 480, spacingAfter: 120 }),
    createBodyParagraph('3. Project kickoff will be scheduled within 3-5 business days', { indent: 480, spacingAfter: 120 }),
    createBodyParagraph('4. Dedicated project manager will be assigned', { indent: 480, spacingAfter: 360 }),
  )
  
  // Signature Table
  const signatureTable = new Table({
    rows: [
      // Client Signature Row
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'CLIENT SIGNATURE',
                    bold: true,
                    size: TYPOGRAPHY.HEADING_3.size,
                    color: ISO_COLORS.PRIMARY,
                  }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                text: '',
                spacing: { after: 600 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '_'.repeat(50),
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.MEDIUM,
                  }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Signature',
                    size: TYPOGRAPHY.SMALL.size,
                    color: ISO_COLORS.MEDIUM,
                    italics: true,
                  }),
                ],
                spacing: { after: 240 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Print Name: ${data.clientName}`,
                    bold: true,
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.TEXT,
                  }),
                ],
                spacing: { after: 240 },
              }),
            ],
            margins: { top: 300, bottom: 300, left: 300, right: 150 },
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            shading: { fill: ISO_COLORS.WHITE, type: ShadingType.CLEAR },
          }),
          
          // Date Column
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'DATE',
                    bold: true,
                    size: TYPOGRAPHY.HEADING_3.size,
                    color: ISO_COLORS.PRIMARY,
                  }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                text: '',
                spacing: { after: 600 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '_'.repeat(30),
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.MEDIUM,
                  }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Date Signed',
                    size: TYPOGRAPHY.SMALL.size,
                    color: ISO_COLORS.MEDIUM,
                    italics: true,
                  }),
                ],
              }),
            ],
            margins: { top: 300, bottom: 300, left: 150, right: 300 },
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            shading: { fill: ISO_COLORS.WHITE, type: ShadingType.CLEAR },
          }),
        ],
      }),
      
      // Company Representative Row (Optional)
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'AUTHORIZED REPRESENTATIVE',
                    bold: true,
                    size: TYPOGRAPHY.HEADING_3.size,
                    color: ISO_COLORS.ACCENT,
                  }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                text: '',
                spacing: { after: 600 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '_'.repeat(50),
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.MEDIUM,
                  }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Signature',
                    size: TYPOGRAPHY.SMALL.size,
                    color: ISO_COLORS.MEDIUM,
                    italics: true,
                  }),
                ],
                spacing: { after: 240 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Company: ${data.companyName}`,
                    bold: true,
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.TEXT,
                  }),
                ],
                spacing: { after: 240 },
              }),
            ],
            margins: { top: 300, bottom: 300, left: 300, right: 150 },
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            shading: { fill: ISO_COLORS.ACCENT_LIGHT, type: ShadingType.CLEAR },
          }),
          
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'DATE',
                    bold: true,
                    size: TYPOGRAPHY.HEADING_3.size,
                    color: ISO_COLORS.ACCENT,
                  }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                text: '',
                spacing: { after: 600 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '_'.repeat(30),
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.MEDIUM,
                  }),
                ],
                spacing: { after: 120 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Date Signed',
                    size: TYPOGRAPHY.SMALL.size,
                    color: ISO_COLORS.MEDIUM,
                    italics: true,
                  }),
                ],
              }),
            ],
            margins: { top: 300, bottom: 300, left: 150, right: 300 },
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            shading: { fill: ISO_COLORS.ACCENT_LIGHT, type: ShadingType.CLEAR },
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: ISO_COLORS.PRIMARY },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: ISO_COLORS.PRIMARY },
      left: { style: BorderStyle.SINGLE, size: 8, color: ISO_COLORS.PRIMARY },
      right: { style: BorderStyle.SINGLE, size: 8, color: ISO_COLORS.PRIMARY },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: ISO_COLORS.BORDER },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: ISO_COLORS.BORDER },
    },
  })
  
  elements.push(
    createSpace('large'),
    signatureTable,
    createSpace('large')
  )
  
  // Footer Note
  elements.push(
    createBodyParagraph(
      'For questions or clarifications regarding this quotation, please contact us using the information provided on page 2.',
      { italic: true, color: ISO_COLORS.MEDIUM, alignment: AlignmentType.CENTER, spacingAfter: 240 }
    )
  )
  
  // Document Footer
  elements.push(
    createSpace('large'),
    new Paragraph({
      children: [
        new TextRun({
          text: '─'.repeat(80),
          size: TYPOGRAPHY.TINY.size,
          color: ISO_COLORS.BORDER,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 180 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: data.companyName,
          bold: true,
          size: TYPOGRAPHY.BODY.size,
          color: ISO_COLORS.PRIMARY,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Quote Reference: ${data.quoteNumber} | Generated: ${formatDate(new Date())}`,
          size: TYPOGRAPHY.SMALL.size,
          color: ISO_COLORS.MEDIUM,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '✓ Professional • ✓ Transparent • ✓ Reliable',
          size: TYPOGRAPHY.SMALL.size,
          color: ISO_COLORS.ACCENT,
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
    })
  )
  
  return elements
}
