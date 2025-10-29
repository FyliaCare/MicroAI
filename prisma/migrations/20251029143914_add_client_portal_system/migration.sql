/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "hasPortalAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'client',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "passwordChangedAt" TIMESTAMP(3),
    "accessExpiresAt" TIMESTAMP(3),
    "verificationToken" TEXT,
    "verificationExpiry" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "avatar" TEXT,
    "phone" TEXT,
    "timezone" TEXT DEFAULT 'Africa/Accra',
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRequest" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT,
    "clientCompany" TEXT,
    "clientWebsite" TEXT,
    "projectName" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "industry" TEXT,
    "requirements" TEXT NOT NULL,
    "features" TEXT,
    "techPreferences" TEXT,
    "budget" DOUBLE PRECISION,
    "budgetRange" TEXT,
    "timeline" TEXT,
    "startDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "rejectionReason" TEXT,
    "convertedToProject" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT,
    "clientId" TEXT,
    "chatTranscript" TEXT,
    "attachments" TEXT,
    "source" TEXT NOT NULL DEFAULT 'website',
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "ipAddress" TEXT,
    "country" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientUpload" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "format" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "colorPalette" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "previousVersionId" TEXT,
    "isLatest" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'active',
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "projectId" TEXT,
    "clientId" TEXT,
    "uploadedBy" TEXT,
    "uploadedByRole" TEXT,
    "tags" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUpdate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'progress',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "summary" TEXT,
    "attachments" TEXT,
    "progressBefore" INTEGER,
    "progressAfter" INTEGER,
    "projectId" TEXT NOT NULL,
    "postedBy" TEXT,
    "postedByName" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "emailRecipients" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUpdateRead" (
    "id" TEXT NOT NULL,
    "updateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectUpdateRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeAccessRequest" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "reason" TEXT,
    "githubUsername" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "rejectionReason" TEXT,
    "autoApprovedAt" TIMESTAMP(3),
    "repoUrl" TEXT,
    "accessGranted" BOOLEAN NOT NULL DEFAULT false,
    "accessGrantedAt" TIMESTAMP(3),
    "inviteSent" BOOLEAN NOT NULL DEFAULT false,
    "inviteAccepted" BOOLEAN NOT NULL DEFAULT false,
    "accessMethod" TEXT,
    "accessCredentials" TEXT,
    "downloadUrl" TEXT,
    "downloadExpiry" TIMESTAMP(3),
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodeAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailQueue" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "cc" TEXT,
    "bcc" TEXT,
    "subject" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "textContent" TEXT,
    "templateType" TEXT,
    "templateVars" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "lastAttemptAt" TIMESTAMP(3),
    "nextRetryAt" TIMESTAMP(3),
    "error" TEXT,
    "errorDetails" TEXT,
    "provider" TEXT,
    "providerId" TEXT,
    "metadata" TEXT,
    "userId" TEXT,
    "clientId" TEXT,
    "projectId" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledTask" (
    "id" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "cronExpression" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "lastStatus" TEXT,
    "lastRunDuration" INTEGER,
    "lastError" TEXT,
    "nextRunAt" TIMESTAMP(3),
    "executionCount" INTEGER NOT NULL DEFAULT 0,
    "config" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitHubIntegration" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "repoOwner" TEXT NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "repoId" INTEGER,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "defaultBranch" TEXT NOT NULL DEFAULT 'main',
    "webhookId" INTEGER,
    "webhookSecret" TEXT,
    "webhookActive" BOOLEAN NOT NULL DEFAULT false,
    "cloneUrl" TEXT,
    "sshUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSync" TIMESTAMP(3),
    "syncStatus" TEXT,
    "syncError" TEXT,
    "language" TEXT,
    "description" TEXT,
    "topics" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "country" TEXT,
    "city" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityFeed" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "actorType" TEXT NOT NULL,
    "actorId" TEXT,
    "actorName" TEXT,
    "targetType" TEXT,
    "targetId" TEXT,
    "targetName" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "visibleToClients" TEXT,
    "projectId" TEXT,
    "clientId" TEXT,
    "metadata" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityFeed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_isVerified_idx" ON "User"("isVerified");

