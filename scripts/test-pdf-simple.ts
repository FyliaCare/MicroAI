/**
 * Simple PDF Generation Test
 * Tests if React PDF can generate a basic document
 */

import React from 'react'
import ReactPDF from '@react-pdf/renderer'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// Create a simple test document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
  },
})

const TestDocument = () =>
  React.createElement(
    Document,
    {},
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.heading }, 'Test PDF'),
        React.createElement(Text, { style: styles.text }, 'This is a simple test document.'),
        React.createElement(Text, { style: styles.text }, 'If you can see this, PDF generation works!')
      )
    )
  )

async function testPDFGeneration() {
  console.log('🧪 Testing basic PDF generation...\n')

  try {
    console.log('Creating React element...')
    const element = React.createElement(TestDocument)
    
    console.log('Rendering to stream...')
    const stream = await ReactPDF.renderToStream(element as any)
    
    console.log('Converting to buffer...')
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk))
    }
    
    const buffer = Buffer.concat(chunks)
    console.log('\n✅ PDF generated successfully!')
    console.log('Size:', buffer.length, 'bytes')
    console.log('Size (KB):', (buffer.length / 1024).toFixed(2), 'KB')
    
    // Check PDF header
    const header = buffer.toString('utf8', 0, 4)
    console.log('Header:', header)
    
    if (header === '%PDF') {
      console.log('✅ Valid PDF format')
    } else {
      console.log('❌ Invalid PDF format')
    }
    
  } catch (error) {
    console.error('\n❌ PDF generation failed!')
    console.error('Error:', error)
    if (error instanceof Error) {
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
    }
    process.exit(1)
  }
}

testPDFGeneration()
