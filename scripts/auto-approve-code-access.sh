#!/bin/bash
# Auto-Approve Code Access Cron Job
# Runs hourly to auto-approve code access requests after 24 hours

curl -X POST https://www.microaisystems.com/api/cron/auto-approve-code-access \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  -H "Content-Type: application/json"
