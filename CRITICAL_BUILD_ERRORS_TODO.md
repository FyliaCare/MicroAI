# 🚨 CRITICAL BUILD ERRORS - STEP-BY-STEP FIX TODO

**Status**: 🔴 PRODUCTION BLOCKING  
**Created**: 2025-01-24  
**Build Status**: FAILING - TypeScript compilation errors  
**Total Errors Found**: 15+ files with Prisma relation name mismatches  

---

## 📊 EXECUTIVE SUMMARY

### Root Cause Analysis
**PRIMARY ISSUE**: Inconsistent Prisma relation naming between schema and code
- ✅ **Schema defines**: `User` (PascalCase - Capital U)
- ❌ **Code uses**: `user` (camelCase - lowercase u)
- ⚠️ **TypeScript catches this at build time**, not runtime

### Impact Assessment
- **Build Status**: ❌ FAILING
- **Deployment**: 🔴 BLOCKED
- **Development**: ⚠️ Works in dev mode (TypeScript not strict enough)
- **Production**: 🚫 Cannot deploy to production

### Statistics
| Category | Count | Priority |
|----------|-------|----------|
| **Critical Errors** (Blocking Build) | 2 files | 🔴 P0 |
| **High Priority Errors** | 7 files | 🟠 P1 |
| **Medium Priority Errors** | 4 files | 🟡 P2 |
| **Lines to Fix** | ~40-50 lines | - |
| **Estimated Time** | 2-3 hours | - |

---

## 🎯 THE CORE PROBLEM EXPLAINED

### Schema Definition (Prisma)
```prisma
model ClientSession {
  id             String   @id
  userId         String
  sessionToken   String   @unique
  expiresAt      DateTime
  User           User     @relation(...)  // ✅ Relation name is "User"
  //             ^^^^                      // Capital U
}

model CodeAccessRequest {
  id        String   @id
  userId    String
  User      User     @relation(...)        // ✅ Relation name is "User"
  //        ^^^^                           // Capital U
}
```

### Code Usage (TypeScript)
```typescript
// ❌ WRONG - Using lowercase 'user'
const session = await prisma.clientSession.findFirst({
  include: {
    user: true,  // TypeScript Error: 'user' does not exist
                 // Did you mean 'User'?
  }
})

// ✅ CORRECT - Using PascalCase 'User'
const session = await prisma.clientSession.findFirst({
  include: {
    User: true,  // Matches schema exactly
  }
})

// Then access it with capital U
if (session?.User?.email) { ... }
```

---

## 🔥 PHASE 1: CRITICAL ERRORS (P0 - FIX FIRST)

These are **blocking the build** right now.

### ✅ Step 1.1: Fix `src/app/api/admin/code-access/[id]/approve/route.ts`

**Current Build Error**:
```
Type error: Object literal may only specify known properties, but 'user' 
does not exist in type 'CodeAccessRequestInclude<DefaultArgs>'. 
Did you mean to write 'User'?
Line 20, Column 9
```

**Line 18-22**: Change include statement
```typescript
// ❌ CURRENT (WRONG)
const codeRequest = await prisma.codeAccessRequest.findUnique({
  where: { id: requestId },
  include: {
    user: true,  // ❌ Should be 'User'
  },
})

// ✅ FIX TO THIS
const codeRequest = await prisma.codeAccessRequest.findUnique({
  where: { id: requestId },
  include: {
    User: true,  // ✅ Capital U
  },
})
```

**Note**: Line 93 already uses `codeRequest.User.email` correctly, so no change needed there.

**Verification**:
- [ ] Line 20: Change `user: true` to `User: true`
- [ ] Line 93: Verify it says `codeRequest.User.email` (should be correct)
- [ ] Run `npm run build` to verify error is gone

---

### ✅ Step 1.2: Fix `src/app/api/cron/auto-approve-code-access/route.ts`

