'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { useCallback, useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg'
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full'
        }
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2'
        }
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2 bg-gray-100 font-bold'
        }
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'list-none pl-0'
        }
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2'
        }
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your amazing content...'
      }),
      CharacterCount
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[600px] p-8 bg-white text-gray-900',
        style: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.8; font-size: 16px;'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) return
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return <div className="h-[500px] bg-gray-100 animate-pulse rounded-lg"></div>
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 p-3 flex flex-wrap gap-1 sticky top-0 z-10">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Bold (Ctrl+B)"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3v14h5.5a4.5 4.5 0 001.67-8.69A4 4 0 0011 3H5zm2 2h4a2 2 0 110 4H7V5zm0 6h5a2.5 2.5 0 110 5H7v-5z"/>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Italic (Ctrl+I)"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3h8v2h-3l-3 10h3v2H5v-2h3l3-10H8V3z"/>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Underline (Ctrl+U)"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 2h2v8a3 3 0 106 0V2h2v8a5 5 0 11-10 0V2zM3 17h14v2H3v-2z"/>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Strikethrough"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2c-1.5 0-3 .5-4 1.5l1.4 1.4C8 4.3 9 4 10 4c2.2 0 4 1.8 4 4 0 .6-.1 1.2-.3 1.7l1.5 1.5C15.7 10.3 16 9.2 16 8c0-3.3-2.7-6-6-6zM2 9h16v2H2V9zm4 4c0 2.2 1.8 4 4 4 1 0 2-.3 2.6-.9l-1.4-1.4c-.4.2-.8.3-1.2.3-1.1 0-2-.9-2-2H6z"/>
            </svg>
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-medium ${editor.isActive('paragraph') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Paragraph"
          >
            P
          </button>
          {[1, 2, 3, 4].map(level => (
            <button
              key={level}
              onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()}
              className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-bold ${editor.isActive('heading', { level }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
              title={`Heading ${level}`}
            >
              H{level}
            </button>
          ))}
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Align Left"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3h16v2H2V3zm0 4h12v2H2V7zm0 4h16v2H2v-2zm0 4h12v2H2v-2z"/>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Align Center"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3h16v2H2V3zm2 4h12v2H4V7zm-2 4h16v2H2v-2zm2 4h12v2H4v-2z"/>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Align Right"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3h16v2H2V3zm4 4h12v2H6V7zm-4 4h16v2H2v-2zm4 4h12v2H6v-2z"/>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Justify"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3h16v2H2V3zm0 4h16v2H2V7zm0 4h16v2H2v-2zm0 4h16v2H2v-2z"/>
            </svg>
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Bullet List"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 5a1 1 0 100 2 1 1 0 000-2zM7 5h10v2H7V5zM3 9a1 1 0 100 2 1 1 0 000-2zM7 9h10v2H7V9zM3 13a1 1 0 100 2 1 1 0 000-2zM7 13h10v2H7v-2z"/>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Numbered List"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4h1v3H3V4zm0 5h1.5v.5H3v1h1.5v.5H3v1h2V9H3v1zm0 5h1v1H3v1h2v-4H3v1zm4-9h10v2H7V5zm0 4h10v2H7V9zm0 4h10v2H7v-2z"/>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('taskList') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Task List"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zm0 2v8h14V6H3zm2 2h2v2H5V8zm3 0h7v2H8V8zm-3 3h2v2H5v-2zm3 0h7v2H8v-2z"/>
            </svg>
          </button>
        </div>

        {/* Quote & Code */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Quote"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 6c-1.1 0-2 .9-2 2v6h3V8H6c0-.6.4-1 1-1V6zm5 0c-1.1 0-2 .9-2 2v6h3V8h-3c0-.6.4-1 1-1V6z"/>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('code') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Inline Code"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.7 7.3l-3 3a1 1 0 000 1.4l3 3a1 1 0 001.4-1.4L5.4 11l2.7-2.7a1 1 0 00-1.4-1.4zm6.6 0a1 1 0 011.4 0l3 3a1 1 0 010 1.4l-3 3a1 1 0 01-1.4-1.4L15.6 11l-2.7-2.7a1 1 0 010-1.4z"/>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Code Block"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zm1 2v8h12V6H4zm2 2h2v1H6V8zm3 0h2v1H9V8zm-3 2h2v1H6v-1zm3 0h5v1H9v-1z"/>
            </svg>
          </button>
        </div>

        {/* Link & Image */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            title="Insert Link"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-4.293-4.293a1 1 0 010-1.414z"/>
            </svg>
          </button>
          <button
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
            title="Insert Image"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
            title="Insert Table"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 3h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v3h5V5H4zm7 0v3h5V5h-5zM4 10v5h5v-5H4zm7 0v5h5v-5h-5z"/>
            </svg>
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <input
            type="color"
            onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="w-8 h-8 rounded cursor-pointer"
            title="Text Color"
          />
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('highlight') ? 'bg-yellow-200 text-gray-900' : 'text-gray-700'}`}
            title="Highlight"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5h7a5 5 0 010 10H8v2l-4-4 4-4v2h7a3 3 0 000-6H8V5z"/>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12 5h-7a5 5 0 000 10h7v2l4-4-4-4v2H5a3 3 0 010-6h7V5z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Word Count */}
      <div className="border-t border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-600 flex justify-between items-center">
        <div className="flex gap-4">
          <span className="font-medium">{editor.storage.characterCount?.characters() || 0} characters</span>
          <span className="font-medium">{editor.storage.characterCount?.words() || 0} words</span>
        </div>
        <span className="text-xs text-gray-500">Microsoft Word-Style Editor</span>
      </div>
    </div>
  )
}
