/**
 * Test Quote PDF Download
 * Tests the PDF generation endpoint directly
 */

async function testPDFDownload() {
  const quoteId = 'e5658a28-88dc-456b-95c5-a47c56fb1bbd' // Taadiway CRM quote
  const apiUrl = `http://localhost:3000/api/admin/quotes/${quoteId}/pdf`

  console.log('🧪 Testing PDF Download...')
  console.log('Quote ID:', quoteId)
  console.log('API URL:', apiUrl)
  console.log('')

  try {
    console.log('Making request...')
    const response = await fetch(apiUrl)
    
    console.log('Response status:', response.status)
    console.log('Response headers:')
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`)
    })
    console.log('')

    if (response.ok) {
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('application/pdf')) {
        const buffer = await response.arrayBuffer()
        console.log('✅ PDF generated successfully!')
        console.log('PDF size:', buffer.byteLength, 'bytes')
        console.log('PDF size (KB):', (buffer.byteLength / 1024).toFixed(2), 'KB')
        
        // Check if it's a valid PDF (starts with %PDF)
        const uint8Array = new Uint8Array(buffer)
        const header = String.fromCharCode(...uint8Array.slice(0, 4))
        console.log('PDF header:', header)
        
        if (header === '%PDF') {
          console.log('✅ Valid PDF file')
        } else {
          console.log('❌ Invalid PDF file (wrong header)')
        }
      } else {
        console.log('❌ Wrong content type:', contentType)
        const text = await response.text()
        console.log('Response body:', text.substring(0, 500))
      }
    } else {
      console.log('❌ Request failed')
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        const error = await response.json()
        console.log('Error response:', JSON.stringify(error, null, 2))
      } else {
        const text = await response.text()
        console.log('Error response:', text)
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
  }
}

// Wait for server to be ready
console.log('Waiting 2 seconds for server to be ready...')
setTimeout(() => {
  testPDFDownload()
}, 2000)
