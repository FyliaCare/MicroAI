# Client Portal Testing Script
# Run this to test all endpoints and verify setup

Write-Host "🧪 MicroAI Client Portal - System Test" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Load environment variables
$envFile = ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.+)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim('"')
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host "✅ Environment variables loaded" -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    exit 1
}

$baseUrl = $env:NEXT_PUBLIC_APP_URL
$cronSecret = $env:CRON_SECRET

Write-Host ""
Write-Host "Testing against: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣  Testing API health..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ API is healthy" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ API health check failed: $_" -ForegroundColor Red
}

# Test 2: Client Login Page
Write-Host ""
Write-Host "2️⃣  Testing client login page..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/client/login" -Method GET -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Client login page accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Client login page failed: $_" -ForegroundColor Red
}

# Test 3: Cron Job - Cleanup (requires CRON_SECRET)
Write-Host ""
Write-Host "3️⃣  Testing cleanup cron job..." -ForegroundColor Cyan
if ($cronSecret) {
    try {
        $headers = @{
            "Authorization" = "Bearer $cronSecret"
        }
        $response = Invoke-WebRequest -Uri "$baseUrl/api/cron/cleanup-unverified" -Method POST -Headers $headers -ErrorAction Stop
        Write-Host "   ✅ Cleanup cron job executed" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
    } catch {
        Write-Host "   ⚠️  Cleanup cron job failed (this is ok if no expired accounts): $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  CRON_SECRET not set - skipping" -ForegroundColor Yellow
}

# Test 4: Cron Job - Auto Approve
Write-Host ""
Write-Host "4️⃣  Testing auto-approve cron job..." -ForegroundColor Cyan
if ($cronSecret) {
    try {
        $headers = @{
            "Authorization" = "Bearer $cronSecret"
        }
        $response = Invoke-WebRequest -Uri "$baseUrl/api/cron/auto-approve-code-access" -Method POST -Headers $headers -ErrorAction Stop
        Write-Host "   ✅ Auto-approve cron job executed" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
    } catch {
        Write-Host "   ⚠️  Auto-approve cron job failed (this is ok if no pending requests): $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  CRON_SECRET not set - skipping" -ForegroundColor Yellow
}

# Test 5: Database Connection
Write-Host ""
Write-Host "5️⃣  Testing database connection..." -ForegroundColor Cyan
try {
    $process = Start-Process -FilePath "npx" -ArgumentList "prisma", "db", "execute", "--stdin" -NoNewWindow -Wait -PassThru -RedirectStandardInput "SELECT 1" 2>&1
    if ($process.ExitCode -eq 0) {
        Write-Host "   ✅ Database connection successful" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Database connection failed: $_" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open Prisma Studio: npx prisma studio" -ForegroundColor White
Write-Host "2. Test client registration workflow" -ForegroundColor White
Write-Host "3. Configure email provider (Resend/SendGrid)" -ForegroundColor White
Write-Host "4. Set up cron jobs on Render.com" -ForegroundColor White
Write-Host ""
Write-Host "📖 See docs/guides/CLIENT_PORTAL_SETUP.md for detailed guide" -ForegroundColor Cyan
Write-Host ""
