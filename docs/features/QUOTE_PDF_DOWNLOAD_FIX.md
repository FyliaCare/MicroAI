# Quote PDF Download Fix

## Issue
Users report that they cannot download PDF quotes from the system.

## Root Cause Analysis

The PDF generation uses `@react-pdf/renderer` which can fail silently for several reasons:
1. Invalid or missing data in quote fields
2. JSON parsing errors in array fields (items, milestones, etc.)
3. Missing required fields in the PDF template
4. Server compilation/runtime errors

## Changes Made

### 1. Enhanced Error Handling in `/api/admin/quotes/[id]/pdf`

**File**: `src/app/api/admin/quotes/[id]/pdf/route.ts`

#### Improvements:
- ✅ Added validation for required fields before PDF generation
- ✅ Enhanced JSON parsing with better error handling
- ✅ Added detailed logging for debugging
- ✅ Wrapped PDF rendering in try-catch with specific error messages
- ✅ Pre-parse all array fields to ensure they're valid arrays
- ✅ Added data validation logging

#### Key Changes:

```typescript
// Better JSON parsing
const parseJSON = (str: string | null) => {
  if (!str) return []
  try {
    const parsed = JSON.parse(str)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.warn('JSON parse error:', e)
    return []
  }
}

// Validate before generating
if (!quoteData.quoteNumber || !quoteData.clientName) {
  return NextResponse.json(
    { error: 'Missing required quote data' },
    { status: 400 }
  )
}

// Wrap PDF generation
try {
  pdfBuffer = await renderToBuffer(
    React.createElement(QuotePDFNew, { quote: quoteData }) as any
  )
} catch (pdfError) {
  return NextResponse.json({ 
    error: 'PDF rendering failed', 
    details: pdfError.message 
  }, { status: 500 })
}
```

### 2. Added Diagnostic Endpoint

**File**: `src/app/api/admin/quotes/[id]/diagnostic/route.ts`

New endpoint to check quote data structure:
```
GET /api/admin/quotes/[id]/diagnostic
```

Returns:
- Quote basic info
- Client data
- All JSON field parsing results
- Pricing information

## Testing

### Manual Test Steps

1. **Open Admin Quotes Page**
   ```
   http://localhost:3000/admin/quotes
   ```

2. **Click Download PDF button** on any quote

3. **Check Browser Console** for any errors

4. **Check Server Terminal** for detailed logs:
   - "PDF generation started for quote: [id]"
   - "Quote found: [quoteNumber]"
   - "Parsed data: { lineItems: X, scopeItems: Y, ... }"
   - "Quote data prepared, generating PDF..."
   - "PDF generated successfully, size: X bytes"

### Diagnostic Test

Test a specific quote:
```bash
# Check quote data structure
curl http://localhost:3000/api/admin/quotes/[QUOTE_ID]/diagnostic

# Try to generate PDF
curl http://localhost:3000/api/admin/quotes/[QUOTE_ID]/pdf --output test.pdf
```

### Automated Test Scripts

1. **Check Quotes**:
   ```bash
   npx tsx scripts/check-quotes.ts
   ```

2. **Test PDF** (requires running dev server):
   ```bash
   npx tsx scripts/test-quote-pdf.ts
   ```

## Common Issues & Solutions

### Issue 1: "Quote not found"
**Solution**: Verify the quote ID exists in the database
```bash
npx tsx scripts/check-quotes.ts
```

### Issue 2: "Missing required quote data"
**Cause**: Quote missing quoteNumber or clientName
**Solution**: Update the quote to include required fields

### Issue 3: "PDF rendering failed"
**Causes**:
- Invalid data types in quote fields
- Array fields containing non-array data
- Missing @react-pdf/renderer package

**Solutions**:
```bash
# Reinstall dependencies
npm install

# Check if package exists
npm list @react-pdf/renderer
```

### Issue 4: Server not responding
**Solution**: 
1. Stop the dev server (Ctrl+C)
2. Clear Next.js cache
3. Restart
```bash
rm -rf .next
npm run dev
```

### Issue 5: JSON parsing errors
**Cause**: Quote fields contain invalid JSON
**Solution**: The new parseJSON function handles this gracefully now, returning empty arrays

## Verification Checklist

After fixes:
- [ ] Server compiles without errors
- [ ] Can access `/admin/quotes` page
- [ ] Download button appears on each quote
- [ ] Clicking download initiates PDF download
- [ ] PDF file downloads successfully
- [ ] PDF opens and displays quote data correctly
- [ ] Console shows no errors
- [ ] Server logs show successful PDF generation

## Expected Logs (Success)

```
📋 PDF generation started for quote: e5658a28-88dc-456b-95c5-a47c56fb1bbd
Quote found: QT-202510-3407
Parsed data: { lineItems: 5, scopeItems: 3, milestones: 2, paymentSchedule: 2 }
Quote data prepared, generating PDF...
Line items count: 5
Milestones count: 2
PDF generated successfully, size: 45678 bytes
```

## If Still Not Working

1. **Check database**:
   ```bash
   npx prisma studio
   ```
   - Navigate to Quote model
   - Find a quote
   - Check if `items`, `milestones`, etc. contain valid JSON

2. **Check Package Installation**:
   ```bash
   npm install @react-pdf/renderer@^4.3.1
   ```

3. **Check Environment**:
   - Node.js version: 18+ recommended
   - Next.js: 14.2.15
   - Prisma client up to date

4. **Browser DevTools**:
   - Open Network tab
   - Click download
   - Check request/response
   - Look for error messages

5. **Try Different Quote**:
   - Some quotes might have corrupt data
   - Test with multiple quotes
   - Create a new simple quote and test

## Quick Fix Commands

```bash
# Clear everything and restart
rm -rf .next node_modules
npm install
npx prisma generate
npm run dev

# Test immediately
npx tsx scripts/check-quotes.ts
npx tsx scripts/test-quote-pdf.ts
```

## Success Indicators

✅ PDF downloads with correct filename: `quote-QT-XXXXXX-XXXX.pdf`
✅ File size > 0 bytes (typically 20-100 KB)
✅ PDF opens in viewer
✅ Contains all quote data (items, pricing, terms, etc.)
✅ Proper formatting and styling
✅ No console errors
✅ No server errors

## Contact Support

If issue persists after all fixes:
1. Capture browser console output
2. Capture server terminal output
3. Export problematic quote data
4. Share error messages

The enhanced error handling will now provide specific error messages to help diagnose any remaining issues.
