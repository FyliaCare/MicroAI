/**
 * CLIENT & COMPANY INFORMATION SECTION
 * Detailed contact information for both parties
 */

import { Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign } from 'docx'
import { ISO_COLORS, TYPOGRAPHY, MARGINS, createSectionHeader, createSubsectionHeader } from '../templates/iso-professional'

interface PartyInfo {
  name: string
  company?: string
  email: string
  phone?: string
  address?: string
  website?: string
  taxId?: string
  registrationNumber?: string
}

interface ContactInfoData {
  client: PartyInfo
  company: PartyInfo
}

export function generateContactInformation(data: ContactInfoData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = []
  
  // Section Header
  elements.push(createSectionHeader('Contact Information', '📋'))
  
  // Two-column layout for client and company
  const contactTable = new Table({
    rows: [
      // Headers Row
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'CLIENT INFORMATION',
                    bold: true,
                    size: TYPOGRAPHY.HEADING_2.size,
                    color: ISO_COLORS.WHITE,
                  }),
                ],
              }),
            ],
            shading: { fill: ISO_COLORS.PRIMARY, type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'SERVICE PROVIDER',
                    bold: true,
                    size: TYPOGRAPHY.HEADING_2.size,
                    color: ISO_COLORS.WHITE,
                  }),
                ],
              }),
            ],
            shading: { fill: ISO_COLORS.ACCENT, type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
            width: { size: 50, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      
      // Content Row
      new TableRow({
        children: [
          // Client Column
          new TableCell({
            children: generatePartyDetails(data.client, false),
            margins: { top: 240, bottom: 240, left: 200, right: 200 },
            shading: { fill: ISO_COLORS.WHITE, type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.TOP,
          }),
          
          // Company Column
          new TableCell({
            children: generatePartyDetails(data.company, true),
            margins: { top: 240, bottom: 240, left: 200, right: 200 },
            shading: { fill: ISO_COLORS.WHITE, type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.TOP,
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
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: ISO_COLORS.BORDER },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: ISO_COLORS.BORDER },
    },
  })
  
  elements.push(contactTable)
  
  return elements
}

function generatePartyDetails(party: PartyInfo, isCompany: boolean): Paragraph[] {
  const paragraphs: Paragraph[] = []
  
  // Name (bold and larger)
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: party.name,
          bold: true,
          size: TYPOGRAPHY.HEADING_3.size,
          color: ISO_COLORS.TEXT,
        }),
      ],
      spacing: { after: 120 },
    })
  )
  
  // Company (if different from name)
  if (party.company && party.company !== party.name) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: party.company,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.DARK,
          }),
        ],
        spacing: { after: 180 },
      })
    )
  }
  
  // Email with icon
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '📧 ',
          size: TYPOGRAPHY.BODY.size,
        }),
        new TextRun({
          text: 'Email: ',
          bold: true,
          size: TYPOGRAPHY.BODY.size,
          color: ISO_COLORS.MEDIUM,
        }),
        new TextRun({
          text: party.email,
          size: TYPOGRAPHY.BODY.size,
          color: ISO_COLORS.PRIMARY,
        }),
      ],
      spacing: { after: 120 },
    })
  )
  
  // Phone (if provided)
  if (party.phone) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '📞 ',
            size: TYPOGRAPHY.BODY.size,
          }),
          new TextRun({
            text: 'Phone: ',
            bold: true,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.MEDIUM,
          }),
          new TextRun({
            text: party.phone,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.TEXT,
          }),
        ],
        spacing: { after: 120 },
      })
    )
  }
  
  // Address (if provided)
  if (party.address) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '📍 ',
            size: TYPOGRAPHY.BODY.size,
          }),
          new TextRun({
            text: 'Address: ',
            bold: true,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.MEDIUM,
          }),
          new TextRun({
            text: party.address,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.TEXT,
          }),
        ],
        spacing: { after: 120 },
      })
    )
  }
  
  // Website (if provided and is company)
  if (party.website && isCompany) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '🌐 ',
            size: TYPOGRAPHY.BODY.size,
          }),
          new TextRun({
            text: 'Website: ',
            bold: true,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.MEDIUM,
          }),
          new TextRun({
            text: party.website,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.PRIMARY,
          }),
        ],
        spacing: { after: 120 },
      })
    )
  }
  
  // Tax ID (if provided and is company)
  if (party.taxId && isCompany) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '🏛️ ',
            size: TYPOGRAPHY.BODY.size,
          }),
          new TextRun({
            text: 'Tax ID: ',
            bold: true,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.MEDIUM,
          }),
          new TextRun({
            text: party.taxId,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.TEXT,
          }),
        ],
        spacing: { after: 120 },
      })
    )
  }
  
  // Registration Number (if provided and is company)
  if (party.registrationNumber && isCompany) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '📜 ',
            size: TYPOGRAPHY.BODY.size,
          }),
          new TextRun({
            text: 'Registration: ',
            bold: true,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.MEDIUM,
          }),
          new TextRun({
            text: party.registrationNumber,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.TEXT,
          }),
        ],
        spacing: { after: 120 },
      })
    )
  }
  
  return paragraphs
}
