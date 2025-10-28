-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_projectId_fkey";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "city" TEXT,
ADD COLUMN     "companySize" TEXT,
ADD COLUMN     "country" TEXT DEFAULT 'Ghana',
ADD COLUMN     "customFields" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "preferredContact" TEXT,
ADD COLUMN     "referredBy" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "tags" TEXT,
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "timezone" TEXT DEFAULT 'Africa/Accra';

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'GHS',
ADD COLUMN     "discountType" TEXT NOT NULL DEFAULT 'amount',
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastReminderAt" TIMESTAMP(3),
ADD COLUMN     "recurringPeriod" TEXT,
ADD COLUMN     "remindersSent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "actualHours" DOUBLE PRECISION,
ADD COLUMN     "attachments" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'GHS',
ADD COLUMN     "customFields" TEXT,
ADD COLUMN     "demoUrl" TEXT,
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "estimatedHours" DOUBLE PRECISION,
ADD COLUMN     "health" TEXT NOT NULL DEFAULT 'good',
ADD COLUMN     "hosting" TEXT,
ADD COLUMN     "lastChecked" TIMESTAMP(3),
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "sslCertificate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT,
ADD COLUMN     "uptime" DOUBLE PRECISION NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "attachments" TEXT,
ADD COLUMN     "checklist" TEXT;

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "title" TEXT,
    "skills" TEXT,
    "hourlyRate" DOUBLE PRECISION,
    "availability" TEXT NOT NULL DEFAULT 'available',
    "password" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "avatar" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTeam" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeEntry" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "billable" BOOLEAN NOT NULL DEFAULT true,
    "hourlyRate" DOUBLE PRECISION,
    "projectId" TEXT,
    "taskId" TEXT,
    "memberId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "clientId" TEXT,
    "projectId" TEXT,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT,
    "taskId" TEXT,
    "authorId" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Communication" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "clientId" TEXT,
    "from" TEXT,
    "to" TEXT,
    "cc" TEXT,
    "attachments" TEXT,
    "sentBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "content" TEXT NOT NULL,
    "clientId" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "value" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "documentUrl" TEXT,
    "signedDocumentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "commitHash" TEXT,
    "branch" TEXT,
    "deployedBy" TEXT,
    "url" TEXT,
    "notes" TEXT,
    "changelog" TEXT,
    "buildTime" INTEGER,
    "projectId" TEXT NOT NULL,
    "deployedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "paymentMethod" TEXT,
    "receipt" TEXT,
    "projectId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "vendor" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "method" TEXT NOT NULL,
    "reference" TEXT,
    "receipt" TEXT,
    "invoiceId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "userId" TEXT,
    "userEmail" TEXT,
    "userIp" TEXT,
    "userAgent" TEXT,
    "description" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "variables" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "provider" TEXT,
    "providerId" TEXT,
    "error" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "templateId" TEXT,
    "clientId" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "permissions" TEXT NOT NULL,
    "rateLimit" INTEGER NOT NULL DEFAULT 1000,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEndpoint" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "events" TEXT NOT NULL,
    "secret" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookEndpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookDelivery" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "responseCode" INTEGER,
    "responseBody" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextRetryAt" TIMESTAMP(3),
    "webhookId" TEXT NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Backup" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "fileUrl" TEXT,
    "fileSize" INTEGER,
    "recordCount" INTEGER,
    "duration" INTEGER,
    "error" TEXT,
    "isScheduled" BOOLEAN NOT NULL DEFAULT false,
    "triggeredBy" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Backup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_email_key" ON "TeamMember"("email");

-- CreateIndex
CREATE INDEX "TeamMember_email_idx" ON "TeamMember"("email");

-- CreateIndex
CREATE INDEX "TeamMember_role_idx" ON "TeamMember"("role");

-- CreateIndex
CREATE INDEX "TeamMember_isActive_idx" ON "TeamMember"("isActive");

-- CreateIndex
CREATE INDEX "ProjectTeam_projectId_idx" ON "ProjectTeam"("projectId");

-- CreateIndex
CREATE INDEX "ProjectTeam_memberId_idx" ON "ProjectTeam"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTeam_projectId_memberId_key" ON "ProjectTeam"("projectId", "memberId");

-- CreateIndex
CREATE INDEX "TimeEntry_projectId_idx" ON "TimeEntry"("projectId");

-- CreateIndex
CREATE INDEX "TimeEntry_taskId_idx" ON "TimeEntry"("taskId");

-- CreateIndex
CREATE INDEX "TimeEntry_memberId_idx" ON "TimeEntry"("memberId");

-- CreateIndex
CREATE INDEX "TimeEntry_date_idx" ON "TimeEntry"("date");

-- CreateIndex
CREATE INDEX "Document_clientId_idx" ON "Document"("clientId");

-- CreateIndex
CREATE INDEX "Document_projectId_idx" ON "Document"("projectId");

