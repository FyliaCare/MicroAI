'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import 'react-markdown-editor-lite/lib/index.css'

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
})

interface AdvancedMarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function AdvancedMarkdownEditor({ value, onChange, placeholder }: AdvancedMarkdownEditorProps) {
  const [content, setContent] = useState(value)

  const handleEditorChange = useCallback(({ text }: { text: string }) => {
    setContent(text)
    onChange(text)
  }, [onChange])

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        return data.url
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    }
  }, [])

  return (
    <div className="advanced-markdown-editor">
      <MdEditor
        value={content}
        style={{ height: '600px', borderRadius: '12px' }}
        renderHTML={(text) => {
          // Simple markdown rendering for preview
          return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" style="max-width: 100%; border-radius: 8px;" />')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>')
            .replace(/\n/gim, '<br />')
        }}
        onChange={handleEditorChange}
        onImageUpload={handleImageUpload}
        placeholder={placeholder || 'Write your amazing content here... Supports Markdown!'}
        config={{
          view: {
            menu: true,
            md: true,
            html: true,
          },
          table: {
            maxRow: 10,
            maxCol: 8,
          },
          imageUrl: 'https://via.placeholder.com/150',
          syncScrollMode: ['leftFollowRight', 'rightFollowLeft'],
        }}
      />

      <style jsx global>{`
        .advanced-markdown-editor .rc-md-editor {
          border: 2px solid #374151;
          background: #1f2937;
          color: #fff;
        }
        
        .advanced-markdown-editor .rc-md-navigation {
          background: #111827;
          border-bottom: 1px solid #374151;
        }
        
        .advanced-markdown-editor .button-wrap button {
          color: #9ca3af;
          border-right: 1px solid #374151;
        }
        
        .advanced-markdown-editor .button-wrap button:hover {
          background: #374151;
          color: #fff;
        }
        
        .advanced-markdown-editor .button-wrap button.active {
          background: #3b82f6;
          color: #fff;
        }
        
        .advanced-markdown-editor .sec-md .input {
          background: #1f2937;
          color: #fff;
        }
        
        .advanced-markdown-editor .sec-html {
          background: #111827;
          color: #fff;
        }
        
        .advanced-markdown-editor .sec-html-show h1,
        .advanced-markdown-editor .sec-html-show h2,
        .advanced-markdown-editor .sec-html-show h3 {
          color: #fff;
          font-weight: bold;
          margin: 1.5rem 0 1rem;
        }
        
        .advanced-markdown-editor .sec-html-show h1 { font-size: 2rem; }
        .advanced-markdown-editor .sec-html-show h2 { font-size: 1.75rem; }
        .advanced-markdown-editor .sec-html-show h3 { font-size: 1.5rem; }
        
        .advanced-markdown-editor .sec-html-show p {
          color: #e5e7eb;
          line-height: 1.8;
          margin-bottom: 1rem;
        }
        
        .advanced-markdown-editor .sec-html-show strong {
          color: #fff;
          font-weight: 700;
        }
        
        .advanced-markdown-editor .sec-html-show em {
          font-style: italic;
        }
        
        .advanced-markdown-editor .sec-html-show a {
          color: #60a5fa;
          text-decoration: underline;
        }
        
        .advanced-markdown-editor .sec-html-show code {
          background: rgba(255, 255, 255, 0.1);
          color: #fbbf24;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
        }
        
        .advanced-markdown-editor .sec-html-show pre {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid #374151;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .advanced-markdown-editor .sec-html-show ul,
        .advanced-markdown-editor .sec-html-show ol {
          color: #e5e7eb;
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .advanced-markdown-editor .sec-html-show li {
          margin-bottom: 0.5rem;
        }
        
        .advanced-markdown-editor .sec-html-show blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #d1d5db;
          font-style: italic;
        }
        
        .advanced-markdown-editor .sec-html-show img {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        
        .advanced-markdown-editor .sec-html-show table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        
        .advanced-markdown-editor .sec-html-show table th,
        .advanced-markdown-editor .sec-html-show table td {
          border: 1px solid #374151;
          padding: 0.75rem;
          text-align: left;
        }
        
        .advanced-markdown-editor .sec-html-show table th {
          background: #374151;
          color: #fff;
          font-weight: 600;
        }
        
        .advanced-markdown-editor .custom-html-style {
          background: #111827;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  )
}
