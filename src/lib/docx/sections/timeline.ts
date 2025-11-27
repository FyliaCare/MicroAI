/**
 * TIMELINE & MILESTONES SECTION
 * Project schedule, milestones, and deliverable timeline
 */

import { Paragraph, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign, TextRun } from 'docx'
import { ISO_COLORS, TYPOGRAPHY, MARGINS, formatDate, createSectionHeader, createSubsectionHeader, createSpace, createBodyParagraph, createInfoBox } from '../templates/iso-professional'

interface Milestone {
  id?: string
  title: string
  description: string
  deliverables?: string[]
  duration: number // in days
  percentage?: number
  dependencies?: string[]
  startDate?: string
  endDate?: string
}

interface TimelineData {
  startDate?: Date | string
  estimatedDuration?: number // in days/weeks
  timeline?: string
  milestones?: Milestone[]
}

export function generateTimeline(data: TimelineData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = []
  
  // Section Header
  elements.push(createSectionHeader('Project Timeline & Milestones', '📅'))
  
  // Overview
  if (data.startDate || data.estimatedDuration) {
    const overviewText: string[] = []
    
    if (data.startDate) {
      overviewText.push(`Project Start: ${formatDate(data.startDate)}`)
    }
    
    if (data.estimatedDuration) {
      const unit = data.estimatedDuration > 60 ? 'weeks' : 'days'
      const value = data.estimatedDuration > 60 
        ? Math.round(data.estimatedDuration / 7) 
        : data.estimatedDuration
      overviewText.push(`Estimated Duration: ${value} ${unit}`)
    }
    
    if (overviewText.length > 0) {
      elements.push(
        ...createInfoBox('Timeline Overview', overviewText, 'info'),
        createSpace()
      )
    }
  }
  
  // Timeline Description
  if (data.timeline) {
    elements.push(
      createSubsectionHeader('Schedule Details'),
      createBodyParagraph(data.timeline, {
        alignment: AlignmentType.JUSTIFIED,
        spacingAfter: 360,
      })
    )
  }
  
  // Milestones Table
  if (data.milestones && data.milestones.length > 0) {
    elements.push(
      createSubsectionHeader('Project Milestones'),
      createBodyParagraph(
        'The project is structured into the following key milestones:',
        { italic: true, spacingAfter: 240 }
      )
    )
    
    const milestonesTable = createMilestonesTable(data.milestones)
    elements.push(milestonesTable, createSpace())
    
    // Detailed milestone breakdown
    data.milestones.forEach((milestone, index) => {
      if (milestone.deliverables && milestone.deliverables.length > 0) {
        elements.push(
          createSpace('small'),
          createBodyParagraph(`Milestone ${index + 1}: ${milestone.title}`, {
            bold: true,
            spacingAfter: 120,
          }),
          createBodyParagraph('Deliverables:', {
            bold: true,
            color: ISO_COLORS.MEDIUM,
            spacingAfter: 120,
          })
        )
        
        milestone.deliverables.forEach(deliverable => {
          elements.push(
            createBodyParagraph(`• ${deliverable}`, {
              indent: 480,
              spacingAfter: 60,
            })
          )
        })
        
        elements.push(createSpace('small'))
      }
    })
  }
  
  // Timeline Notes
  elements.push(
    createSpace(),
    createBodyParagraph(
      'Note: Timeline estimates are subject to change based on client feedback cycles, resource availability, and scope changes. Any material changes will be communicated promptly.',
      { italic: true, color: ISO_COLORS.MEDIUM, spacingAfter: 240 }
    )
  )
  
  return elements
}

function createMilestonesTable(milestones: Milestone[]): Table {
  const headerRow = new TableRow({
    children: [
      createMilestoneHeader('#', 8, AlignmentType.CENTER),
      createMilestoneHeader('Milestone', 35),
      createMilestoneHeader('Description', 37),
      createMilestoneHeader('Duration', 12, AlignmentType.CENTER),
      createMilestoneHeader('Progress', 8, AlignmentType.CENTER),
    ],
    tableHeader: true,
  })
  
  const dataRows = milestones.map((milestone, index) => 
    new TableRow({
      children: [
        // Number
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: String(index + 1),
                  bold: true,
                  size: TYPOGRAPHY.BODY.size,
                  color: ISO_COLORS.PRIMARY,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { 
            fill: index % 2 === 0 ? ISO_COLORS.WHITE : ISO_COLORS.LIGHT, 
            type: ShadingType.CLEAR 
          },
          margins: MARGINS.CELL_TIGHT,
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 8, type: WidthType.PERCENTAGE },
        }),
        
        // Title
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: milestone.title,
                  bold: true,
                  size: TYPOGRAPHY.BODY.size,
                  color: ISO_COLORS.TEXT,
                }),
              ],
            }),
          ],
          shading: { 
            fill: index % 2 === 0 ? ISO_COLORS.WHITE : ISO_COLORS.LIGHT, 
            type: ShadingType.CLEAR 
          },
          margins: MARGINS.CELL_TIGHT,
          verticalAlign: VerticalAlign.TOP,
          width: { size: 35, type: WidthType.PERCENTAGE },
        }),
        
        // Description
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: milestone.description,
                  size: TYPOGRAPHY.SMALL.size,
                  color: ISO_COLORS.MEDIUM,
                }),
              ],
            }),
          ],
          shading: { 
            fill: index % 2 === 0 ? ISO_COLORS.WHITE : ISO_COLORS.LIGHT, 
            type: ShadingType.CLEAR 
          },
          margins: MARGINS.CELL_TIGHT,
          verticalAlign: VerticalAlign.TOP,
          width: { size: 37, type: WidthType.PERCENTAGE },
        }),
        
        // Duration
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${milestone.duration} days`,
                  size: TYPOGRAPHY.BODY.size,
                  color: ISO_COLORS.TEXT,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { 
            fill: index % 2 === 0 ? ISO_COLORS.WHITE : ISO_COLORS.LIGHT, 
            type: ShadingType.CLEAR 
          },
          margins: MARGINS.CELL_TIGHT,
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 12, type: WidthType.PERCENTAGE },
        }),
        
        // Progress Percentage
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: milestone.percentage ? `${milestone.percentage}%` : 'TBD',
                  bold: true,
                  size: TYPOGRAPHY.BODY.size,
                  color: ISO_COLORS.ACCENT,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { 
            fill: index % 2 === 0 ? ISO_COLORS.WHITE : ISO_COLORS.LIGHT, 
            type: ShadingType.CLEAR 
          },
          margins: MARGINS.CELL_TIGHT,
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 8, type: WidthType.PERCENTAGE },
        }),
      ],
    })
  )
  
  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: ISO_COLORS.PRIMARY },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: ISO_COLORS.PRIMARY },
      left: { style: BorderStyle.SINGLE, size: 6, color: ISO_COLORS.PRIMARY },
      right: { style: BorderStyle.SINGLE, size: 6, color: ISO_COLORS.PRIMARY },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 3, color: ISO_COLORS.BORDER },
      insideVertical: { style: BorderStyle.SINGLE, size: 3, color: ISO_COLORS.BORDER },
    },
  })
}

function createMilestoneHeader(text: string, width: number, alignment: typeof AlignmentType[keyof typeof AlignmentType] = AlignmentType.LEFT): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.WHITE,
          }),
        ],
        alignment,
      }),
    ],
    shading: { fill: ISO_COLORS.PRIMARY, type: ShadingType.CLEAR },
    margins: MARGINS.TABLE,
    verticalAlign: VerticalAlign.CENTER,
    width: { size: width, type: WidthType.PERCENTAGE },
  })
}
