// File Upload and Storage Utility
import { writeFile, mkdir, unlink, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { prisma } from './prisma'

export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
]

/**
 * Ensure upload directory exists
 */
export async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

/**
 * Generate unique filename
 */
function generateFilename(originalName: string): string {
  const ext = path.extname(originalName)
  const hash = crypto.randomBytes(16).toString('hex')
  const timestamp = Date.now()
  return `${timestamp}-${hash}${ext}`
}

/**
 * Validate file
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }
  
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    }
  }
  
  return { valid: true }
}

/**
 * Upload file
 */
export async function uploadFile(
  file: File,
  folder = ''
): Promise<{
  filename: string
  path: string
  url: string
  size: number
  mimeType: string
}> {
  await ensureUploadDir()
  
  // Validate file
  const validation = validateFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }
  
  // Generate unique filename
  const filename = generateFilename(file.name)
  
  // Determine upload path
  const uploadPath = folder 
    ? path.join(UPLOAD_DIR, folder)
    : UPLOAD_DIR
  
  // Ensure folder exists
  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true })
  }
  
  // Full file path
  const filePath = path.join(uploadPath, filename)
  
  // Convert File to Buffer
  const buffer = Buffer.from(await file.arrayBuffer())
  
  // Save file
  await writeFile(filePath, buffer)
  
  // Generate URL
  const url = folder
    ? `/uploads/${folder}/${filename}`
    : `/uploads/${filename}`
  
  return {
    filename,
    path: filePath,
    url,
    size: file.size,
    mimeType: file.type,
  }
}

/**
 * Delete file
 */
export async function deleteFile(filePath: string): Promise<void> {
  if (existsSync(filePath)) {
    await unlink(filePath)
  }
}

/**
 * Save document to database
 */
export async function saveDocument(
  file: File,
  data: {
    name: string
    projectId?: string
    clientId?: string
    uploadedBy?: string
    folder?: string
  }
) {
  const upload = await uploadFile(file, data.folder)
  
  const document = await prisma.document.create({
    data: {
      name: data.name,
      description: `${upload.filename} (${upload.mimeType})`,
      type: 'other',
      fileUrl: upload.url,
      fileSize: upload.size,
      mimeType: upload.mimeType,
      projectId: data.projectId,
      clientId: data.clientId,
      uploadedBy: data.uploadedBy,
    },
  })
  
  return document
}

/**
 * Delete document from database and storage
 */
export async function deleteDocument(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  })
  
  if (!document) {
    throw new Error('Document not found')
  }
  
  // Delete file from storage (extract path from URL if needed)
  if (document.fileUrl) {
    const filePath = document.fileUrl.replace(/^\/uploads\//, '')
    await deleteFile(filePath)
  }
  
  // Delete from database
  await prisma.document.delete({
    where: { id: documentId },
  })
}

/**
 * Get document download URL
 */
export async function getDocumentDownloadUrl(documentId: string): Promise<string> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  })
  
  if (!document) {
    throw new Error('Document not found')
  }
  
  return document.fileUrl
}

/**
 * Get document file content
 */
export async function getDocumentContent(documentId: string): Promise<Buffer> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  })
  
  if (!document || !document.fileUrl) {
    throw new Error('Document not found')
  }
  
  // Extract file path from URL
  const filePath = document.fileUrl.replace(/^\/uploads\//, '')
  return await readFile(filePath)
}

/**
 * Get project documents
 */
export async function getProjectDocuments(projectId: string) {
  return await prisma.document.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get client documents
 */
export async function getClientDocuments(clientId: string) {
  return await prisma.document.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  })
}
