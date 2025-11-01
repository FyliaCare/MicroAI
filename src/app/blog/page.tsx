import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Blog | MicroAI Systems',
  description: 'Latest insights, tutorials, and updates on web development, AI integration, and modern software engineering from MicroAI Systems.',
  openGraph: {
    title: 'Blog | MicroAI Systems',
    description: 'Web development insights and tutorials',
    type: 'website',
  },
}

async function getBlogPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/blog?limit=50`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (!response.ok) {
      return { posts: [], pagination: null }
    }
    
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    return { posts: [], pagination: null }
  }
}

export default async function BlogPage() {
  const { posts } = await getBlogPosts()

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black">
      <AdvancedNavbar />
      
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 mb-6">
              <span className="text-blue-400 text-sm font-medium">📚 MicroAI Blog</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Insights & Tutorials
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore the latest trends in web development, AI integration, and software engineering. 
              Learn from our experience building cutting-edge applications.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              No Blog Posts Yet
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              We're working on creating amazing content for you. Check back soon for insightful articles and tutorials!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Return Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
              >
                {/* Cover Image */}
                {post.coverImage ? (
                  <div className="relative h-48 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                    <Image
                      src={post.coverImage}
                      alt={post.coverImageAlt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.featured && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                        ⭐ Featured
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  {post.category && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">
                        {post.category}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      {post.authorName && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {post.authorName}
                        </span>
                      )}
                      {post.readingTime && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {post.readingTime} min
                        </span>
                      )}
                    </div>
                    
                    {post.publishedAt && (
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  {(post.views > 0 || post.likes > 0) && (
                    <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-gray-800">
                      {post.views > 0 && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {post.views} views
                        </span>
                      )}
                      {post.likes > 0 && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {post.likes} likes
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
