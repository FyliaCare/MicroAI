import { google } from 'googleapis'
import { Readable } from 'stream'

/**
 * Google Drive Service for MicroAI Systems
 * 
 * This service handles all file operations with Google Drive:
 * - Upload files to project-specific folders
 * - List files in a project folder
 * - Delete files
 * - Get file metadata and download URLs
 * 
 * Folder Structure:
 * - MicroAI Projects/
 *   - [Project Name]/
 *     - file1.pdf
 *     - file2.png
 */

// Initialize Google Drive API
const getGoogleDriveClient = () => {
  const credentials = process.env.GOOGLE_DRIVE_CREDENTIALS
  
  if (!credentials) {
    throw new Error('GOOGLE_DRIVE_CREDENTIALS environment variable is not set')
  }

  try {
    const parsedCredentials = JSON.parse(credentials)
    
    const auth = new google.auth.GoogleAuth({
      credentials: parsedCredentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    })

    return google.drive({ version: 'v3', auth })
  } catch (error) {
    console.error('Failed to initialize Google Drive client:', error)
    throw new Error('Invalid Google Drive credentials')
  }
}

/**
 * Get or create the root "MicroAI Projects" folder
 */
async function getRootFolderId(): Promise<string> {
  const drive = getGoogleDriveClient()
  const folderName = 'MicroAI Projects'

  // Search for existing folder
  const response = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive',
  })

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!
  }

  // Create the folder if it doesn't exist
  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  }

  const folder = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id',
  })

  return folder.data.id!
}

/**
 * Get or create a project-specific folder
 */
async function getProjectFolderId(projectName: string): Promise<string> {
  const drive = getGoogleDriveClient()
  const rootFolderId = await getRootFolderId()

  // Sanitize project name for folder
  const sanitizedName = projectName.replace(/[<>:"/\\|?*]/g, '_')

  // Search for existing project folder
  const response = await drive.files.list({
    q: `name='${sanitizedName}' and '${rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive',
  })

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!
  }

  // Create the project folder
  const fileMetadata = {
    name: sanitizedName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [rootFolderId],
  }

  const folder = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id',
  })

  console.log(`📁 Created Google Drive folder for project: ${sanitizedName}`)
  return folder.data.id!
}

/**
 * Upload a file to Google Drive
 */
export async function uploadToGoogleDrive(
  file: Buffer,
  filename: string,
  mimeType: string,
  projectName: string
): Promise<{
  id: string
  name: string
  webViewLink: string
  webContentLink: string
  thumbnailLink?: string
}> {
  try {
    const drive = getGoogleDriveClient()
    const folderId = await getProjectFolderId(projectName)

    // Create a readable stream from the buffer
    const bufferStream = new Readable()
    bufferStream.push(file)
    bufferStream.push(null)

    // Upload file metadata and content
    const fileMetadata = {
      name: filename,
      parents: [folderId],
    }

    const media = {
      mimeType,
      body: bufferStream,
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink, thumbnailLink',
    })

    // Make the file accessible to anyone with the link
    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    })

    console.log(`✅ Uploaded file to Google Drive: ${filename}`)

    return {
      id: response.data.id!,
      name: response.data.name!,
      webViewLink: response.data.webViewLink!,
      webContentLink: response.data.webContentLink!,
      thumbnailLink: response.data.thumbnailLink,
    }
  } catch (error) {
    console.error('Google Drive upload error:', error)
    throw new Error('Failed to upload file to Google Drive')
  }
}

/**
 * List all files in a project folder
 */
export async function listProjectFiles(projectName: string): Promise<Array<{
  id: string
  name: string
  size: number
  mimeType: string
  webViewLink: string
  webContentLink: string
  thumbnailLink?: string
  createdTime: string
  modifiedTime: string
}>> {
  try {
    const drive = getGoogleDriveClient()
    const folderId = await getProjectFolderId(projectName)

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, size, mimeType, webViewLink, webContentLink, thumbnailLink, createdTime, modifiedTime)',
      orderBy: 'createdTime desc',
      spaces: 'drive',
    })

    return (response.data.files || []).map(file => ({
      id: file.id!,
      name: file.name!,
      size: parseInt(file.size || '0'),
      mimeType: file.mimeType!,
      webViewLink: file.webViewLink!,
      webContentLink: file.webContentLink!,
      thumbnailLink: file.thumbnailLink,
      createdTime: file.createdTime!,
      modifiedTime: file.modifiedTime!,
    }))
  } catch (error) {
    console.error('Google Drive list files error:', error)
    throw new Error('Failed to list project files from Google Drive')
  }
}

/**
 * Delete a file from Google Drive
 */
export async function deleteFromGoogleDrive(fileId: string): Promise<void> {
  try {
    const drive = getGoogleDriveClient()
    await drive.files.delete({
      fileId,
    })
    console.log(`🗑️ Deleted file from Google Drive: ${fileId}`)
  } catch (error) {
    console.error('Google Drive delete error:', error)
    throw new Error('Failed to delete file from Google Drive')
  }
}

/**
 * Get file metadata
 */
export async function getFileMetadata(fileId: string): Promise<{
  id: string
  name: string
  size: number
  mimeType: string
  webViewLink: string
  webContentLink: string
  thumbnailLink?: string
  createdTime: string
  modifiedTime: string
}> {
  try {
    const drive = getGoogleDriveClient()
    const response = await drive.files.get({
      fileId,
      fields: 'id, name, size, mimeType, webViewLink, webContentLink, thumbnailLink, createdTime, modifiedTime',
    })

    return {
      id: response.data.id!,
      name: response.data.name!,
      size: parseInt(response.data.size || '0'),
      mimeType: response.data.mimeType!,
      webViewLink: response.data.webViewLink!,
      webContentLink: response.data.webContentLink!,
      thumbnailLink: response.data.thumbnailLink,
      createdTime: response.data.createdTime!,
      modifiedTime: response.data.modifiedTime!,
    }
  } catch (error) {
    console.error('Google Drive get metadata error:', error)
    throw new Error('Failed to get file metadata from Google Drive')
  }
}

/**
 * Get a direct download URL for a file
 */
export function getDirectDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}
