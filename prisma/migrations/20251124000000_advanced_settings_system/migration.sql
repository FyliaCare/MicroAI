-- Advanced Settings System Migration

-- Settings table for storing all platform settings
CREATE TABLE "Setting" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "key" TEXT NOT NULL UNIQUE,
  "value" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'string',
  "label" TEXT NOT NULL,
  "description" TEXT,
  "isPublic" BOOLEAN NOT NULL DEFAULT false,
  "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
  "validation" TEXT,
  "defaultValue" TEXT,
  "metadata" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" TEXT,
  "updatedBy" TEXT
);

-- Settings History for audit trail
CREATE TABLE "SettingHistory" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "settingId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "oldValue" TEXT,
  "newValue" TEXT NOT NULL,
  "changedBy" TEXT NOT NULL,
  "changeReason" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Settings Backup
CREATE TABLE "SettingsBackup" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "data" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "restoredAt" TIMESTAMP(3)
);

-- System Configuration
CREATE TABLE "SystemConfig" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
  "maintenanceMessage" TEXT,
  "allowedIPs" TEXT,
  "maxUploadSize" INTEGER NOT NULL DEFAULT 5242880,
  "sessionTimeout" INTEGER NOT NULL DEFAULT 3600,
  "passwordMinLength" INTEGER NOT NULL DEFAULT 8,
  "passwordRequireSpecial" BOOLEAN NOT NULL DEFAULT true,
  "passwordRequireNumber" BOOLEAN NOT NULL DEFAULT true,
  "passwordRequireUppercase" BOOLEAN NOT NULL DEFAULT true,
  "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
  "loginAttempts" INTEGER NOT NULL DEFAULT 5,
  "loginLockoutDuration" INTEGER NOT NULL DEFAULT 1800,
  "apiRateLimit" INTEGER NOT NULL DEFAULT 100,
  "apiRateLimitWindow" INTEGER NOT NULL DEFAULT 60,
  "enableLogging" BOOLEAN NOT NULL DEFAULT true,
  "logLevel" TEXT NOT NULL DEFAULT 'info',
  "backupEnabled" BOOLEAN NOT NULL DEFAULT true,
  "backupFrequency" TEXT NOT NULL DEFAULT 'daily',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Theme Configuration
CREATE TABLE "ThemeConfig" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL DEFAULT 'default',
  "primaryColor" TEXT NOT NULL DEFAULT '#6366f1',
  "secondaryColor" TEXT NOT NULL DEFAULT '#8b5cf6',
  "accentColor" TEXT NOT NULL DEFAULT '#ec4899',
  "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
  "textColor" TEXT NOT NULL DEFAULT '#1f2937',
  "borderRadius" TEXT NOT NULL DEFAULT '0.5rem',
  "fontFamily" TEXT NOT NULL DEFAULT 'Inter, sans-serif',
  "darkMode" BOOLEAN NOT NULL DEFAULT false,
  "customCSS" TEXT,
  "logo" TEXT,
  "favicon" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Email Configuration
CREATE TABLE "EmailConfig" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "provider" TEXT NOT NULL DEFAULT 'resend',
  "fromName" TEXT NOT NULL DEFAULT 'MicroAI Systems',
  "fromEmail" TEXT NOT NULL,
  "replyToEmail" TEXT,
  "adminEmail" TEXT NOT NULL,
  "resendApiKey" TEXT,
  "smtpHost" TEXT,
  "smtpPort" INTEGER,
  "smtpUser" TEXT,
  "smtpPassword" TEXT,
  "smtpSecure" BOOLEAN NOT NULL DEFAULT true,
  "dailyLimit" INTEGER NOT NULL DEFAULT 1000,
  "hourlyLimit" INTEGER NOT NULL DEFAULT 100,
  "enableQueue" BOOLEAN NOT NULL DEFAULT true,
  "queueRetries" INTEGER NOT NULL DEFAULT 3,
  "queueTimeout" INTEGER NOT NULL DEFAULT 30000,
  "templates" TEXT,
  "webhookUrl" TEXT,
  "webhookSecret" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notification Configuration
