// Audit Logging Utility
import { prisma } from './prisma'

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

export enum AuditEntityType {
  CLIENT = 'Client',
  PROJECT = 'Project',
  QUOTE = 'Quote',
  INVOICE = 'Invoice',
  RECEIPT = 'Receipt',
  SERVICE = 'Service',
  TEAM_MEMBER = 'TeamMember',
  TIME_ENTRY = 'TimeEntry',
  TASK = 'Task',
  DOCUMENT = 'Document',
  COMMENT = 'Comment',
  COMMUNICATION = 'Communication',
  CONTRACT = 'Contract',
  DEPLOYMENT = 'Deployment',
  EXPENSE = 'Expense',
  PAYMENT = 'Payment',
  SETTING = 'Setting',
  USER = 'User',
}

interface AuditLogData {
  action: AuditAction
  entityType: AuditEntityType
  entityId: string
  userId?: string
  changes?: Record<string, any>
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data: {
        action: data.action,
        entity: data.entityType, // entityType -> entity
        entityId: data.entityId,
        userId: data.userId,
        oldValue: data.changes ? JSON.stringify(data.changes) : undefined, // changes -> oldValue/newValue
        userIp: data.ipAddress, // ipAddress -> userIp
        userAgent: data.userAgent,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
    })
  } catch (error) {
    // Don't throw errors from audit logging - just log them
    console.error('Failed to create audit log:', error)
  }
}

/**
 * Log a create action
 */
export async function logCreate(
  entityType: AuditEntityType,
  entityId: string,
  data: any,
  userId?: string,
  metadata?: Record<string, any>
) {
  await createAuditLog({
    action: AuditAction.CREATE,
    entityType,
    entityId,
    userId,
    changes: { created: data },
    metadata,
  })
}

/**
 * Log an update action
 */
export async function logUpdate(
  entityType: AuditEntityType,
  entityId: string,
  oldData: any,
  newData: any,
  userId?: string,
  metadata?: Record<string, any>
) {
  // Calculate what changed
  const changes: Record<string, any> = {}
  
  Object.keys(newData).forEach(key => {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      changes[key] = {
        from: oldData[key],
        to: newData[key],
      }
    }
  })
  
  await createAuditLog({
    action: AuditAction.UPDATE,
    entityType,
    entityId,
    userId,
    changes,
    metadata,
  })
}

/**
 * Log a delete action
 */
export async function logDelete(
  entityType: AuditEntityType,
  entityId: string,
  data: any,
  userId?: string,
  metadata?: Record<string, any>
) {
  await createAuditLog({
    action: AuditAction.DELETE,
    entityType,
    entityId,
    userId,
    changes: { deleted: data },
    metadata,
  })
}

/**
 * Get audit logs for an entity
 */
export async function getAuditLogs(
  entityType: AuditEntityType,
  entityId: string,
  limit = 50
) {
  return await prisma.auditLog.findMany({
    where: {
      entity: entityType, // entityType -> entity
      entityId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}

/**
 * Get recent audit logs for a user
 */
export async function getUserAuditLogs(userId: string, limit = 50) {
  return await prisma.auditLog.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}

/**
 * Get audit logs within a date range
 */
export async function getAuditLogsByDateRange(
  startDate: Date,
  endDate: Date,
  entityType?: AuditEntityType,
  action?: AuditAction
) {
  return await prisma.auditLog.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(entityType && { entity: entityType }), // entityType -> entity
      ...(action && { action }),
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

/**
 * Search audit logs
 */
export async function searchAuditLogs(filters: {
  userId?: string
  entityType?: AuditEntityType
  entityId?: string
  action?: AuditAction
  startDate?: Date
  endDate?: Date
  limit?: number
}) {
  const { userId, entityType, entityId, action, startDate, endDate, limit = 100 } = filters
  
  return await prisma.auditLog.findMany({
    where: {
      ...(userId && { userId }),
      ...(entityType && { entity: entityType }), // entityType -> entity
      ...(entityId && { entityId }),
      ...(action && { action }),
      ...(startDate || endDate ? {
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      } : {}),
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}

/**
 * Export audit logs to JSON
 */
export async function exportAuditLogs(filters: Parameters<typeof searchAuditLogs>[0]) {
  const logs = await searchAuditLogs({ ...filters, limit: 10000 })
  
  return {
    exportedAt: new Date().toISOString(),
    totalRecords: logs.length,
    filters,
    data: logs,
  }
}
