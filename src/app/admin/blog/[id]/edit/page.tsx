import BlogPostEditor from '@/components/admin/BlogPostEditor'

export const metadata = {
  title: 'Edit Blog Post | MicroAI Systems',
  description: 'Edit blog post',
}

interface EditBlogPostPageProps {
  params: {
    id: string
  }
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  return <BlogPostEditor postId={params.id} isEdit={true} />
}
