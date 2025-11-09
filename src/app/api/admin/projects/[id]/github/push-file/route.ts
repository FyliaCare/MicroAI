import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { fileId, filename, fileUrl, targetPath } = await request.json();

    if (!fileId || !filename || !fileUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: fileId, filename, fileUrl' },
        { status: 400 }
      );
    }

    // Get the project to check for GitHub repository
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { 
        id: true, 
        name: true, 
        githubRepo: true 
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.githubRepo) {
      return NextResponse.json(
        { error: 'No GitHub repository linked to this project' },
        { status: 400 }
      );
    }

    // Parse GitHub repository URL to get owner and repo name
    const githubUrlMatch = project.githubRepo.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!githubUrlMatch) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL format' },
        { status: 400 }
      );
    }

    const [, owner, repo] = githubUrlMatch;
    const repoName = repo.replace('.git', '');

    // Check if GitHub token is available
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token not configured. Please set GITHUB_TOKEN in environment variables.' },
        { status: 500 }
      );
    }

    // Download the file from the URL
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to download file from URL' },
        { status: 500 }
      );
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const base64Content = Buffer.from(fileBuffer).toString('base64');

    // Determine the path in the repository
    const repoPath = targetPath || `uploads/${filename}`;

    // Check if file already exists in the repository
    let sha: string | undefined;
    try {
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/contents/${repoPath}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (getFileResponse.ok) {
        const existingFile = await getFileResponse.json();
        sha = existingFile.sha; // Get SHA to update existing file
      }
    } catch (error) {
      // File doesn't exist, which is fine
    }

    // Push the file to GitHub
    const commitMessage = sha 
      ? `Update ${filename} for project: ${project.name}`
      : `Add ${filename} for project: ${project.name}`;

    const pushResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/contents/${repoPath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: base64Content,
          ...(sha && { sha }), // Include SHA if updating existing file
        }),
      }
    );

    if (!pushResponse.ok) {
      const errorData = await pushResponse.json();
      console.error('GitHub API Error:', errorData);
      return NextResponse.json(
        { error: `Failed to push to GitHub: ${errorData.message || 'Unknown error'}` },
        { status: pushResponse.status }
      );
    }

    const result = await pushResponse.json();

    // Update the file record to indicate it's been pushed to GitHub
    await prisma.projectFile.update({
      where: { id: fileId },
      data: {
        description: `${project.name} - Pushed to GitHub at ${repoPath}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'File successfully pushed to GitHub',
      githubUrl: result.content.html_url,
      path: repoPath,
    });

  } catch (error) {
    console.error('Error pushing file to GitHub:', error);
    return NextResponse.json(
      { 
        error: 'Failed to push file to GitHub',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
