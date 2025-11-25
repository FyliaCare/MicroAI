# Build Errors - Critical TODO List

## 🚨 EXECUTIVE SUMMARY

**Total Critical Errors Found**: 15+ files with type mismatches  
**Root Cause**: Prisma relation names use PascalCase (e.g., `User`, `Client`) but code uses camelCase (e.g., `user`, `client`)  
**Impact**: TypeScript build fails, preventing production deployment  
**Priority**: 🔴 CRITICAL - Must fix immediately  
**Estimated Fix Time**: 1-2 hours for systematic replacement

### Quick Stats
- **Blocking Build**: 2 files (CodeAccessRequest routes)
- **High Priority**: 7 files (ClientSession queries)
- **Medium Priority**: 4 files (verification needed)
- **Total Lines to Change**: ~25-30 lines across 13+ files

### Main Issues
1. ❌ `include: { user: true }` → ✅ `include: { User: true }`
2. ❌ `session.user.client.id` → ✅ `session.User.Client.id`
3. ❌ `request.user.email` → ✅ `request.User.email`

---

## Overview
This document lists all critical build errors and mismatches found in the codebase. These errors prevent successful TypeScript compilation and must be fixed systematically.

---

## 🔴 CRITICAL TYPE ERRORS

### 1. CodeAccessRequest - User Relation Case Mismatch
**Location**: `src/app/api/admin/code-access/[id]/approve/route.ts:20`
**Error**: Object literal may only specify known properties, but 'user' does not exist in type 'CodeAccessRequestInclude'. Did you mean to write 'User'?

**Problem**: 
- Schema defines relation as `User` (capital U)
- Code is using `user` (lowercase u)

**Fix Required**:
```typescript
// WRONG (Line 18-22)
const codeRequest = await prisma.codeAccessRequest.findUnique({
  where: { id: requestId },
  include: {
    user: true,  // ❌ Should be 'User'
  },
})

// CORRECT
const codeRequest = await prisma.codeAccessRequest.findUnique({
  where: { id: requestId },
  include: {
    User: true,  // ✅ Capital U matches schema
  },
})
```

**Then update line 91**:
```typescript
// WRONG
if (codeRequest.User) {
  await prisma.emailQueue.create({
    data: {
      to: codeRequest.User.email,  // After fixing include, this is correct
```

---

### 2. CodeAccessRequest Auto-Approve Cron - Same Issue
**Location**: `src/app/api/cron/auto-approve-code-access/route.ts:31`

**Problem**: Same case mismatch

**Fix Required**:
```typescript
// WRONG (Line 25-33)
const readyRequests = await prisma.codeAccessRequest.findMany({
  where: {
    status: 'pending',
    autoApprovedAt: { lte: now },
  },
  include: {
    user: true,  // ❌ Should be 'User'
  },
})

// CORRECT
include: {
  User: true,  // ✅ Capital U
}
```

**Then update line 93**:
```typescript
// After fixing include, update reference
to: request.User.email,  // ✅ Capital U
```

---

### 3. ClientSession Relation Case Inconsistency
**Location**: Multiple files using ClientSession

**Schema Definition** (prisma/schema.prisma:390):
```prisma
model ClientSession {
  id             String   @id
  userId         String
  sessionToken   String   @unique
  ...
  User           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  //             ^^^^  Capital U is the relation name
}
```

**Affected Files**:

#### a) `src/app/api/client/projects/route.ts` (Lines 50-57)
```typescript
// WRONG
const session = await prisma.clientSession.findFirst({
  where: { ... },
  include: {
    user: {          // ❌ Should be 'User'
      include: {
        client: true // ❌ Should be 'Client'
      }
    },
  },
})

if (session?.user?.client) {  // ❌ Should be User and Client
  clientId = session.user.client.id
  userId = session.user.id
}

// CORRECT
include: {
  User: {            // ✅ Capital U
    include: {
      Client: true   // ✅ Capital C
    }
  },
}

if (session?.User?.Client) {  // ✅
  clientId = session.User.Client.id
  userId = session.User.id
}
```

#### b) `src/app/api/client/projects/[id]/uploads/route.ts` (Line 25)
```typescript
// WRONG
const session = await prisma.clientSession.findFirst({
  where: { sessionToken: token, isActive: true, expiresAt: { gt: new Date() } },
  include: { User: { include: { Client: true } } }  // ✅ This one is CORRECT!
})
if (session?.user?.client) clientId = session.user.client.id  // ❌ But usage is wrong

// CORRECT
if (session?.User?.Client) clientId = session.User.Client.id  // ✅
```

