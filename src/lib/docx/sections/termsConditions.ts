/**
 * TERMS & CONDITIONS SECTION
 * Legal terms, warranties, liabilities, and conditions
 */

import { Paragraph, Table } from 'docx'
import {
  createSectionHeader,
  createSubsectionHeader,
  createBodyParagraph,
  createNumberedList,
  createBulletList,
  createSpace,
  createInfoBox,
  AlignmentType,
} from '../templates/iso-professional'

interface TermsData {
  termsAndConditions?: string
  warranties?: string
  liabilities?: string
  intellectualProperty?: string
  confidentiality?: string
  supportPeriod?: string
  maintenanceIncluded?: boolean
  revisionsIncluded?: number
  cancellationPolicy?: string
  disputeResolution?: string
}

export function generateTermsAndConditions(data: TermsData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = []
  
  // Section Header
  elements.push(createSectionHeader('Terms & Conditions', '📜'))
  
  // Main Terms and Conditions
  if (data.termsAndConditions) {
    elements.push(
      createBodyParagraph(data.termsAndConditions, {
        alignment: AlignmentType.JUSTIFIED,
        spacingAfter: 360,
      })
    )
  }
  
  // Standard Terms Sections
  const standardTerms: string[] = []
  
  // 1. Acceptance of Terms
  standardTerms.push(
    'By accepting this quotation, the Client agrees to all terms and conditions outlined in this document and any attached service agreements.'
  )
  
  // 2. Scope Changes
  standardTerms.push(
    'Any changes to the agreed scope of work must be documented in writing and may result in adjustments to timeline and pricing through a formal change order process.'
  )
  
  // 3. Client Responsibilities
  standardTerms.push(
    'The Client agrees to provide timely access to necessary resources, information, and decision-makers required for project completion. Delays in client feedback may affect project timelines.'
  )
  
  // 4. Force Majeure
  standardTerms.push(
    'Neither party shall be liable for delays or failure to perform obligations due to circumstances beyond reasonable control, including natural disasters, war, or government actions.'
  )
  
  elements.push(
    createSubsectionHeader('General Terms'),
    ...createNumberedList(standardTerms),
    createSpace('large')
  )
  
  // Intellectual Property Rights
  if (data.intellectualProperty) {
    elements.push(
      createSubsectionHeader('Intellectual Property Rights'),
      createBodyParagraph(data.intellectualProperty, {
        alignment: AlignmentType.JUSTIFIED,
        spacingAfter: 240,
      }),
      createSpace()
    )
  } else {
    elements.push(
      createSubsectionHeader('Intellectual Property Rights'),
      createBodyParagraph(
        'Upon full payment, all intellectual property rights for custom-developed work will be transferred to the Client. Pre-existing materials, frameworks, and third-party components remain under their respective licenses.',
        { alignment: AlignmentType.JUSTIFIED, spacingAfter: 240 }
      ),
      createSpace()
    )
  }
  
  // Confidentiality
  if (data.confidentiality) {
    elements.push(
      createSubsectionHeader('Confidentiality'),
      createBodyParagraph(data.confidentiality, {
        alignment: AlignmentType.JUSTIFIED,
        spacingAfter: 240,
      }),
      createSpace()
    )
  } else {
    elements.push(
      createSubsectionHeader('Confidentiality'),
      createBodyParagraph(
        'Both parties agree to maintain confidentiality of all proprietary information shared during the course of this engagement. This obligation survives termination of the agreement.',
        { alignment: AlignmentType.JUSTIFIED, spacingAfter: 240 }
      ),
      createSpace()
    )
  }
  
  // Warranties and Limitations
  if (data.warranties) {
    elements.push(
      createSubsectionHeader('Warranties'),
      createBodyParagraph(data.warranties, {
        alignment: AlignmentType.JUSTIFIED,
        spacingAfter: 240,
      }),
      createSpace()
    )
  } else {
    const defaultWarranties = [
      'Services will be performed in a professional and workmanlike manner consistent with industry standards.',
      'All deliverables will be free from defects in materials and workmanship for the warranty period specified.',
      'No warranties are provided for third-party services, software, or components beyond those provided by the original vendors.',
    ]
    
    elements.push(
      createSubsectionHeader('Warranties & Guarantees'),
      ...createBulletList(defaultWarranties, 'check'),
      createSpace()
    )
  }
  
  // Support & Maintenance
  if (data.supportPeriod || data.maintenanceIncluded !== undefined) {
    const supportDetails: string[] = []
    
    if (data.supportPeriod) {
      supportDetails.push(`Support Period: ${data.supportPeriod}`)
    }
    
    if (data.maintenanceIncluded) {
      supportDetails.push('Maintenance services included as specified in the service agreement.')
    }
    
    if (data.revisionsIncluded) {
      supportDetails.push(`Includes ${data.revisionsIncluded} rounds of revisions during development.`)
    }
    
    supportDetails.push('Extended support and maintenance packages available upon request.')
    
    elements.push(
      createSubsectionHeader('Support & Maintenance'),
      ...createBulletList(supportDetails, 'check'),
      createSpace()
    )
  }
  
  // Liability Limitations
  if (data.liabilities) {
    elements.push(
      createSubsectionHeader('Limitation of Liability'),
      createBodyParagraph(data.liabilities, {
        alignment: AlignmentType.JUSTIFIED,
        spacingAfter: 240,
      }),
      createSpace()
    )
  } else {
    elements.push(
      createSubsectionHeader('Limitation of Liability'),
      ...createInfoBox(
        'Liability Notice',
        'The Service Provider\'s total liability for any claims arising from this agreement shall not exceed the total amount paid by the Client under this agreement. Neither party shall be liable for indirect, incidental, or consequential damages.',
        'warning'
      ),
      createSpace()
    )
  }
  
  // Cancellation Policy
  if (data.cancellationPolicy) {
    elements.push(
      createSubsectionHeader('Cancellation & Termination'),
      createBodyParagraph(data.cancellationPolicy, {
        alignment: AlignmentType.JUSTIFIED,
        spacingAfter: 240,
      }),
      createSpace()
    )
  }
  
  // Dispute Resolution
  if (data.disputeResolution) {
    elements.push(
      createSubsectionHeader('Dispute Resolution'),
      createBodyParagraph(data.disputeResolution, {
        alignment: AlignmentType.JUSTIFIED,
        spacingAfter: 240,
      }),
      createSpace()
    )
  } else {
    elements.push(
      createSubsectionHeader('Dispute Resolution'),
      createBodyParagraph(
        'Any disputes arising from this agreement shall first be addressed through good-faith negotiation. If unresolved, disputes will be settled through binding arbitration in accordance with applicable laws.',
        { alignment: AlignmentType.JUSTIFIED, spacingAfter: 240 }
      ),
      createSpace()
    )
  }
  
  // Governing Law
  elements.push(
    createSubsectionHeader('Governing Law'),
    createBodyParagraph(
      'This agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which the Service Provider is registered, without regard to its conflict of law provisions.',
      { alignment: AlignmentType.JUSTIFIED, spacingAfter: 240 }
    )
  )
  
  return elements
}
