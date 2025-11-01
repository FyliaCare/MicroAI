'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Editor } from '@tinymce/tinymce-react'
import Image from 'next/image'

interface BlogPostEditorProps {
  postId?: string
  isEdit?: boolean
}

export default function BlogPostEditor({ postId, isEdit = false }: BlogPostEditorProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const editorRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [generatingSEO, setGeneratingSEO] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '',
    featured: false,
    allowComments: true,
    status: 'draft',
    published: false
  })

  // Auto-generated preview data (read-only)
  const [seoPreview, setSeoPreview] = useState({
    slug: '',
    keywords: [] as string[],
    tags: [] as string[],
    metaTitle: '',
    metaDescription: '',
    summary: '',
    readingTime: 0
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
        
        // Set SEO preview from existing data
        setSeoPreview({
          slug: post.slug || '',
          keywords: post.seoKeywords ? post.seoKeywords.split(',').map((k: string) => k.trim()) : [],
          tags: Array.isArray(post.tags) ? post.tags : (post.tags ? JSON.parse(post.tags) : []),
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          summary: post.excerpt || '',
          readingTime: post.readingTime || 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
      alert('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  // Auto-generate SEO data when content or title changes
  const generateSEO = async () => {
    if (!formData.title.trim() || generatingSEO) return
    
    const content = editorRef.current?.getContent() || formData.content
    if (!content.trim()) return

    try {
      setGeneratingSEO(true)
      const response = await fetch('/api/blog/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: content
        })
      })

      const data = await response.json()
      if (data.success) {
        setSeoPreview(data.seo)
      }
    } catch (error) {
      console.error('SEO generation error:', error)
    } finally {
      setGeneratingSEO(false)
    }
  }

  // Auto-generate SEO on title blur or content change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title && formData.content) {
        generateSEO()
      }
    }, 2000) // Debounce 2 seconds

    return () => clearTimeout(timer)
  }, [formData.title, formData.content])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setFormData(prev => ({ ...prev, coverImage: data.url }))
      } else {
        alert(data.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (publishNow: boolean = false) => {
    if (!formData.title.trim()) {
      alert('Title is required')
      return
    }

    if (editorRef.current) {
      formData.content = editorRef.current.getContent()
    }

    if (!formData.content.trim()) {
      alert('Content is required')
      return
    }

    try {
      setSaving(true)

      // System will auto-generate all SEO data on the backend
      const payload = {
        title: formData.title,
        content: formData.content,
        coverImage: formData.coverImage,
        featured: formData.featured,
        allowComments: formData.allowComments,
        published: publishNow,
        status: publishNow ? 'published' : 'draft',
        // Include auto-generated data if available
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
        alert(isEdit ? 'Post updated successfully! ✨ SEO auto-generated' : 'Post created successfully! ✨ SEO auto-generated')
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const userRole = (session?.user as any)?.role
  if (!userRole || (userRole !== 'admin' && userRole !== 'super-admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Access denied. Admin only.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Post' : 'Create New Post'}
          </h1>
          <button
            onClick={() => router.push('/admin/blog')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Blog
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* AI-Powered Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">⚡ AI-Powered SEO Generation</h3>
              <p className="text-gray-700 mb-2">
                Just add your <strong>title</strong>, <strong>content</strong>, and <strong>cover image</strong>. 
                Our system automatically generates:
              </p>
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  SEO Keywords
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Tags & Categories
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Meta Title
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Meta Description
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  URL Slug
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Content Summary
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title * <span className="text-gray-400 font-normal">(Only field you need to fill)</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={generateSEO}
            placeholder="Enter your blog post title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
            required
          />
          {generatingSEO && (
            <p className="text-sm text-blue-600 mt-2 flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating SEO data...
            </p>
          )}
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image * <span className="text-gray-400 font-normal">(Required for great presentation)</span>
          </label>
          
          {formData.coverImage && (
            <div className="mb-4 relative w-full h-80 rounded-xl overflow-hidden border-2 border-gray-300">
              <Image
                src={formData.coverImage}
                alt="Cover preview"
                fill
                className="object-cover"
              />
              <button
                onClick={() => setFormData({ ...formData, coverImage: '' })}
                className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transition-all hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:text-white hover:file:from-blue-700 hover:file:to-purple-700 file:cursor-pointer cursor-pointer"
            disabled={uploadingImage}
          />
          {uploadingImage && (
            <p className="text-sm text-blue-600 mt-2 flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading image...
            </p>
          )}
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content * <span className="text-gray-400 font-normal">(Write your amazing content here)</span>
          </label>
          <Editor
            onInit={(_evt: any, editor: any) => editorRef.current = editor}
            initialValue={formData.content}
            onEditorChange={(content) => {
              setFormData(prev => ({ ...prev, content }))
            }}
            init={{
              height: 600,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | link image media | code preview | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; color:#1f2937; }',
              images_upload_handler: async (blobInfo: any) => {
                const formData = new FormData()
                formData.append('file', blobInfo.blob(), blobInfo.filename())
                
                const response = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData
                })
                
                const data = await response.json()
                return data.url
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 SEO data auto-generates as you type. Just focus on writing great content!
          </p>
        </div>

        {/* Auto-Generated SEO Preview */}
        {(seoPreview.slug || seoPreview.tags.length > 0) && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Auto-Generated SEO Data
              </h3>
              <button
                onClick={generateSEO}
                disabled={generatingSEO}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50"
              >
                {generatingSEO ? 'Generating...' : '🔄 Regenerate'}
              </button>
            </div>

            <div className="space-y-4">
              {/* URL Slug */}
              {seoPreview.slug && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    URL Slug
                  </label>
                  <p className="text-blue-600 font-mono text-sm">/blog/{seoPreview.slug}</p>
                </div>
              )}

              {/* Meta Title */}
              {seoPreview.metaTitle && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Meta Title ({seoPreview.metaTitle.length}/60 chars)
                  </label>
                  <p className="text-gray-800 font-semibold text-lg">{seoPreview.metaTitle}</p>
                </div>
              )}

              {/* Meta Description */}
              {seoPreview.metaDescription && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Meta Description ({seoPreview.metaDescription.length}/155 chars)
                  </label>
                  <p className="text-gray-700">{seoPreview.metaDescription}</p>
                </div>
              )}

              {/* Summary */}
              {seoPreview.summary && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Auto-Generated Summary
                  </label>
                  <p className="text-gray-700">{seoPreview.summary}</p>
                </div>
              )}

              {/* Keywords */}
              {seoPreview.keywords.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    SEO Keywords ({seoPreview.keywords.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {seoPreview.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {seoPreview.tags.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Auto-Generated Tags ({seoPreview.tags.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {seoPreview.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reading Time */}
              {seoPreview.readingTime > 0 && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Estimated Reading Time
                  </label>
                  <p className="text-gray-800 font-medium">
                    <svg className="w-5 h-5 inline mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {seoPreview.readingTime} min read
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800">
                ✨ <strong>Pro Tip:</strong> These values are automatically saved when you publish. No manual SEO work needed!
              </p>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Options</h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Post</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.allowComments}
                onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Allow Comments</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <button
            onClick={() => router.push('/admin/blog')}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            disabled={saving}
          >
            Cancel
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => handleSubmit(false)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Publishing...' : 'Publish Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