#### c) `src/app/api/client/uploads/route.ts` (Lines 26, 218, 350)
**Multiple instances** - Same issue as above

#### d) `src/app/api/client/updates/route.ts` (Lines 25, 169)
**Multiple instances** - Same issue as above

#### e) `src/app/api/client/profile/route.ts` (Lines 25, 110)
```typescript
// WRONG
include: {
  user: true  // ❌ Should be 'User'
}

// CORRECT
include: {
  User: true  // ✅
}
```

---

### 4. Admin Session Relation - Session Model
**Schema Definition** (prisma/schema.prisma:1354):
```prisma
model Session {
  id           String   @id
  sessionToken String   @unique
  userId       String
  expires      DateTime
  Admin        Admin    @relation(fields: [userId], references: [id], onDelete: Cascade)
  //           ^^^^^  Capital A is the relation name
}
```

**Potential Issues**: Need to check all Admin session queries

---

## 🟡 SCHEMA RELATION NAMING PATTERNS (For Reference)

Based on Prisma schema analysis, relation names follow **PascalCase** (Capital first letter):

| Model | Relation Field | Correct Name | Common Mistake |
|-------|----------------|--------------|----------------|
| ClientSession | user reference | `User` | `user` |
| Client | user reference | `User` | `user` |
| CodeAccessRequest | user reference | `User` | `user` |
| Project | client reference | `Client` | `client` |
| Session (Admin) | admin reference | `Admin` | `admin` |
| Account | admin reference | `Admin` | `admin` |

---

## 📋 SYSTEMATIC FIX CHECKLIST

### Phase 1: CodeAccessRequest Fixes (CRITICAL - Blocking Build)
- [ ] **Fix** `src/app/api/admin/code-access/[id]/approve/route.ts` 
  - [ ] Line 20: Change `user: true` to `User: true` in include
  - [ ] Line 91: Verify usage is `codeRequest.User.email` (already correct after above fix)
  
- [ ] **Fix** `src/app/api/cron/auto-approve-code-access/route.ts`
  - [ ] Line 31: Change `user: true` to `User: true` in include
  - [ ] Line 93: Change `request.user.email` to `request.User.email`

- [ ] **Check** `src/app/api/admin/code-access/[id]/reject/route.ts`
  - [ ] Verify it uses `User: true` (line 28 appears correct based on grep)
  - [ ] Verify usage is `.User.email` (line 95 appears correct)

### Phase 2: ClientSession Fixes (HIGH PRIORITY)
- [ ] **Fix** `src/app/api/client/projects/route.ts` (Lines 50-61)
  - [ ] Line 50-57: Change include from `user: { include: { client: true } }` to `User: { include: { Client: true } }`
  - [ ] Line 59: Change `session.user.email` to `session.User.email`
  - [ ] Line 60: Change `session.user.client` to `session.User.Client`
  - [ ] Line 61: Change `session.user.id` to `session.User.id`

- [ ] **Fix** `src/app/api/client/projects/[id]/uploads/route.ts`
  - [ ] Line 26: Change `session?.user?.client` to `session?.User?.Client`
  - [ ] Update: `session.user.client.id` to `session.User.Client.id`
  - [ ] Note: Include statement on line 25 is already correct (User/Client capitalized)

- [ ] **Fix** `src/app/api/client/uploads/route.ts` (Multiple locations)
  - [ ] Line 26: Fix include `user: { include: { client: true } }` → `User: { include: { Client: true } }`
  - [ ] Line 127: Change `session.user.id` to `session.User.id`
  - [ ] Line 218: Fix include (same as line 26)
  - [ ] Line 350: Fix include (same as line 26)
  - [ ] Line 377: Change `session.user.id` to `session.User.id`

- [ ] **Fix** `src/app/api/client/updates/route.ts` (Multiple locations)
  - [ ] Line 25: Fix include `user: { include: { client: true } }` → `User: { include: { Client: true } }`
  - [ ] Line 80: Change `session.user.id` to `session.User.id`
  - [ ] Line 169: Fix include (same as line 25)
  - [ ] Line 225: Change `session.user.id` to `session.User.id`
  - [ ] Line 241: Change `session.user.id` to `session.User.id`

- [ ] **Fix** `src/app/api/client/profile/route.ts`
  - [ ] Line 25: Change `user: true` to `User: true` in include
  - [ ] Line 110: Change `user: true` to `User: true` in include
  - [ ] Update all usages from `session.user` to `session.User`

