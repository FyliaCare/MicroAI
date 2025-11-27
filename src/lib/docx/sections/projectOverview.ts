/**
 * PROJECT OVERVIEW SECTION
 * Executive summary, objectives, and project description
 */

import { Paragraph, Table } from 'docx'
import {
  createSectionHeader,
  createSubsectionHeader,
  createBodyParagraph,
  createBulletList,
  createInfoBox,
  createSpace,
  AlignmentType,
} from '../templates/iso-professional'

interface ProjectOverviewData {
  executiveSummary?: string
  description?: string
  projectType?: string
  industry?: string
  objectives?: string[]
  keyBenefits?: string[]
  successCriteria?: string[]
}

export function generateProjectOverview(data: ProjectOverviewData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = []
  
  // Section Header
  elements.push(createSectionHeader('Project Overview', '📊'))
  
  // Executive Summary
  if (data.executiveSummary) {
    elements.push(
      createSubsectionHeader('Executive Summary'),
      ...createInfoBox(
        'Project Synopsis',
        data.executiveSummary,
        'info'
      ),
      createSpace()
    )
  }
  
  // Project Type and Industry
  if (data.projectType || data.industry) {
    elements.push(createSubsectionHeader('Project Classification'))
    
    if (data.projectType) {
      elements.push(
        createBodyParagraph(
          `Project Type: ${data.projectType}`,
          { bold: true, spacingAfter: 120 }
        )
      )
    }
    
    if (data.industry) {
      elements.push(
        createBodyParagraph(
          `Industry: ${data.industry}`,
          { bold: true, spacingAfter: 240 }
        )
      )
    }
  }
  
  // Detailed Description
  if (data.description) {
    elements.push(
      createSubsectionHeader('Project Description'),
      createBodyParagraph(data.description, {
        alignment: AlignmentType.JUSTIFIED,
        spacingAfter: 240,
      }),
      createSpace()
    )
  }
  
  // Project Objectives
  if (data.objectives && data.objectives.length > 0) {
    elements.push(
      createSubsectionHeader('Project Objectives'),
      createBodyParagraph(
        'This project aims to achieve the following key objectives:',
        { italic: true, spacingAfter: 180 }
      ),
      ...createBulletList(data.objectives, 'check'),
      createSpace()
    )
  }
  
  // Key Benefits
  if (data.keyBenefits && data.keyBenefits.length > 0) {
    elements.push(
      createSubsectionHeader('Key Benefits & Value Proposition'),
      createBodyParagraph(
        'Expected benefits and value delivery:',
        { italic: true, spacingAfter: 180 }
      ),
      ...createBulletList(data.keyBenefits, 'check'),
      createSpace()
    )
  }
  
  // Success Criteria
  if (data.successCriteria && data.successCriteria.length > 0) {
    elements.push(
      createSubsectionHeader('Success Criteria'),
      createBodyParagraph(
        'Project success will be measured by:',
        { italic: true, spacingAfter: 180 }
      ),
      ...createBulletList(data.successCriteria, 'arrow'),
      createSpace()
    )
  }
  
  return elements
}