**Lines 25-33**: Change include statement
```typescript
// ❌ CURRENT (WRONG)
const readyRequests = await prisma.codeAccessRequest.findMany({
  where: {
    status: 'pending',
    autoApprovedAt: { lte: now },
  },
  include: {
    user: true,  // ❌ Should be 'User'
  },
})

// ✅ FIX TO THIS
const readyRequests = await prisma.codeAccessRequest.findMany({
  where: {
    status: 'pending',
    autoApprovedAt: { lte: now },
  },
  include: {
    User: true,  // ✅ Capital U
  },
})
```

**Line 93**: Change usage
```typescript
// ❌ CURRENT (WRONG)
to: request.user.email,

// ✅ FIX TO THIS
to: request.User.email,  // ✅ Capital U
```

**Verification**:
- [ ] Line 31: Change `user: true` to `User: true`
- [ ] Line 93: Change `request.user.email` to `request.User.email`
- [ ] Search file for any other `.user.` references and fix them
- [ ] Run `npm run build` to verify

---

### ✅ Step 1.3: Verify Build Passes
```powershell
npm run build
```

**Expected Output**: 
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
```

If still failing, read the error carefully and fix before proceeding to Phase 2.

---

## 🔶 PHASE 2: HIGH PRIORITY ERRORS (P1)

These files use `ClientSession` with incorrect relation names.

### ✅ Step 2.1: Fix `src/app/api/client/projects/route.ts`

**Lines 50-61**: Change include and usage
```typescript
// ❌ CURRENT (WRONG)
const session = await prisma.clientSession.findFirst({
  where: {
    sessionToken: token,
    isActive: true,
    expiresAt: {
      gt: new Date()
    }
  },
  include: {
    user: {            // ❌ Should be 'User'
      include: {
        client: true   // ❌ Should be 'Client'
      }
    },
  },
})

if (session?.user?.client) {           // ❌ Wrong
  console.log('✅ Found session:', session.user.email)  // ❌ Wrong
  clientId = session.user.client.id    // ❌ Wrong
  userId = session.user.id             // ❌ Wrong
}

// ✅ FIX TO THIS
const session = await prisma.clientSession.findFirst({
  where: {
    sessionToken: token,
    isActive: true,
    expiresAt: {
      gt: new Date()
    }
  },
  include: {
    User: {            // ✅ Capital U
      include: {
        Client: true   // ✅ Capital C
      }
    },
  },
})

if (session?.User?.Client) {           // ✅ Correct
  console.log('✅ Found session:', session.User.email)  // ✅ Correct
  clientId = session.User.Client.id    // ✅ Correct
  userId = session.User.id             // ✅ Correct
}
```

**Checklist**:
- [ ] Line 50-57: Change `user: { include: { client: true } }` to `User: { include: { Client: true } }`
- [ ] Line 59: Change `session.user.email` to `session.User.email`
- [ ] Line 60: Change `session.user.client` to `session.User.Client`
- [ ] Line 61: Change `session.user.id` to `session.User.id`

---

### ✅ Step 2.2: Fix `src/app/api/client/uploads/route.ts`

**IMPORTANT**: This file has **THREE** separate instances to fix!

#### Instance 1: Lines 24-41 (POST handler)
```typescript
// ❌ CURRENT (WRONG) - Line 24-31
const session = await prisma.clientSession.findUnique({
  where: { sessionToken },
  include: {
    user: {          // ❌ Should be 'User'
      include: {
        client: true,  // ❌ Should be 'Client'
      },
    },
  },
})

