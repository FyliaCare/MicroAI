#!/bin/bash
# Cleanup Unverified Accounts Cron Job
# Runs daily at midnight to remove unverified accounts older than 30 days

curl -X POST https://www.microaisystems.com/api/cron/cleanup-unverified \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  -H "Content-Type: application/json"