-- CreateIndex
CREATE INDEX "Document_type_idx" ON "Document"("type");

-- CreateIndex
CREATE INDEX "Document_createdAt_idx" ON "Document"("createdAt");

-- CreateIndex
CREATE INDEX "Comment_projectId_idx" ON "Comment"("projectId");

-- CreateIndex
CREATE INDEX "Comment_taskId_idx" ON "Comment"("taskId");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "Communication_clientId_idx" ON "Communication"("clientId");

-- CreateIndex
CREATE INDEX "Communication_type_idx" ON "Communication"("type");

-- CreateIndex
CREATE INDEX "Communication_createdAt_idx" ON "Communication"("createdAt");

-- CreateIndex
CREATE INDEX "Contract_clientId_idx" ON "Contract"("clientId");

-- CreateIndex
CREATE INDEX "Contract_status_idx" ON "Contract"("status");

-- CreateIndex
CREATE INDEX "Contract_type_idx" ON "Contract"("type");

-- CreateIndex
CREATE INDEX "Contract_startDate_idx" ON "Contract"("startDate");

-- CreateIndex
CREATE INDEX "Deployment_projectId_idx" ON "Deployment"("projectId");

-- CreateIndex
CREATE INDEX "Deployment_environment_idx" ON "Deployment"("environment");

-- CreateIndex
CREATE INDEX "Deployment_status_idx" ON "Deployment"("status");

-- CreateIndex
CREATE INDEX "Deployment_deployedAt_idx" ON "Deployment"("deployedAt");

-- CreateIndex
CREATE INDEX "Expense_projectId_idx" ON "Expense"("projectId");

-- CreateIndex
CREATE INDEX "Expense_category_idx" ON "Expense"("category");

-- CreateIndex
CREATE INDEX "Expense_date_idx" ON "Expense"("date");

-- CreateIndex
CREATE INDEX "Expense_status_idx" ON "Expense"("status");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_paidAt_idx" ON "Payment"("paidAt");

-- CreateIndex
CREATE INDEX "Payment_reference_idx" ON "Payment"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- CreateIndex
CREATE INDEX "Setting_category_idx" ON "Setting"("category");

-- CreateIndex
CREATE INDEX "AuditLog_entity_idx" ON "AuditLog"("entity");

-- CreateIndex
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "EmailTemplate_type_idx" ON "EmailTemplate"("type");

-- CreateIndex
CREATE INDEX "EmailTemplate_isActive_idx" ON "EmailTemplate"("isActive");

-- CreateIndex
CREATE INDEX "EmailLog_to_idx" ON "EmailLog"("to");

-- CreateIndex
CREATE INDEX "EmailLog_status_idx" ON "EmailLog"("status");

-- CreateIndex
CREATE INDEX "EmailLog_createdAt_idx" ON "EmailLog"("createdAt");

-- CreateIndex
CREATE INDEX "EmailLog_templateId_idx" ON "EmailLog"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "ApiKey_key_idx" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "ApiKey_isActive_idx" ON "ApiKey"("isActive");

-- CreateIndex
CREATE INDEX "WebhookEndpoint_isActive_idx" ON "WebhookEndpoint"("isActive");

-- CreateIndex
CREATE INDEX "WebhookDelivery_webhookId_idx" ON "WebhookDelivery"("webhookId");

-- CreateIndex
CREATE INDEX "WebhookDelivery_status_idx" ON "WebhookDelivery"("status");

-- CreateIndex
CREATE INDEX "WebhookDelivery_createdAt_idx" ON "WebhookDelivery"("createdAt");

-- CreateIndex
CREATE INDEX "Backup_type_idx" ON "Backup"("type");

-- CreateIndex
CREATE INDEX "Backup_status_idx" ON "Backup"("status");

-- CreateIndex
CREATE INDEX "Backup_createdAt_idx" ON "Backup"("createdAt");

-- CreateIndex
CREATE INDEX "Client_company_idx" ON "Client"("company");

-- CreateIndex
CREATE INDEX "Client_country_idx" ON "Client"("country");

-- CreateIndex
CREATE INDEX "Invoice_clientId_idx" ON "Invoice"("clientId");

-- CreateIndex
CREATE INDEX "Invoice_projectId_idx" ON "Invoice"("projectId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_invoiceNumber_idx" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_dueDate_idx" ON "Invoice"("dueDate");

-- CreateIndex
CREATE INDEX "Invoice_issuedAt_idx" ON "Invoice"("issuedAt");

-- CreateIndex
CREATE INDEX "Project_health_idx" ON "Project"("health");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_priority_idx" ON "Task"("priority");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeam" ADD CONSTRAINT "ProjectTeam_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeam" ADD CONSTRAINT "ProjectTeam_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Communication" ADD CONSTRAINT "Communication_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "WebhookEndpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