// Line 41
if (!session.user.client) {  // ❌ Wrong

// ✅ FIX TO THIS
const session = await prisma.clientSession.findUnique({
  where: { sessionToken },
  include: {
    User: {          // ✅ Capital U
      include: {
        Client: true,  // ✅ Capital C
      },
    },
  },
})

// Line 41
if (!session.User.Client) {  // ✅ Correct
```

**Then fix ALL usages in this section**:
- [ ] Line 86: `session.user.client.id` → `session.User.Client.id`
- [ ] Line 126: `session.user.client.id` → `session.User.Client.id`
- [ ] Line 127: `session.user.id` → `session.User.id`
- [ ] Line 139: `session.user.client.name` → `session.User.Client.name`
- [ ] Line 153: `session.user.client.id` → `session.User.Client.id`
- [ ] Line 154: `session.user.client.name` → `session.User.Client.name`
- [ ] Line 159: `session.user.client.id` → `session.User.Client.id`

#### Instance 2: Lines 218-244 (GET handler)
```typescript
// ❌ CURRENT (WRONG) - Around line 218
const session = await prisma.clientSession.findUnique({
  where: { sessionToken },
  include: {
    user: {          // ❌ Wrong
      include: {
        client: true,  // ❌ Wrong
      },
    },
  },
})

// ✅ FIX TO THIS
const session = await prisma.clientSession.findUnique({
  where: { sessionToken },
  include: {
    User: {          // ✅ Correct
      include: {
        Client: true,  // ✅ Correct
      },
    },
  },
})
```

**Then fix usages**:
- [ ] Line 233: `session.user.client` → `session.User.Client`
- [ ] Line 244: `session.user.client.id` → `session.User.Client.id`
- [ ] Line 259: `session.user.client.id` → `session.User.Client.id`

#### Instance 3: Lines 350-377 (PATCH handler)
```typescript
// ❌ CURRENT (WRONG) - Around line 350
const session = await prisma.clientSession.findUnique({
  where: { sessionToken },
  include: {
    user: {          // ❌ Wrong
      include: {
        client: true,  // ❌ Wrong
      },
    },
  },
})

// ✅ FIX TO THIS (same as above)
```

**Then fix usages**:
- [ ] Line 365: `session.user.client` → `session.User.Client`
- [ ] Line 376: `session.user.client.id` → `session.User.Client.id`
- [ ] Line 377: `session.user.id` → `session.User.id`

**Total Changes in This File**: ~3 include blocks + ~15 usage lines

---

### ✅ Step 2.3: Fix `src/app/api/client/updates/route.ts`

**IMPORTANT**: This file has **TWO** instances to fix!

#### Instance 1: Lines 22-80 (GET handler)
```typescript
// ❌ CURRENT (WRONG)
const session = await prisma.clientSession.findUnique({
  where: { sessionToken },
  include: {
    user: {          // ❌ Wrong
      include: {
        client: true,  // ❌ Wrong
      },
    },
  },
})

// ✅ FIX TO THIS
const session = await prisma.clientSession.findUnique({
  where: { sessionToken },
  include: {
    User: {          // ✅ Correct
      include: {
        Client: true,  // ✅ Correct
      },
    },
  },
})
```

**Then fix usages**:
- [ ] Line 40: `session.user.client` → `session.User.Client`
- [ ] Line 50: `session.user.client.id` → `session.User.Client.id`
- [ ] Line 60: `session.user.client.id` → `session.User.Client.id`
- [ ] Line 80: `session.user.id` → `session.User.id`

#### Instance 2: Lines 169-241 (PATCH handler)
```typescript
// ❌ CURRENT (WRONG) - Around line 169
const session = await prisma.clientSession.findUnique({
  where: { sessionToken },
  include: {
    user: {          // ❌ Wrong
      include: {
        client: true,  // ❌ Wrong
      },
    },
  },
})

// ✅ FIX TO THIS (same as above)
```

**Then fix usages**:
- [ ] Line 184: `session.user.client` → `session.User.Client`
- [ ] Line 210: `session.user.client.id` → `session.User.Client.id`
- [ ] Line 225: `session.user.id` → `session.User.id`
- [ ] Line 241: `session.user.id` → `session.User.id`

---

### ✅ Step 2.4: Fix `src/app/api/client/projects/[id]/uploads/route.ts`

**Good News**: The include statement on line 25 is already correct! 
```typescript
include: { User: { include: { Client: true } } }  // ✅ Already correct
```

**Bad News**: The usage is wrong.

```typescript
// ❌ CURRENT (WRONG) - Line 27
if (session?.user?.client) clientId = session.user.client.id

// ✅ FIX TO THIS
if (session?.User?.Client) clientId = session.User.Client.id
```

**Checklist**:
- [ ] Line 27: Change `session?.user?.client` to `session?.User?.Client`
- [ ] Line 27: Change `session.user.client.id` to `session.User.Client.id`

---

### ✅ Step 2.5: Fix `src/app/api/client/projects/[id]/route.ts`

**Lines 50-59**: Fix include and usage
```typescript
// ❌ CURRENT (WRONG)
const clientSession = await prisma.clientSession.findFirst({
  where: {
    sessionToken: token,
    isActive: true,
    expiresAt: {
      gt: new Date()
    }
  },
  include: {
    user: {          // ❌ Wrong
      include: {
        client: true  // ❌ Wrong
      }
    }
  }
})

if (clientSession?.user?.client?.id) {           // ❌ Wrong
  clientId = clientSession.user.client.id        // ❌ Wrong

// ✅ FIX TO THIS
const clientSession = await prisma.clientSession.findFirst({
  where: {
    sessionToken: token,
    isActive: true,
    expiresAt: {
      gt: new Date()
    }
  },
  include: {
    User: {          // ✅ Correct
      include: {
        Client: true  // ✅ Correct
      }
    }
  }
})

if (clientSession?.User?.Client?.id) {           // ✅ Correct
  clientId = clientSession.User.Client.id        // ✅ Correct
```

**Also fix**:
- [ ] Line 81: `session.user.role` → `session.User.role` (if using ClientSession)
  - **WAIT**: Check if `session` here is NextAuth or ClientSession!
  - If NextAuth: Keep `session.user.role` (lowercase is correct)
  - If ClientSession: Change to `session.User.role` (capital)
- [ ] Line 84: Same check for `session.user.id`

---

### ✅ Step 2.6: Fix `src/app/api/client/profile/route.ts`

**Note**: Need to read this file to see the exact errors, but based on the TODO, it should have:

```typescript
// ❌ CURRENT (WRONG) - Around line 25 and 110
include: {
  user: true  // ❌ Wrong
}

// ✅ FIX TO THIS
include: {
  User: true  // ✅ Correct
}
```

**Checklist**:
- [ ] Line 25: Change `user: true` to `User: true`
- [ ] Line 110: Change `user: true` to `User: true`
- [ ] Find all `session.user` references and change to `session.User`

---

### ✅ Step 2.7: Verify Phase 2 Complete
```powershell
npm run build
```

Should show no ClientSession-related errors.

---

## ⚠️ PHASE 3: IMPORTANT DISTINCTIONS

### Understanding NextAuth vs Prisma Sessions

**This is CRITICAL to understand**:

#### NextAuth Session (from `getServerSession`)
```typescript
import { getServerSession } from 'next-auth'

const session = await getServerSession(authOptions)
// This returns NextAuth's session object

if (session.user.role === 'admin') {  // ✅ lowercase 'user' is CORRECT
  console.log(session.user.email)      // ✅ This is right
}
```

#### Prisma ClientSession (from database)
```typescript
const session = await prisma.clientSession.findFirst({
  include: { User: true }  // ✅ Capital 'User'
})

if (session?.User?.email) {  // ✅ Capital 'User' is CORRECT
  console.log(session.User.email)
}
```

### How to Tell the Difference

Look for these patterns:

**NextAuth Session Indicators**:
- `getServerSession(authOptions)`
- `import { getServerSession } from 'next-auth'`
- Checking `session.user.role === 'admin'`
- Usually in admin routes

**Prisma ClientSession Indicators**:
- `prisma.clientSession.findFirst()` or `.findUnique()`
- Checking `sessionToken`
- Looking for `expiresAt`, `isActive`
- Usually in client routes

### Files Using NextAuth (DON'T CHANGE THESE)

These files use NextAuth sessions, so `session.user` (lowercase) is **CORRECT**:

- `src/app/api/admin/**` routes (most of them)
  - `admin/email-queue/stats/route.ts`
  - `admin/system-health/route.ts`
  - `admin/users/route.ts`
  - `admin/users/[id]/status/route.ts`
  - `admin/projects/[id]/comments/route.ts`
  - `admin/projects/[id]/uploads/route.ts`
  - `admin/project-requests/route.ts`
  - `admin/project-requests/[id]/approve/route.ts`
  - `admin/project-requests/[id]/reject/route.ts`

**Pattern to look for**:
```typescript
const session = await getServerSession(authOptions)
if (!session || session.user.role !== 'admin') {  // ✅ This is CORRECT
```

**DO NOT CHANGE** these to capital U! They are NextAuth sessions, not Prisma ClientSession.

---

## 🔍 PHASE 4: VERIFICATION CHECKLIST

### Step 4.1: Run Full Build
```powershell
npm run build
```

Expected output:
```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
```

### Step 4.2: Check for Remaining Errors

If you see errors, read them carefully:

**Example Error Pattern**:
```
Type error: Property 'user' does not exist on type 'ClientSession & { User: User & { Client: Client } }'
  Did you mean 'User'?

File: src/app/api/some/route.ts
Line: 123
```

**This tells you**:
1. **File**: `src/app/api/some/route.ts`
2. **Line**: 123
3. **Problem**: Using `user` instead of `User`
4. **Fix**: Change to capital `User`

### Step 4.3: Search for Remaining Issues

Run these searches to find any missed instances:

```powershell
# Search for lowercase in includes
Select-String -Path "src\**\*.ts" -Pattern "include:\s*\{\s*user:" -CaseSensitive

# Search for lowercase in includes (client)
Select-String -Path "src\**\*.ts" -Pattern "include:\s*\{\s*client:" -CaseSensitive

# Search for session.user.client (should be session.User.Client)
Select-String -Path "src\app\api\client\**\*.ts" -Pattern "session\.user\.client"

# Search for session.user.id in client routes
Select-String -Path "src\app\api\client\**\*.ts" -Pattern "session\.user\.id"
```

**Important**: Only look at **client routes** (`src/app/api/client/**`). Admin routes should keep `session.user` (lowercase).

### Step 4.4: Manual File Review

Review these files one more time:

- [ ] `src/app/api/admin/code-access/[id]/approve/route.ts`
- [ ] `src/app/api/cron/auto-approve-code-access/route.ts`
- [ ] `src/app/api/client/projects/route.ts`
- [ ] `src/app/api/client/uploads/route.ts` (3 instances!)
- [ ] `src/app/api/client/updates/route.ts` (2 instances!)
- [ ] `src/app/api/client/projects/[id]/uploads/route.ts`
- [ ] `src/app/api/client/projects/[id]/route.ts`
- [ ] `src/app/api/client/profile/route.ts`

For each file, verify:
1. ✅ All `include: { user: ...}` changed to `include: { User: ...}`
2. ✅ All `include: { client: ...}` changed to `include: { Client: ...}`
3. ✅ All `session.user.client` changed to `session.User.Client`
4. ✅ All `session.user.id` changed to `session.User.id`
5. ✅ All `request.user` changed to `request.User` (in cron job)

---

## 🧪 PHASE 5: FUNCTIONAL TESTING

After build passes, test these endpoints:

### Test 5.1: Code Access Flow
```powershell
# Test approval endpoint
$headers = @{ "Authorization" = "Bearer YOUR_ADMIN_TOKEN" }
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/code-access/REQUEST_ID/approve" -Method POST -Headers $headers
```

Expected: No TypeScript errors, request approved

### Test 5.2: Client Login
```powershell
# Test client login
$body = @{ email = "client@example.com"; password = "password" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/client/auth/login" -Method POST -Body $body -ContentType "application/json"
```

Expected: Returns session token

### Test 5.3: Client Projects
```powershell
# Test getting client projects
$headers = @{ "Authorization" = "Bearer CLIENT_SESSION_TOKEN" }
Invoke-RestMethod -Uri "http://localhost:3000/api/client/projects" -Method GET -Headers $headers
```

Expected: Returns projects list

### Test 5.4: File Upload
```powershell
# Test file upload
$headers = @{ "Authorization" = "Bearer CLIENT_SESSION_TOKEN" }
# Upload a test file
```

Expected: File uploads successfully

### Test 5.5: Auto-Approve Cron
```powershell
# Test cron job (requires secret)
$headers = @{ "Authorization" = "Bearer YOUR_CRON_SECRET" }
Invoke-RestMethod -Uri "http://localhost:3000/api/cron/auto-approve-code-access" -Method POST -Headers $headers
```

Expected: Processes pending requests

---

## 📝 PHASE 6: DOCUMENTATION & PREVENTION

### Step 6.1: Document the Pattern

Add this to project documentation:

```markdown
## Prisma Relation Naming Convention

**IMPORTANT**: Always use PascalCase for Prisma relation names.

### Schema Relations
```prisma
model ClientSession {
  User    User    @relation(...)  // ✅ Capital U
  Client  Client  @relation(...)  // ✅ Capital C
}
```

### Code Usage
```typescript
// ✅ CORRECT
include: { User: { include: { Client: true } } }
if (session?.User?.Client) { ... }

// ❌ WRONG
include: { user: { include: { client: true } } }
if (session?.user?.client) { ... }
```

### Exception: NextAuth Sessions
```typescript
// NextAuth sessions use lowercase (this is correct)
const session = await getServerSession(authOptions)
if (session.user.role === 'admin') { ... }  // ✅ Correct
```

### Step 6.2: Add Pre-commit Hook

Create `.husky/pre-commit`:
```bash
#!/bin/sh
npm run build
```

This will catch type errors before committing.

### Step 6.3: Update TypeScript Config

Consider adding stricter checks to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,              // Already enabled ✓
    "noImplicitAny": true,       // Add this
    "strictNullChecks": true,    // Add this
    "strictPropertyInitialization": true  // Add this
  }
}
```

---

## ✅ SUCCESS CRITERIA

Build is fixed when ALL of these are true:

- [ ] `npm run build` completes with no TypeScript errors
- [ ] No "does not exist in type" errors in console
- [ ] All `include` statements use PascalCase (`User`, `Client`, `Admin`)
- [ ] All property access uses PascalCase (`session.User.Client`)
- [ ] NextAuth sessions still use lowercase (`session.user.role`)
- [ ] All API endpoints tested and working
- [ ] No runtime errors in logs
- [ ] Production build can be deployed

---

## 🎯 QUICK FIX SCRIPT (OPTIONAL)

If you want to automate some of the fixes, here's a PowerShell script:

```powershell
# WARNING: Test this on a backup first!

# Fix include: { user: true } -> include: { User: true }
Get-ChildItem -Path "src\app\api\client" -Filter "*.ts" -Recurse | ForEach-Object {
  (Get-Content $_.FullName) -replace 'include:\s*{\s*user:', 'include: { User:' | Set-Content $_.FullName
}

# Fix include: { client: true } -> include: { Client: true }
Get-ChildItem -Path "src\app\api\client" -Filter "*.ts" -Recurse | ForEach-Object {
  (Get-Content $_.FullName) -replace 'client:\s*true', 'Client: true' | Set-Content $_.FullName
}

# Fix session.user.client -> session.User.Client
Get-ChildItem -Path "src\app\api\client" -Filter "*.ts" -Recurse | ForEach-Object {
  (Get-Content $_.FullName) -replace 'session\.user\.client', 'session.User.Client' | Set-Content $_.FullName
}

# Fix session.user.id -> session.User.id (in client routes only)
Get-ChildItem -Path "src\app\api\client" -Filter "*.ts" -Recurse | ForEach-Object {
  (Get-Content $_.FullName) -replace 'session\.user\.id', 'session.User.id' | Set-Content $_.FullName
}

Write-Host "✅ Automated fixes applied. Run 'npm run build' to verify."
```

**⚠️ CAUTION**: This script is aggressive and might break things. Review changes carefully!

---

## 📊 PROGRESS TRACKING

Use this to track your progress:

### Phase 1: Critical Errors
- [ ] Step 1.1: Fix approve route
- [ ] Step 1.2: Fix auto-approve cron
- [ ] Step 1.3: Verify build passes

### Phase 2: High Priority
- [ ] Step 2.1: Fix client/projects/route.ts
- [ ] Step 2.2: Fix client/uploads/route.ts (3 instances)
- [ ] Step 2.3: Fix client/updates/route.ts (2 instances)
- [ ] Step 2.4: Fix client/projects/[id]/uploads/route.ts
- [ ] Step 2.5: Fix client/projects/[id]/route.ts
- [ ] Step 2.6: Fix client/profile/route.ts
- [ ] Step 2.7: Verify phase 2 complete

### Phase 3: Verification
- [ ] Understand NextAuth vs Prisma distinction
- [ ] Reviewed admin routes (no changes needed)

### Phase 4: Verification
- [ ] Step 4.1: Full build passes
- [ ] Step 4.2: No remaining errors
- [ ] Step 4.3: Search results clean
- [ ] Step 4.4: Manual review complete

### Phase 5: Testing
- [ ] Test 5.1: Code access flow works
- [ ] Test 5.2: Client login works
- [ ] Test 5.3: Client projects work
- [ ] Test 5.4: File upload works
- [ ] Test 5.5: Cron job works

### Phase 6: Documentation
- [ ] Step 6.1: Documentation updated
- [ ] Step 6.2: Pre-commit hook added
- [ ] Step 6.3: TypeScript config updated

---

## 🆘 TROUBLESHOOTING

### Issue: Still Getting "user does not exist" Error

**Solution**: 
1. Check the exact file and line number in error
2. Verify you're changing the right variable name
3. Make sure you changed BOTH the include AND the usage

### Issue: "User does not exist" Error (opposite problem)

**Solution**: This might be NextAuth session, not Prisma. Check if:
- Using `getServerSession(authOptions)`
- In admin routes
- If yes, keep it lowercase `user`

### Issue: Build Passes But Runtime Error

**Solution**:
1. Check server logs for errors
2. The data structure might have changed
3. Check if relation actually exists in database

### Issue: TypeScript Still Shows Errors in IDE

**Solution**:
1. Restart TypeScript server: `Ctrl+Shift+P` -> "TypeScript: Restart TS Server"
2. Close and reopen VS Code
3. Delete `.next` folder and rebuild

---

## 📚 ADDITIONAL RESOURCES

### Prisma Documentation
- [Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [Include](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-reads)

### TypeScript Documentation
- [Type Checking](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html)

---

**Last Updated**: 2025-01-24  
**Status**: 🔴 CRITICAL - Fix immediately before any deployment  
**Estimated Completion**: 2-3 hours for systematic fixes + testing

---

## 🎬 FINAL CHECKLIST

Before considering this DONE:

- [ ] All build errors resolved
- [ ] `npm run build` succeeds
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Team notified of naming conventions
- [ ] Pre-commit hooks in place
- [ ] No runtime errors in production

**Only mark as COMPLETE when you can deploy to production without errors!**
