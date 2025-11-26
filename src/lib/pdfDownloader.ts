/**
 * PDF Download Utility
 * Provides robust PDF download functionality with loading states and error handling
 */

interface DownloadOptions {
  filename?: string
  showToast?: boolean
  onProgress?: (progress: number) => void
}

interface ToastElement extends HTMLDivElement {
  timeoutId?: NodeJS.Timeout
}

/**
 * Creates a toast notification for PDF download status
 */
function createToast(message: string, type: 'loading' | 'success' | 'error' = 'loading'): ToastElement {
  // Remove any existing toast
  const existingToast = document.getElementById('pdf-download-toast')
  if (existingToast) {
    existingToast.remove()
  }
  
  const toast = document.createElement('div') as ToastElement
  toast.id = 'pdf-download-toast'
  
  const colors = {
    loading: '#4F46E5', // Indigo
    success: '#10B981', // Green
    error: '#EF4444',   // Red
  }
  
  const icons = {
    loading: '⏳',
    success: '✅',
    error: '❌',
  }
  
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    animation: slideIn 0.3s ease;
  `
  
  toast.textContent = `${icons[type]} ${message}`
  document.body.appendChild(toast)
  
  return toast
}

/**
 * Updates an existing toast
 */
function updateToast(toast: ToastElement | null, message: string, type: 'loading' | 'success' | 'error') {
  if (!toast || !toast.parentNode) return
  
  const colors = {
    loading: '#4F46E5',
    success: '#10B981',
    error: '#EF4444',
  }
  
  const icons = {
    loading: '⏳',
    success: '✅',
    error: '❌',
  }
  
  toast.style.background = colors[type]
  toast.textContent = `${icons[type]} ${message}`
}

/**
 * Removes a toast after a delay
 */
function removeToast(toast: ToastElement | null, delay: number = 2000) {
  if (!toast || !toast.parentNode) return
  
  if (toast.timeoutId) {
    clearTimeout(toast.timeoutId)
  }
  
  toast.timeoutId = setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0'
      toast.style.transform = 'translateX(400px)'
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove()
        }
      }, 300)
    }
  }, delay)
}

/**
 * Downloads a PDF from a given URL with enhanced error handling
 */
export async function downloadPDF(
  url: string,
  options: DownloadOptions = {}
): Promise<boolean> {
  const { filename = 'document.pdf', showToast = true } = options
  
  let toast: ToastElement | null = null
  
  try {
    if (showToast) {
      toast = createToast('Generating PDF...', 'loading')
    }
    
    console.log('📄 Downloading PDF from:', url)
    
    // Fetch the PDF
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    
    // Check response status
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `Server returned ${response.status}`)
    }
    
    // Verify content type
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/pdf')) {
      console.error('Invalid content type:', contentType)
      throw new Error('Server did not return a PDF file')
    }
    
    // Get the blob
    const blob = await response.blob()
    
    // Verify blob size
    if (blob.size === 0) {
      throw new Error('Generated PDF is empty')
    }
    
    console.log('✅ PDF generated successfully, size:', (blob.size / 1024).toFixed(2), 'KB')
    
    // Create download link
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = blobUrl
    a.download = filename
    
    // Trigger download
    document.body.appendChild(a)
    a.click()
    
    // Update toast
    if (showToast && toast) {
      updateToast(toast, 'PDF downloaded successfully!', 'success')
      removeToast(toast, 2000)
    }
    
    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl)
      if (a.parentNode) {
        document.body.removeChild(a)
      }
    }, 100)
    
    console.log('📥 PDF downloaded successfully as:', filename)
    return true
    
  } catch (error) {
    console.error('PDF download failed:', error)
    
    // Update or create error toast
    if (showToast) {
      if (toast) {
        updateToast(toast, 'Failed to download PDF', 'error')
        removeToast(toast, 3000)
      } else {
        toast = createToast('Failed to download PDF', 'error')
        removeToast(toast, 3000)
      }
    }
    
    // Show detailed error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Error details:', errorMessage)
    
    // Optional: Show alert for critical errors
    if (error instanceof Error && error.message.includes('Server')) {
      setTimeout(() => {
        alert(
          `Failed to download PDF: ${errorMessage}\n\n` +
          'Please check:\n' +
          '• Your internet connection\n' +
          '• The document has all required data\n' +
          '• Try refreshing the page\n\n' +
          'If the problem persists, contact support.'
        )
      }, 500)
    }
    
    return false
  }
}

/**
 * Downloads a quote PDF
 */
export async function downloadQuotePDF(
  quoteId: string,
  quoteNumber: string,
  isAdmin: boolean = false
): Promise<boolean> {
  const endpoint = isAdmin
    ? `/api/admin/quotes/${quoteId}/pdf`
    : `/api/quotes/${quoteId}/pdf`
  
  return downloadPDF(endpoint, {
    filename: `quote-${quoteNumber}.pdf`,
    showToast: true,
  })
}

/**
 * Adds slide-in animation CSS to the document
 */
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  try {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `
    if (!document.head.querySelector('style[data-pdf-animations]')) {
      style.setAttribute('data-pdf-animations', 'true')
      document.head.appendChild(style)
    }
  } catch (e) {
    // Silently fail in SSR or when document is not available
  }
}
