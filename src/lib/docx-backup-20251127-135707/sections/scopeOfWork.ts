/**
 * SCOPE OF WORK SECTION
 * Detailed scope, deliverables, exclusions, and assumptions
 */

import { Paragraph, Table } from 'docx'
import {
  createSectionHeader,
  createSubsectionHeader,
  createBodyParagraph,
  createBulletList,
  createNumberedList,
  createInfoBox,
  createSpace,
  createPageBreak,
} from '../templates/iso-professional'

interface ScopeData {
  scopeItems?: string[]
  deliverables?: string[]
  exclusions?: string[]
  assumptions?: string[]
  constraints?: string[]
  dependencies?: string[]
}

export function generateScopeOfWork(data: ScopeData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = []
  
  // Section Header
  elements.push(createSectionHeader('Scope of Work', '📋'))
  
  // Introduction
  elements.push(
    createBodyParagraph(
      'This section defines the boundaries of the project, outlining what is included and excluded from the proposed solution.',
      { italic: true, spacingAfter: 360 }
    )
  )
  
  // Included Scope
  if (data.scopeItems && data.scopeItems.length > 0) {
    elements.push(
      createSubsectionHeader('Included in Scope'),
      createBodyParagraph(
        'The following features, functionalities, and services are included in this proposal:',
        { spacingAfter: 180 }
      ),
      ...createBulletList(data.scopeItems, 'check'),
      createSpace('large')
    )
  }
  
  // Project Deliverables
  if (data.deliverables && data.deliverables.length > 0) {
    elements.push(
      createSubsectionHeader('Project Deliverables'),
      createBodyParagraph(
        'Upon successful completion, the following deliverables will be provided:',
        { spacingAfter: 180 }
      ),
      ...createNumberedList(data.deliverables),
      createSpace('large')
    )
  }
  
  // Exclusions
  if (data.exclusions && data.exclusions.length > 0) {
    elements.push(
      createSubsectionHeader('Exclusions'),
      ...createInfoBox(
        'Not Included in This Proposal',
        'The following items are explicitly excluded from this quotation:',
        'warning'
      ),
      createSpace('small'),
      ...createBulletList(data.exclusions, 'dash'),
      createSpace('large')
    )
  }
  
  // Project Assumptions
  if (data.assumptions && data.assumptions.length > 0) {
    elements.push(
      createSubsectionHeader('Project Assumptions'),
      createBodyParagraph(
        'This proposal is based on the following assumptions:',
        { spacingAfter: 180 }
      ),
      ...createBulletList(data.assumptions, 'arrow'),
      createSpace('large')
    )
  }
  
  // Constraints
  if (data.constraints && data.constraints.length > 0) {
    elements.push(
      createSubsectionHeader('Project Constraints'),
      createBodyParagraph(
        'The following constraints apply to this project:',
        { spacingAfter: 180 }
      ),
      ...createInfoBox(
        'Important Limitations',
        data.constraints,
        'note'
      ),
      createSpace('large')
    )
  }
  
  // Dependencies
  if (data.dependencies && data.dependencies.length > 0) {
    elements.push(
      createSubsectionHeader('External Dependencies'),
      createBodyParagraph(
        'Project success depends on the following factors being in place:',
        { spacingAfter: 180 }
      ),
      ...createBulletList(data.dependencies, 'arrow'),
      createSpace()
    )
  }
  
  return elements
}