- [ ] **Fix** `src/app/api/client/projects/[id]/route.ts`
  - [ ] Line 50: Fix include `user: { include: { client: true } }` → `User: { include: { Client: true } }`
  - [ ] Line 81: Change `session.user.role` to `session.User.role`
  - [ ] Line 84: Change `session.user.id` to `session.User.id`

### Phase 3: Session Model Fixes (Check for consistency)
- [ ] **Verify** `src/app/api/client/projects/[id]/comments/route.ts`
  - [ ] Line 57: Verify include uses `User: { include: { Client: true } }`
  - [ ] Line 74: Update to `session.User.Client.email`
  - [ ] Line 206: Verify include (appears correct)
  - [ ] Line 335: Verify include (appears correct)

- [ ] **Verify** `src/app/api/admin/project-updates/route.ts`
  - [ ] Line 35: Verify include uses `User: true`
  - [ ] Line 92: Update to `project.Client.User.email`

### Phase 4: Verification & Testing
- [ ] Run TypeScript compiler: `npm run build`
- [ ] Fix any remaining type errors
- [ ] Test all affected API endpoints:
  - [ ] Code access approval flow
  - [ ] Code access rejection flow
  - [ ] Client login and authentication
  - [ ] Project file uploads
  - [ ] Client profile updates
  - [ ] Project comments
  - [ ] Project updates
- [ ] Verify database queries return expected data
- [ ] Check all logs for errors

### Phase 5: Code Quality
- [ ] Add TypeScript strict checks to prevent future issues
- [ ] Document relation naming convention in project docs
- [ ] Consider adding ESLint rule to catch lowercase Prisma relations

---

## 🔍 SEARCH PATTERNS TO FIND MORE ISSUES

Use these grep patterns to find similar issues:

```bash
# Find lowercase relation names in includes
grep -r "include:\s*{\s*user:" src/
grep -r "include:\s*{\s*client:" src/
grep -r "include:\s*{\s*admin:" src/

# Find incorrect property access
grep -r "\.user\." src/ | grep -i session
grep -r "\.client\." src/ | grep -i session
grep -r "\.admin\." src/ | grep -i session
```

---

## 🎯 ROOT CAUSE

**Problem**: Inconsistent use of relation names between Prisma schema and TypeScript code.

**Why it happens**: 
1. Prisma generates types with relation names EXACTLY as defined in schema
2. Schema uses PascalCase (capital first letter) for relations: `User`, `Client`, `Admin`
3. Developers mistakenly used camelCase (lowercase): `user`, `client`, `admin`
4. TypeScript compiler catches this during build but not during development

**Solution**: 
- Always match relation names EXACTLY as defined in `schema.prisma`
- When in doubt, check generated Prisma Client types in `node_modules/.prisma/client`

---

## ⚠️ IMPORTANT DISTINCTION

### NextAuth Session vs Prisma Relations

**NextAuth Session** (from `getServerSession()`) - Uses lowercase:
```typescript
// ✅ CORRECT - NextAuth session object
const session = await getServerSession(authOptions)
if (session.user.role === 'admin') {  // ✅ lowercase 'user' is correct
  console.log(session.user.email)      // ✅ this is NextAuth's user object
}
```

**Prisma ClientSession** (from database) - Uses PascalCase:
```typescript
// ✅ CORRECT - Prisma ClientSession with relation
const session = await prisma.clientSession.findFirst({
  where: { sessionToken: token },
  include: { User: true }  // ✅ Capital 'User' is the relation name
})

if (session?.User?.email) {  // ✅ Capital 'User' to access relation
  console.log(session.User.email)
}
```

**Key Point**: The variable name `session` is the same, but the type is different!
- NextAuth `session.user` = built-in NextAuth user object (lowercase)
- Prisma `session.User` = Prisma relation to User model (PascalCase)

---

## 📝 NOTES

1. **Type Safety**: This is a TypeScript compile-time error, meaning the code might have worked in development but will fail in production builds.

2. **Testing**: After fixes, thoroughly test all affected endpoints:
   - Code access approval/rejection
   - Client authentication
   - Project uploads
   - Profile management

3. **Future Prevention**: 
   - Add ESLint rule to catch lowercase relation names
   - Use TypeScript strict mode
   - Always run `npm run build` before committing

4. **Priority**: Fix these in order - CodeAccessRequest first (blocking build), then ClientSession (most widespread).

---

## ✅ SUCCESS CRITERIA

Build errors fixed when:
- [ ] `npm run build` completes without TypeScript errors
- [ ] All relation names match schema exactly
- [ ] No more "does not exist in type" errors
- [ ] All affected API routes tested and working

---

**Last Updated**: 2025-01-24
**Status**: 🔴 CRITICAL - Must fix before deployment