-- CreateIndex
CREATE INDEX "User_accessExpiresAt_idx" ON "User"("accessExpiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRequest_requestNumber_key" ON "ProjectRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "ProjectRequest_status_idx" ON "ProjectRequest"("status");

-- CreateIndex
CREATE INDEX "ProjectRequest_clientEmail_idx" ON "ProjectRequest"("clientEmail");

-- CreateIndex
CREATE INDEX "ProjectRequest_projectType_idx" ON "ProjectRequest"("projectType");

-- CreateIndex
CREATE INDEX "ProjectRequest_createdAt_idx" ON "ProjectRequest"("createdAt");

-- CreateIndex
CREATE INDEX "ProjectRequest_requestNumber_idx" ON "ProjectRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "ProjectRequest_convertedToProject_idx" ON "ProjectRequest"("convertedToProject");

-- CreateIndex
CREATE INDEX "ClientUpload_projectId_idx" ON "ClientUpload"("projectId");

-- CreateIndex
CREATE INDEX "ClientUpload_clientId_idx" ON "ClientUpload"("clientId");

-- CreateIndex
CREATE INDEX "ClientUpload_category_idx" ON "ClientUpload"("category");

-- CreateIndex
CREATE INDEX "ClientUpload_status_idx" ON "ClientUpload"("status");

-- CreateIndex
CREATE INDEX "ClientUpload_isLatest_idx" ON "ClientUpload"("isLatest");

-- CreateIndex
CREATE INDEX "ClientUpload_createdAt_idx" ON "ClientUpload"("createdAt");

-- CreateIndex
CREATE INDEX "ProjectUpdate_projectId_idx" ON "ProjectUpdate"("projectId");

-- CreateIndex
CREATE INDEX "ProjectUpdate_type_idx" ON "ProjectUpdate"("type");

-- CreateIndex
CREATE INDEX "ProjectUpdate_isPublic_idx" ON "ProjectUpdate"("isPublic");

-- CreateIndex
CREATE INDEX "ProjectUpdate_createdAt_idx" ON "ProjectUpdate"("createdAt");

-- CreateIndex
CREATE INDEX "ProjectUpdate_emailSent_idx" ON "ProjectUpdate"("emailSent");

-- CreateIndex
CREATE INDEX "ProjectUpdateRead_updateId_idx" ON "ProjectUpdateRead"("updateId");

-- CreateIndex
CREATE INDEX "ProjectUpdateRead_userId_idx" ON "ProjectUpdateRead"("userId");

-- CreateIndex
CREATE INDEX "ProjectUpdateRead_readAt_idx" ON "ProjectUpdateRead"("readAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectUpdateRead_updateId_userId_key" ON "ProjectUpdateRead"("updateId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CodeAccessRequest_requestNumber_key" ON "CodeAccessRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "CodeAccessRequest_projectId_idx" ON "CodeAccessRequest"("projectId");

-- CreateIndex
CREATE INDEX "CodeAccessRequest_userId_idx" ON "CodeAccessRequest"("userId");

-- CreateIndex
CREATE INDEX "CodeAccessRequest_status_idx" ON "CodeAccessRequest"("status");

-- CreateIndex
CREATE INDEX "CodeAccessRequest_requestedAt_idx" ON "CodeAccessRequest"("requestedAt");

-- CreateIndex
CREATE INDEX "CodeAccessRequest_autoApprovedAt_idx" ON "CodeAccessRequest"("autoApprovedAt");

-- CreateIndex
CREATE INDEX "CodeAccessRequest_requestNumber_idx" ON "CodeAccessRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "EmailQueue_status_idx" ON "EmailQueue"("status");

-- CreateIndex
CREATE INDEX "EmailQueue_priority_idx" ON "EmailQueue"("priority");

-- CreateIndex
CREATE INDEX "EmailQueue_createdAt_idx" ON "EmailQueue"("createdAt");

-- CreateIndex
CREATE INDEX "EmailQueue_nextRetryAt_idx" ON "EmailQueue"("nextRetryAt");

-- CreateIndex
CREATE INDEX "EmailQueue_to_idx" ON "EmailQueue"("to");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledTask_taskName_key" ON "ScheduledTask"("taskName");

-- CreateIndex
CREATE INDEX "ScheduledTask_taskName_idx" ON "ScheduledTask"("taskName");

-- CreateIndex
CREATE INDEX "ScheduledTask_taskType_idx" ON "ScheduledTask"("taskType");

-- CreateIndex
CREATE INDEX "ScheduledTask_isActive_idx" ON "ScheduledTask"("isActive");

-- CreateIndex
CREATE INDEX "ScheduledTask_nextRunAt_idx" ON "ScheduledTask"("nextRunAt");

-- CreateIndex
CREATE INDEX "ScheduledTask_lastRunAt_idx" ON "ScheduledTask"("lastRunAt");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubIntegration_projectId_key" ON "GitHubIntegration"("projectId");

-- CreateIndex
CREATE INDEX "GitHubIntegration_projectId_idx" ON "GitHubIntegration"("projectId");

-- CreateIndex
CREATE INDEX "GitHubIntegration_repoFullName_idx" ON "GitHubIntegration"("repoFullName");

-- CreateIndex
CREATE INDEX "GitHubIntegration_isActive_idx" ON "GitHubIntegration"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ClientSession_sessionToken_key" ON "ClientSession"("sessionToken");

-- CreateIndex
CREATE INDEX "ClientSession_userId_idx" ON "ClientSession"("userId");

-- CreateIndex
CREATE INDEX "ClientSession_sessionToken_idx" ON "ClientSession"("sessionToken");

-- CreateIndex
CREATE INDEX "ClientSession_isActive_idx" ON "ClientSession"("isActive");

-- CreateIndex
CREATE INDEX "ClientSession_expiresAt_idx" ON "ClientSession"("expiresAt");

-- CreateIndex
CREATE INDEX "ActivityFeed_type_idx" ON "ActivityFeed"("type");

-- CreateIndex
CREATE INDEX "ActivityFeed_projectId_idx" ON "ActivityFeed"("projectId");

-- CreateIndex
CREATE INDEX "ActivityFeed_clientId_idx" ON "ActivityFeed"("clientId");

-- CreateIndex
CREATE INDEX "ActivityFeed_isPublic_idx" ON "ActivityFeed"("isPublic");

-- CreateIndex
CREATE INDEX "ActivityFeed_createdAt_idx" ON "ActivityFeed"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityFeed_actorType_idx" ON "ActivityFeed"("actorType");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE INDEX "Client_userId_idx" ON "Client"("userId");

-- CreateIndex
CREATE INDEX "Client_hasPortalAccess_idx" ON "Client"("hasPortalAccess");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRequest" ADD CONSTRAINT "ProjectRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientUpload" ADD CONSTRAINT "ClientUpload_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUpdateRead" ADD CONSTRAINT "ProjectUpdateRead_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "ProjectUpdate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUpdateRead" ADD CONSTRAINT "ProjectUpdateRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeAccessRequest" ADD CONSTRAINT "CodeAccessRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailQueue" ADD CONSTRAINT "EmailQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientSession" ADD CONSTRAINT "ClientSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
