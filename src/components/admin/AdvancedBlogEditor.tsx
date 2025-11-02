'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const AdvancedMarkdownEditor = dynamic(
  () => import('@/components/admin/AdvancedMarkdownEditor'),
  { ssr: false, loading: () => <div className="h-[600px] bg-gray-900 animate-pulse rounded-xl"></div> }
)

interface AdvancedBlogEditorProps {
  postId?: string
  isEdit?: boolean
}

export default function AdvancedBlogEditor({ postId, isEdit = false }: AdvancedBlogEditorProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '',
    featured: false,
    allowComments: true,
    status: 'draft',
    published: false
  })

  const [seoPreview, setSeoPreview] = useState({
    slug: '',
    keywords: [] as string[],
    tags: [] as string[],
    metaTitle: '',
    metaDescription: '',
    summary: '',
    readingTime: 0,
    wordCount: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (isEdit && postId) {
      fetchPost()
    }
  }, [postId, isEdit])

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!formData.title.trim() || !formData.content.trim()) return

    const autoSaveInterval = setInterval(() => {
      autoSaveDraft()
    }, 30000) // 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [formData.title, formData.content])

  // Auto-generate SEO when content changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (formData.title.trim() && formData.content.trim()) {
        generateSEO()
      }
    }, 2000)

    return () => clearTimeout(debounceTimer)
  }, [formData.title, formData.content])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blog/${postId}`)
      const data = await response.json()
      
      if (data.post) {
        const post = data.post
        setFormData({
          title: post.title || '',
          content: post.content || '',
          coverImage: post.coverImage || '',
          featured: post.featured || false,
          allowComments: post.allowComments ?? true,
          status: post.status || 'draft',
          published: post.published || false
        })
        
        setSeoPreview({
          slug: post.slug || '',
          keywords: post.seoKeywords ? post.seoKeywords.split(',').map((k: string) => k.trim()) : [],
          tags: Array.isArray(post.tags) ? post.tags : (post.tags ? JSON.parse(post.tags) : []),
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          summary: post.excerpt || '',
          readingTime: post.readingTime || 0,
          wordCount: post.content ? post.content.split(/\s+/).length : 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
      alert('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const generateSEO = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return

    try {
      const response = await fetch('/api/blog/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSeoPreview({
          ...data.seo,
          wordCount: formData.content.split(/\s+/).length
        })
      }
    } catch (error) {
      console.error('SEO generation error:', error)
    }
  }

  const autoSaveDraft = async () => {
    if (saving || autoSaving) return
    
    try {
      setAutoSaving(true)
      
      const payload = {
        title: formData.title,
        content: formData.content,
        coverImage: formData.coverImage,
        featured: formData.featured,
        allowComments: formData.allowComments,
        published: false,
        status: 'draft',
        autoGenerateSEO: true
      }

      const url = isEdit ? `/api/blog/${postId}` : '/api/blog'
      const method = isEdit ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      // Silent auto-save, no alert
    } catch (error) {
      console.error('Auto-save error:', error)
    } finally {
      setAutoSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      
      // Method 1: Try base64 encoding (works everywhere, no server storage needed)
      try {
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)

        const response = await fetch('/api/upload/base64', {
          method: 'POST',
          body: formDataUpload
        })

        const data = await response.json()
        
        if (data.success) {
          setFormData(prev => ({ ...prev, coverImage: data.url }))
          console.log('✓ Base64 upload successful (embedded in database)')
          return
        }
      } catch (base64Error) {
        console.warn('Base64 upload failed, trying file upload:', base64Error)
      }

      // Method 2: Try Cloudinary/local as fallback
      try {
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)

        const response = await fetch('/api/upload/cloudinary', {
          method: 'POST',
          body: formDataUpload
        })

        const data = await response.json()
        
        if (data.success) {
          setFormData(prev => ({ ...prev, coverImage: data.url }))
          console.log('✓ File upload successful:', data.provider || 'unknown')
          return
        }
      } catch (fileError) {
        console.warn('File upload failed:', fileError)
      }

      // Method 3: Client-side base64 as last resort
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setFormData(prev => ({ ...prev, coverImage: dataUrl }))
        console.log('✓ Client-side base64 encoding successful')
      }
      reader.onerror = () => {
        alert('Failed to read image file')
      }
      reader.readAsDataURL(file)

    } catch (error) {
      console.error('All upload methods failed:', error)
      alert('Failed to upload image. Try a smaller file or different format.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (publishNow: boolean = false) => {
    if (!formData.title.trim()) {
      alert('Title is required')
      return
    }

    if (!formData.content.trim()) {
      alert('Content is required')
      return
    }

    try {
      setSaving(true)

      const payload = {
        title: formData.title,
        content: formData.content,
        coverImage: formData.coverImage,
        featured: formData.featured,
        allowComments: formData.allowComments,
        published: publishNow,
        status: publishNow ? 'published' : 'draft',
        autoGenerateSEO: true
      }

      const url = isEdit ? `/api/blog/${postId}` : '/api/blog'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        alert(publishNow ? '🎉 Post published successfully!' : '✅ Draft saved successfully!')
        router.push('/admin/blog')
      } else {
        alert(data.error || 'Failed to save post')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading editor...</p>
        </div>
      </div>
    )
  }

  const userRole = (session?.user as any)?.role
  if (!userRole || (userRole !== 'admin' && userRole !== 'super-admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <p className="text-red-400 text-xl">Access denied. Admin only.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {isEdit ? '✏️ Edit Post' : '✨ Create New Post'}
              </h1>
              <p className="text-gray-400 mt-2">
                AI-powered SEO • Auto-save • Markdown support • Image CDN
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/blog')}
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Blog</span>
            </button>
          </div>
          
          {/* Auto-save indicator */}
          {autoSaving && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span>Auto-saving draft...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter an engaging title..."
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-lg font-medium"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Cover Image <span className="text-gray-500">(Recommended: 1200x630px)</span>
              </label>
              
              {formData.coverImage ? (
                <div className="relative group">
                  <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-700">
                    {formData.coverImage.startsWith('data:') ? (
                      // Base64 image
                      <img
                        src={formData.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Regular URL
                      <Image
                        src={formData.coverImage}
                        alt="Cover"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                    className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer bg-gray-800 hover:bg-gray-750 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-sm text-gray-400">Processing image...</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-12 h-12 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP (MAX. 10MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
              )}
            </div>

            {/* Markdown Editor */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Content <span className="text-red-400">*</span>
                <span className="text-gray-500 font-normal ml-2">
                  (Supports Markdown, drag-drop images, code blocks, tables)
                </span>
              </label>
              <AdvancedMarkdownEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="# Start writing your amazing blog post...

## Use Markdown formatting

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- `Code snippets` for technical content
- Links, images, tables, and more!

The editor supports:
✅ Live preview
✅ Drag & drop images
✅ Syntax highlighting
✅ Auto-save every 30 seconds"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t-2 border-gray-800">
              <button
                onClick={() => handleSubmit(false)}
                disabled={saving || !formData.title.trim() || !formData.content.trim()}
                className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {saving ? 'Saving...' : '💾 Save Draft'}
              </button>
              
              <button
                onClick={() => handleSubmit(true)}
                disabled={saving || !formData.title.trim() || !formData.content.trim()}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-lg shadow-blue-500/50"
              >
                {saving ? '⏳ Publishing...' : '🚀 Publish Now'}
              </button>
            </div>
          </div>

          {/* Sidebar - SEO Preview & Settings */}
          <div className="space-y-6">
            {/* SEO Preview */}
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-2 border-green-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI-Generated SEO
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Slug</p>
                  <p className="text-sm text-white font-mono bg-black/30 px-3 py-2 rounded">
                    {seoPreview.slug || 'Generating...'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Meta Title ({seoPreview.metaTitle.length}/60)</p>
                  <p className="text-sm text-white">
                    {seoPreview.metaTitle || 'Will be generated from title'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Meta Description ({seoPreview.metaDescription.length}/155)</p>
                  <p className="text-sm text-gray-300">
                    {seoPreview.metaDescription || 'Will be generated from content'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Keywords ({seoPreview.keywords.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {seoPreview.keywords.length > 0 ? (
                      seoPreview.keywords.slice(0, 10).map((keyword, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Analyzing content...</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Tags ({seoPreview.tags.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {seoPreview.tags.length > 0 ? (
                      seoPreview.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Detecting topics...</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-500/20">
                  <div>
                    <p className="text-xs text-gray-400">Reading Time</p>
                    <p className="text-lg font-bold text-white">{seoPreview.readingTime} min</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Word Count</p>
                    <p className="text-lg font-bold text-white">{seoPreview.wordCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Settings */}
            <div className="bg-gray-800 border-2 border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Post Settings</h3>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-white font-medium">Featured Post</p>
                    <p className="text-sm text-gray-400">Show on homepage</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-white font-medium">Allow Comments</p>
                    <p className="text-sm text-gray-400">Enable discussions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.allowComments}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowComments: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-900/20 border-2 border-blue-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-400 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Use <code className="bg-black/30 px-1 rounded">##</code> for section headings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Aim for 1000+ words for better SEO</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Add code blocks with ```language```</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Drag & drop images directly into editor</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Auto-saves every 30 seconds</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
