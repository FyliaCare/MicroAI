import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json()

    if (!repoUrl) {
      return NextResponse.json({ success: false, error: 'Repository URL is required' }, { status: 400 })
    }

    // Extract owner and repo from GitHub URL
    // Supports: https://github.com/owner/repo or github.com/owner/repo
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/)?$/)
    
    if (!match) {
      return NextResponse.json({ success: false, error: 'Invalid GitHub repository URL' }, { status: 400 })
    }

    const [, owner, repo] = match

    // Fetch repository data from GitHub API
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github+json',
        // If you have a GitHub token, add it here for higher rate limits:
        // 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    })

    if (!repoResponse.ok) {
      if (repoResponse.status === 404) {
        return NextResponse.json({ success: false, error: 'Repository not found' }, { status: 404 })
      }
      return NextResponse.json({ success: false, error: 'Failed to fetch repository data' }, { status: 500 })
    }

    const repoData = await repoResponse.json()

    // Fetch languages used in the repository
    const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
      headers: {
        'Accept': 'application/vnd.github+json',
      },
    })

    let languages: string[] = []
    if (languagesResponse.ok) {
      const languagesData = await languagesResponse.json()
      languages = Object.keys(languagesData)
    }

    // Fetch latest commits to get last update info
    const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
      headers: {
        'Accept': 'application/vnd.github+json',
      },
    })

    let lastCommit = null
    if (commitsResponse.ok) {
      const commits = await commitsResponse.json()
      if (commits.length > 0) {
        lastCommit = {
          message: commits[0].commit.message,
          date: commits[0].commit.author.date,
          author: commits[0].commit.author.name,
          sha: commits[0].sha,
        }
      }
    }

    // Fetch README to get more context (optional)
    const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        'Accept': 'application/vnd.github+json',
      },
    })

    let readmeContent = ''
    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json()
      // README content is base64 encoded
      readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8')
    }

    // Extract useful information
    const projectInfo = {
      name: repoData.name,
      description: repoData.description || '',
      repositoryUrl: repoData.html_url,
      techStack: languages.join(', '),
      homepage: repoData.homepage || '',
      topics: repoData.topics || [],
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count,
      defaultBranch: repoData.default_branch,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      pushedAt: repoData.pushed_at,
      language: repoData.language,
      size: repoData.size,
      isPrivate: repoData.private,
      license: repoData.license?.name || null,
      lastCommit,
      readme: readmeContent.substring(0, 500), // First 500 chars for context
    }

    return NextResponse.json({ success: true, data: projectInfo })

  } catch (error) {
    console.error('Error fetching GitHub data:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
