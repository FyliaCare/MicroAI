/**
 * SECTION UTILITIES - PDF MATCH
 * Reusable components for sections matching PDF styling
 */

import {
  Paragraph,
  TextRun,
  AlignmentType,
} from 'docx'
import {
  PDF_COLORS,
  PDF_TYPOGRAPHY,
  PDF_SPACING,
  getBrandColor,
  getBrandShading,
} from '../templates/pdf-match'

/**
 * Create a section header with brand color background and white text
 * Matches PDF section headers exactly
 */
export function createSectionHeader(title: string, brandColor?: string): Paragraph {
  const color = getBrandColor(brandColor)
  
  return new Paragraph({
    children: [
      new TextRun({
        text: title.toUpperCase(),
        size: PDF_TYPOGRAPHY.H1,
        bold: true,
        color: 'FFFFFF',
        font: PDF_TYPOGRAPHY.HEADING,
      }),
    ],
    alignment: AlignmentType.LEFT,
    spacing: {
      before: PDF_SPACING.MEDIUM,
      after: PDF_SPACING.MEDIUM,
    },
    shading: getBrandShading(color),
    indent: { left: PDF_SPACING.MEDIUM },
  })
}

/**
 * Create a subsection header
 * Matches PDF subsection styling
 */
export function createSubsectionHeader(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        size: PDF_TYPOGRAPHY.H2,
        bold: true,
        color: PDF_COLORS.TEXT_PRIMARY,
        font: PDF_TYPOGRAPHY.HEADING,
      }),
    ],
    spacing: {
      before: PDF_SPACING.MEDIUM,
      after: PDF_SPACING.SMALL,
    },
  })
}

/**
 * Create a paragraph of body text
 */
export function createParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        size: PDF_TYPOGRAPHY.LARGE,
        color: PDF_COLORS.TEXT_PRIMARY,
        font: 'Calibri',
      }),
    ],
    spacing: {
      after: PDF_SPACING.SMALL,
      line: 360, // 1.8 line height
    },
  })
}

/**
 * Create a bulleted list item
 * Matches PDF bullet styling with brand color bullets
 */
export function createBulletItem(text: string, brandColor?: string): Paragraph {
  const color = getBrandColor(brandColor)
  
  return new Paragraph({
    children: [
      new TextRun({
        text: '• ',
        size: PDF_TYPOGRAPHY.LARGE,
        bold: true,
        color: color,
        font: 'Calibri',
      }),
      new TextRun({
        text: text,
        size: PDF_TYPOGRAPHY.LARGE,
        color: PDF_COLORS.TEXT_PRIMARY,
        font: 'Calibri',
      }),
    ],
    spacing: {
      after: PDF_SPACING.XSMALL,
      line: 300, // 1.5 line height
    },
    indent: {
      left: PDF_SPACING.MEDIUM,
      hanging: PDF_SPACING.SMALL,
    },
  })
}

/**
 * Create a checkmark list item
 */
export function createCheckItem(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: '✓ ',
        size: PDF_TYPOGRAPHY.LARGE,
        bold: true,
        color: PDF_COLORS.SUCCESS,
        font: 'Calibri',
      }),
      new TextRun({
        text: text,
        size: PDF_TYPOGRAPHY.LARGE,
        color: PDF_COLORS.TEXT_PRIMARY,
        font: 'Calibri',
      }),
    ],
    spacing: {
      after: PDF_SPACING.XSMALL,
      line: 300,
    },
    indent: {
      left: PDF_SPACING.MEDIUM,
      hanging: PDF_SPACING.SMALL,
    },
  })
}

/**
 * Create spacer paragraph
 */
export function createSpacer(size: number = PDF_SPACING.MEDIUM): Paragraph {
  return new Paragraph({
    text: '',
    spacing: { after: size },
  })
}
