import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'
import BlogContent from '@/components/blog/BlogContent'
import SocialShare from '@/components/blog/SocialShare'

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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://microaisystems.com'
  const postUrl = `${baseUrl}/blog/${post.slug}`

  return {
    title: post.metaTitle || `${post.title} | MicroAI Systems Blog`,
    description: post.metaDescription || post.excerpt || post.title,
    keywords: post.seoKeywords,
    authors: [{ name: post.authorName || 'MicroAI Systems' }],
    creator: post.authorName || 'MicroAI Systems',
    publisher: 'MicroAI Systems',
    category: post.category,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || post.title,
      url: postUrl,
      siteName: 'MicroAI Systems',
      images: post.coverImage ? [{
        url: post.coverImage,
        width: 1200,
        height: 630,
        alt: post.title,
      }] : [],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.authorName ? [post.authorName] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || post.title,
      images: post.coverImage ? [post.coverImage] : [],
      creator: '@microaisystems',
      site: '@microaisystems',
    },
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: post.published,
      follow: post.published,
      googleBot: {
        index: post.published,
        follow: post.published,
      },
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

  // Schema.org structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.authorName || 'MicroAI Systems',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MicroAI Systems',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://microaisystems.com'}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'https://microaisystems.com'}/blog/${post.slug}`,
    },
    keywords: post.seoKeywords,
    articleSection: post.category,
    wordCount: post.content ? post.content.split(/\s+/).length : 0,
    timeRequired: `PT${post.readingTime || 5}M`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black">
        <AdvancedNavbar />
        <style dangerouslySetInnerHTML={{__html: `
        .blog-content * {
          color: #ffffff !important;
        }
        .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5, .blog-content h6 {
          color: #ffffff !important;
          font-weight: 800 !important;
          margin-top: 2rem !important;
          margin-bottom: 1.5rem !important;
        }
        .blog-content h1 { font-size: 2.5rem !important; }
        .blog-content h2 { font-size: 2rem !important; }
        .blog-content h3 { font-size: 1.75rem !important; }
        .blog-content p {
          font-size: 20px !important;
          line-height: 1.9 !important;
          margin-bottom: 1.5rem !important;
          color: #ffffff !important;
        }
        .blog-content a {
          color: #60a5fa !important;
          text-decoration: underline !important;
        }
        .blog-content strong, .blog-content b {
          color: #ffffff !important;
          font-weight: 800 !important;
        }
        .blog-content ul, .blog-content ol {
          color: #ffffff !important;
          font-size: 20px !important;
          margin: 1.5rem 0 !important;
          padding-left: 2rem !important;
        }
        .blog-content li {
          color: #ffffff !important;
          margin-bottom: 0.75rem !important;
        }
        .blog-content code {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #fbbf24 !important;
          padding: 0.25rem 0.5rem !important;
          border-radius: 0.25rem !important;
          font-size: 0.9em !important;
        }
        .blog-content pre {
          background: rgba(0, 0, 0, 0.5) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 0.5rem !important;
          padding: 1.5rem !important;
          overflow-x: auto !important;
          margin: 1.5rem 0 !important;
        }
        .blog-content blockquote {
          border-left: 4px solid #60a5fa !important;
          padding-left: 1.5rem !important;
          margin: 1.5rem 0 !important;
          color: #e5e7eb !important;
          font-style: italic !important;
        }
        .blog-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.75rem !important;
          margin: 2rem 0 !important;
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

        {/* Cover Image - Supports CDN, Local, and Base64 */}
        {post.coverImage && (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 border border-white/10 shadow-2xl bg-gray-900">
            {post.coverImage.startsWith('data:') ? (
              // Base64 embedded image
              <img
                src={post.coverImage}
                alt={post.coverImageAlt || post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Base64 image failed to display')
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              // CDN or local file
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt || post.title}
                fill
                className="object-cover"
                priority
                unoptimized
                onError={(e) => {
                  console.error('Image failed to load:', post.coverImage)
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
          </div>
        )}

        {/* Content with Advanced Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Social Share Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <SocialShare
              title={post.title}
              url={`/blog/${post.slug}`}
              description={post.metaDescription || post.excerpt}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-11">
            <div className="bg-black/50 rounded-2xl p-8 lg:p-12 backdrop-blur-md border border-white/10">
              <BlogContent content={post.content} title={post.title} />
            </div>
          </div>
        </div>

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
    </>
  )
}
