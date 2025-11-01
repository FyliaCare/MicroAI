import Script from 'next/script'

interface OrganizationSchemaProps {
  url?: string
}

export function OrganizationSchema({ url }: OrganizationSchemaProps) {
  const baseUrl = url || process.env.NEXT_PUBLIC_URL || 'https://www.microaisystems.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MicroAI Systems',
    alternateName: 'MicroAI',
    url: baseUrl,
    logo: `${baseUrl}/microAi logo main.png`,
    description: 'Revolutionary development technology delivering web applications, SaaS platforms, and digital solutions in 1/10th the time. Serving clients worldwide across Africa, North America, Europe, UK, and Australia.',
    email: 'sales@microaisystems.com',
    telephone: '+233-244-486-837',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Multiple',
    },
    sameAs: [
      // Add social media profiles when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'sales@microaisystems.com',
      telephone: '+233-244-486-837',
      contactType: 'Customer Service',
      availableLanguage: ['English'],
      areaServed: ['US', 'CA', 'GB', 'AU', 'NZ', 'ZA', 'NG', 'GH', 'KE', 'EU'],
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'United States',
      },
      {
        '@type': 'Country',
        name: 'Canada',
      },
      {
        '@type': 'Country',
        name: 'United Kingdom',
      },
      {
        '@type': 'Country',
        name: 'Australia',
      },
      {
        '@type': 'Country',
        name: 'New Zealand',
      },
      {
        '@type': 'Country',
        name: 'South Africa',
      },
      {
        '@type': 'Country',
        name: 'Nigeria',
      },
      {
        '@type': 'Country',
        name: 'Ghana',
      },
      {
        '@type': 'Country',
        name: 'Kenya',
      },
      {
        '@type': 'Place',
        name: 'European Union',
      },
    ],
    knowsAbout: [
      'Web Development',
      'SaaS Development',
      'Web Applications',
      'Software Development',
      'AI Development',
      'Fast Development',
      'Next.js Development',
      'TypeScript Development',
    ],
    slogan: '10x Faster Development Technology',
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebsiteSchemaProps {
  url?: string
}

export function WebsiteSchema({ url }: WebsiteSchemaProps) {
  const baseUrl = url || process.env.NEXT_PUBLIC_URL || 'https://www.microaisystems.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MicroAI Systems',
    url: baseUrl,
    description: 'Revolutionary development technology delivering web applications 10x faster',
    publisher: {
      '@type': 'Organization',
      name: 'MicroAI Systems',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ServiceSchemaProps {
  name: string
  description: string
  url: string
  image?: string
  priceRange?: string
  offers?: {
    name: string
    description: string
  }[]
}

export function ServiceSchema({ name, description, url, image, priceRange, offers }: ServiceSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.microaisystems.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    provider: {
      '@type': 'Organization',
      name: 'MicroAI Systems',
      url: baseUrl,
    },
    description,
    url,
    image: image || `${baseUrl}/microAi logo main.png`,
    areaServed: {
      '@type': 'GeoShape',
      name: 'Worldwide',
    },
    hasOfferCatalog: offers ? {
      '@type': 'OfferCatalog',
      name: `${name} Services`,
      itemListElement: offers.map(offer => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: offer.name,
          description: offer.description,
        },
      })),
    } : undefined,
    ...(priceRange && {
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          price: priceRange,
        },
      },
    }),
  }

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  items: FAQItem[]
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function GlobalBusinessSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.microaisystems.com'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'MicroAI Systems',
    image: `${baseUrl}/microAi logo main.png`,
    '@id': baseUrl,
    url: baseUrl,
    telephone: '+233-244-486-837',
    email: 'sales@microaisystems.com',
    priceRange: '$$-$$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Multiple',
    },
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Country', name: 'New Zealand' },
      { '@type': 'Country', name: 'South Africa' },
      { '@type': 'Country', name: 'Nigeria' },
      { '@type': 'Country', name: 'Ghana' },
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'Place', name: 'European Union' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '00:00',
      closes: '23:59',
    },
    availableLanguage: ['English'],
    currenciesAccepted: 'USD, EUR, GBP, CAD, AUD, ZAR',
    paymentAccepted: 'Credit Card, Debit Card, PayPal, Wire Transfer, Cryptocurrency',
    sameAs: [],
  }

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
