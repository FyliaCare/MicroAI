'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface BlogContentProps {
  content: string
  title: string
}

export default function BlogContent({ content, title }: BlogContentProps) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeHeading, setActiveHeading] = useState<string>('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [showTOC, setShowTOC] = useState(false)

  // Extract headings for table of contents
  useEffect(() => {
    const extractedHeadings: { id: string; text: string; level: number }[] = []
    const regex = /^(#{1,3})\s+(.+)$/gm
    let match

    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2]
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      extractedHeadings.push({ id, text, level })
    }

    setHeadings(extractedHeadings)
  }, [content])

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progress = (scrolled / documentHeight) * 100
      setReadingProgress(Math.min(progress, 100))

      // Update active heading
      const headingElements = headings.map(h => document.getElementById(h.id))
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i]
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveHeading(headings[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="relative">
        {/* Table of Contents - Desktop */}
        {headings.length > 0 && (
          <>
            {/* Mobile TOC Button */}
            <button
              onClick={() => setShowTOC(!showTOC)}
              className="lg:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* TOC Sidebar */}
            <div
              className={`
                fixed top-24 right-8 w-72 max-h-[calc(100vh-12rem)] overflow-y-auto
                bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6
                transition-all duration-300 z-30
                ${showTOC ? 'opacity-100 translate-x-0' : 'lg:opacity-100 lg:translate-x-0 opacity-0 translate-x-full pointer-events-none lg:pointer-events-auto'}
              `}
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => {
                      scrollToHeading(heading.id)
                      setShowTOC(false)
                    }}
                    className={`
                      block w-full text-left text-sm transition-all
                      ${heading.level === 1 ? 'font-bold' : ''}
                      ${heading.level === 2 ? 'pl-4' : ''}
                      ${heading.level === 3 ? 'pl-8' : ''}
                      ${
                        activeHeading === heading.id
                          ? 'text-blue-400 font-semibold'
                          : 'text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </div>
          </>
        )}

        {/* Blog Content with Markdown Support */}
        <div className="blog-markdown-content max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              h1: ({ node, ...props }) => {
                const text = String(props.children)
                const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                return <h1 id={id} {...props} />
              },
              h2: ({ node, ...props }) => {
                const text = String(props.children)
                const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                return <h2 id={id} {...props} />
              },
              h3: ({ node, ...props }) => {
                const text = String(props.children)
                const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                return <h3 id={id} {...props} />
              },
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </>
  )
}
