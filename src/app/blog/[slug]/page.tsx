import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.post
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    return null
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | MicroAI Systems',
    }
  }

  return {
    title: post.metaTitle || `${post.title} | MicroAI Blog`,
    description: post.metaDescription || post.excerpt || post.title,
    keywords: post.seoKeywords,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.authorName ? [post.authorName] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  // Parse tags if they're JSON
  let tags: string[] = []
  if (post.tags) {
    try {
      tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags
    } catch (e) {
      tags = []
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black">
      <AdvancedNavbar />
      <style dangerouslySetInnerHTML={{__html: `
        .blog-content * {
          color: #f3f4f6 !important;
        }
        .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5, .blog-content h6 {
          color: #ffffff !important;
          font-weight: bold !important;
        }
        .blog-content p {
          font-size: 18px !important;
          line-height: 1.8 !important;
          margin-bottom: 1.5rem !important;
          color: #f3f4f6 !important;
        }
        .blog-content a {
          color: #60a5fa !important;
        }
        .blog-content strong {
          color: #ffffff !important;
          font-weight: 700 !important;
        }
        .blog-content ul, .blog-content ol {
          color: #f3f4f6 !important;
        }
      `}} />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Category & Featured Badge */}
        <div className="flex items-center space-x-3 mb-6">
          {post.category && (
            <span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full border border-blue-500/20">
              {post.category}
            </span>
          )}
          {post.featured && (
            <span className="inline-block px-4 py-2 bg-yellow-500/10 text-yellow-400 text-sm font-medium rounded-full border border-yellow-500/20">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-10 pb-8 border-b border-gray-800">
          {post.authorName && (
            <div className="flex items-center">
              {post.authorAvatar ? (
                <Image
                  src={post.authorAvatar}
                  alt={post.authorName}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">
                    {post.authorName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="text-white font-medium">{post.authorName}</p>
                <p className="text-xs text-gray-500">Author</p>
              </div>
            </div>
          )}
          
          {post.publishedAt && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}

          {post.readingTime && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{post.readingTime} min read</span>
            </div>
          )}

          {post.views > 0 && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.views.toLocaleString()} views</span>
            </div>
          )}
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 border border-gray-800">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content - Enhanced Visibility with Background */}
        <div 
          className="blog-content prose prose-invert prose-xl max-w-none bg-black/30 rounded-2xl p-8 backdrop-blur-sm
            prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
            prose-h1:text-5xl prose-h1:mt-16 prose-h1:mb-8 prose-h1:leading-tight
            prose-h2:text-4xl prose-h2:mt-14 prose-h2:mb-7 prose-h2:leading-snug
            prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-5 prose-h3:leading-snug
            prose-h4:text-2xl prose-h4:mt-8 prose-h4:mb-4
            prose-p:text-gray-100 prose-p:text-xl prose-p:leading-relaxed prose-p:mb-6 prose-p:tracking-wide
            prose-a:text-blue-400 prose-a:font-semibold prose-a:no-underline prose-a:border-b-2 prose-a:border-blue-500/50 hover:prose-a:text-blue-300 hover:prose-a:border-blue-300
            prose-strong:text-white prose-strong:font-bold prose-strong:text-xl
            prose-em:text-gray-100 prose-em:italic
            prose-code:text-pink-300 prose-code:bg-gray-900/80 prose-code:px-3 prose-code:py-1.5 prose-code:rounded-md prose-code:font-mono prose-code:text-base prose-code:font-semibold prose-code:border prose-code:border-pink-500/30
            prose-pre:bg-gray-900/90 prose-pre:border-2 prose-pre:border-gray-700 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-8 prose-pre:shadow-2xl
            prose-ul:text-gray-100 prose-ul:text-xl prose-ul:my-6 prose-ul:leading-relaxed
            prose-ol:text-gray-100 prose-ol:text-xl prose-ol:my-6 prose-ol:leading-relaxed
            prose-li:my-3 prose-li:leading-relaxed prose-li:text-gray-100
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/10 prose-blockquote:pl-8 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-200 prose-blockquote:text-xl prose-blockquote:my-8
            prose-img:rounded-xl prose-img:border-2 prose-img:border-gray-700 prose-img:shadow-2xl prose-img:my-10
            prose-hr:border-gray-700 prose-hr:my-12
            prose-table:text-gray-100 prose-table:border-2 prose-table:border-gray-700 prose-table:rounded-lg
            prose-thead:bg-gray-800 prose-thead:text-white prose-thead:font-bold
            prose-th:p-4 prose-th:text-left prose-th:border-b-2 prose-th:border-gray-600
            prose-td:p-4 prose-td:border-b prose-td:border-gray-700"
          style={{ 
            fontSize: '18px',
            lineHeight: '1.8',
            color: '#f3f4f6'
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Tagged With
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-800 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share & Actions */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{post.likes || 0}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>

            <Link
              href="/blog"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              More Articles
            </Link>
          </div>
        </div>

        {/* Related / Navigation */}
        <div className="mt-16 pt-12 border-t border-gray-800">
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-500/20 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to Build Something Amazing?
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Whether it's a custom web application, SaaS platform, or complete digital transformation, 
              we're here to help bring your vision to life.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