CREATE TABLE "NotificationConfig" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
  "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
  "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
  "slackEnabled" BOOLEAN NOT NULL DEFAULT false,
  "slackWebhook" TEXT,
  "events" TEXT NOT NULL,
  "priorityDelays" TEXT NOT NULL DEFAULT '{"high":0,"medium":2,"low":5}',
  "batchEnabled" BOOLEAN NOT NULL DEFAULT false,
  "batchSize" INTEGER NOT NULL DEFAULT 50,
  "batchDelay" INTEGER NOT NULL DEFAULT 300,
  "quietHoursEnabled" BOOLEAN NOT NULL DEFAULT false,
  "quietHoursStart" TEXT,
  "quietHoursEnd" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Security Configuration
CREATE TABLE "SecurityConfig" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "corsEnabled" BOOLEAN NOT NULL DEFAULT true,
  "corsOrigins" TEXT NOT NULL DEFAULT '*',
  "csrfEnabled" BOOLEAN NOT NULL DEFAULT true,
  "rateLimitEnabled" BOOLEAN NOT NULL DEFAULT true,
  "rateLimitRequests" INTEGER NOT NULL DEFAULT 100,
  "rateLimitWindow" INTEGER NOT NULL DEFAULT 60,
  "ipWhitelist" TEXT,
  "ipBlacklist" TEXT,
  "botProtectionEnabled" BOOLEAN NOT NULL DEFAULT true,
  "botProtectionThreshold" INTEGER NOT NULL DEFAULT 10,
  "sqlInjectionProtection" BOOLEAN NOT NULL DEFAULT true,
  "xssProtection" BOOLEAN NOT NULL DEFAULT true,
  "contentSecurityPolicy" TEXT,
  "sslOnly" BOOLEAN NOT NULL DEFAULT true,
  "hsts" BOOLEAN NOT NULL DEFAULT true,
  "hstsMaxAge" INTEGER NOT NULL DEFAULT 31536000,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- API Configuration
CREATE TABLE "APIConfig" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "version" TEXT NOT NULL DEFAULT 'v1',
  "baseUrl" TEXT NOT NULL,
  "docsEnabled" BOOLEAN NOT NULL DEFAULT true,
  "authRequired" BOOLEAN NOT NULL DEFAULT true,
  "rateLimitEnabled" BOOLEAN NOT NULL DEFAULT true,
  "rateLimitTier1" INTEGER NOT NULL DEFAULT 60,
  "rateLimitTier2" INTEGER NOT NULL DEFAULT 120,
  "rateLimitTier3" INTEGER NOT NULL DEFAULT 300,
  "webhooksEnabled" BOOLEAN NOT NULL DEFAULT true,
  "webhookSecret" TEXT,
  "corsEnabled" BOOLEAN NOT NULL DEFAULT true,
  "corsOrigins" TEXT NOT NULL DEFAULT '*',
  "logRequests" BOOLEAN NOT NULL DEFAULT true,
  "logResponses" BOOLEAN NOT NULL DEFAULT false,
  "cacheEnabled" BOOLEAN NOT NULL DEFAULT true,
  "cacheTTL" INTEGER NOT NULL DEFAULT 300,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX "Setting_category_idx" ON "Setting"("category");
CREATE INDEX "Setting_key_idx" ON "Setting"("key");
CREATE INDEX "Setting_updatedAt_idx" ON "Setting"("updatedAt");
CREATE INDEX "SettingHistory_settingId_idx" ON "SettingHistory"("settingId");
CREATE INDEX "SettingHistory_changedBy_idx" ON "SettingHistory"("changedBy");
CREATE INDEX "SettingHistory_createdAt_idx" ON "SettingHistory"("createdAt");
CREATE INDEX "SettingsBackup_createdAt_idx" ON "SettingsBackup"("createdAt");
CREATE INDEX "SettingsBackup_createdBy_idx" ON "SettingsBackup"("createdBy");

-- Insert default system config
INSERT INTO "SystemConfig" ("id") VALUES ('default');

-- Insert default theme config
INSERT INTO "ThemeConfig" ("id", "name") VALUES ('default', 'MicroAI Default');

-- Insert default security config
INSERT INTO "SecurityConfig" ("id") VALUES ('default');

-- Insert default API config
INSERT INTO "APIConfig" ("id", "baseUrl") VALUES ('default', 'https://api.microaisystems.com');

-- Insert default notification config
INSERT INTO "NotificationConfig" ("id", "events") VALUES ('default', '{"newProject":true,"projectApproved":true,"quoteAccepted":true}');
