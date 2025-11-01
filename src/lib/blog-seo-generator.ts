/**
 * Advanced SEO Content Generator for Blog Posts
 * Automatically generates keywords, tags, meta descriptions, summaries, and slugs
 */

interface SEOData {
  keywords: string[]
  tags: string[]
  metaTitle: string
  metaDescription: string
  summary: string
  slug: string
  readingTime: number
}

/**
 * Extract text from HTML content
 */
function extractTextFromHTML(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Calculate reading time in minutes
 */
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Generate SEO-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Extract keywords using frequency analysis and NLP heuristics
 */
function extractKeywords(text: string, title: string): string[] {
  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
    'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
    'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
    'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its',
    'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
    'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any',
    'these', 'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has',
    'had', 'were', 'said', 'did', 'having', 'may', 'should', 'am', 'being'
  ])

  // Combine title (weighted more) and content
  const combinedText = `${title} ${title} ${title} ${text}`.toLowerCase()
  
  // Extract words and phrases
  const words = combinedText.match(/\b[a-z]{3,}\b/g) || []
  
  // Count frequency
  const frequency: Record<string, number> = {}
  words.forEach(word => {
    if (!stopWords.has(word)) {
      frequency[word] = (frequency[word] || 0) + 1
    }
  })

  // Extract 2-word phrases (bigrams)
  const bigrams: Record<string, number> = {}
  for (let i = 0; i < words.length - 1; i++) {
    const word1 = words[i]
    const word2 = words[i + 1]
    if (!stopWords.has(word1) && !stopWords.has(word2)) {
      const bigram = `${word1} ${word2}`
      bigrams[bigram] = (bigrams[bigram] || 0) + 1
    }
  }

  // Sort by frequency and get top keywords
  const topWords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word)

  const topBigrams = Object.entries(bigrams)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([phrase]) => phrase)

  // Combine and deduplicate
  const keywords = [...new Set([...topBigrams, ...topWords])].slice(0, 15)
  
  return keywords
}

/**
 * Generate tags from keywords and content analysis
 */
function generateTags(keywords: string[], text: string, title: string): string[] {
  const tags: Set<string> = new Set()
  
  // Technology-related patterns
  const techPatterns = {
    'JavaScript': /\b(javascript|js|node\.?js|react|vue|angular|typescript|ts)\b/gi,
    'Web Development': /\b(web development|frontend|backend|full[- ]?stack|html|css)\b/gi,
    'AI': /\b(artificial intelligence|machine learning|ai|ml|deep learning|neural network)\b/gi,
    'Mobile': /\b(mobile|ios|android|react native|flutter|app development)\b/gi,
    'Cloud': /\b(cloud|aws|azure|gcp|serverless|kubernetes|docker)\b/gi,
    'Database': /\b(database|sql|nosql|mongodb|postgresql|mysql|redis)\b/gi,
    'DevOps': /\b(devops|ci\/cd|deployment|jenkins|github actions)\b/gi,
    'Security': /\b(security|cybersecurity|encryption|authentication|authorization)\b/gi,
    'API': /\b(api|rest|graphql|webhook|microservices)\b/gi,
    'Testing': /\b(testing|test|qa|unit test|integration test|e2e)\b/gi,
    'Design': /\b(design|ui|ux|user interface|user experience|figma|sketch)\b/gi,
    'Performance': /\b(performance|optimization|speed|caching|cdn)\b/gi,
    'SEO': /\b(seo|search engine|ranking|optimization|meta tags)\b/gi,
    'Tutorial': /\b(tutorial|guide|how to|learn|beginners?|step by step)\b/gi,
    'Best Practices': /\b(best practices|tips|tricks|patterns|architecture)\b/gi,
  }

  const combinedText = `${title} ${text}`
  
  // Match technology patterns
  Object.entries(techPatterns).forEach(([tag, pattern]) => {
    if (pattern.test(combinedText)) {
      tags.add(tag)
    }
  })

  // Add top keywords as tags (capitalized)
  keywords.slice(0, 5).forEach(keyword => {
    const capitalizedTag = keyword
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    tags.add(capitalizedTag)
  })

  return Array.from(tags).slice(0, 10)
}

/**
 * Generate meta description from content
 */
function generateMetaDescription(text: string, title: string, maxLength: number = 155): string {
  // Try to find the first meaningful sentence
  const sentences = text.match(/[^.!?]+[.!?]+/g) || []
  
  let description = ''
  
  // Use first 2-3 sentences
  for (const sentence of sentences.slice(0, 3)) {
    const cleanSentence = sentence.trim()
    if (description.length + cleanSentence.length <= maxLength - 3) {
      description += cleanSentence + ' '
    } else {
      break
    }
  }

  description = description.trim()
  
  // If still empty or too short, use beginning of text
  if (description.length < 50) {
    description = text.substring(0, maxLength - 3)
  }

  // Ensure it ends properly
  if (description.length >= maxLength - 3) {
    description = description.substring(0, maxLength - 3) + '...'
  }

  return description
}

/**
 * Generate meta title optimized for SEO
 */
function generateMetaTitle(title: string, keywords: string[]): string {
  // If title is already good length (under 60 chars), use it
  if (title.length <= 60) {
    return title
  }

  // Truncate and add relevant keyword if possible
  const truncated = title.substring(0, 50).trim()
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > 30) {
    return truncated.substring(0, lastSpace) + '...'
  }

  return truncated + '...'
}

/**
 * Generate a concise summary of the content
 */
function generateSummary(text: string, maxLength: number = 300): string {
  // Get first paragraph or first few sentences
  const paragraphs = text.split(/\n\n+/)
  let summary = paragraphs[0] || ''

  // If first paragraph is too short, add more
  if (summary.length < 100 && paragraphs.length > 1) {
    summary += ' ' + paragraphs[1]
  }

  // Truncate if too long
  if (summary.length > maxLength) {
    summary = summary.substring(0, maxLength - 3)
    const lastSpace = summary.lastIndexOf(' ')
    if (lastSpace > maxLength - 50) {
      summary = summary.substring(0, lastSpace) + '...'
    } else {
      summary += '...'
    }
  }

  return summary
}

/**
 * Main function: Generate all SEO data from blog post content
 */
export function generateBlogSEO(title: string, htmlContent: string, existingSlug?: string): SEOData {
  // Extract plain text from HTML
  const plainText = extractTextFromHTML(htmlContent)

  // Generate slug (use existing if provided and valid)
  const slug = existingSlug && existingSlug.length > 0 
    ? existingSlug 
    : generateSlug(title)

  // Calculate reading time
  const readingTime = calculateReadingTime(plainText)

  // Extract keywords
  const keywords = extractKeywords(plainText, title)

  // Generate tags
  const tags = generateTags(keywords, plainText, title)

  // Generate meta description
  const metaDescription = generateMetaDescription(plainText, title)

  // Generate meta title
  const metaTitle = generateMetaTitle(title, keywords)

  // Generate summary
  const summary = generateSummary(plainText)

  return {
    keywords,
    tags,
    metaTitle,
    metaDescription,
    summary,
    slug,
    readingTime
  }
}

/**
 * Validate and ensure slug uniqueness (to be used with database check)
 */
export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug
  let counter = 1

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}
