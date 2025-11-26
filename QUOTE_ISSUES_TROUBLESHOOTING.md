# Quote System Issues - Quick Fix Guide

## Issues Reported
1. ❌ Text not visible in quote builder
2. ❌ Cannot download PDFs  
3. ❌ Quotes not showing on dashboard

## Diagnosis Results
✅ Database: 3 quotes found with valid data
✅ API Routes: Properly configured
✅ Components: All imports working
✅ PDF System: Previously tested and working

## Most Likely Causes

### 1. CSS/Styling Issues (Text Visibility)
**Symptoms:** Structure visible but text invisible
**Cause:** White text on white background or CSS conflicts

**Check:**
```bash
# Open browser DevTools (F12)
# Go to http://localhost:3000/admin/quotes
# Inspect quote cards - check computed styles
# Look for color: white on white backgrounds
```

**Quick Fix:** Force text colors in browser console:
```javascript
document.querySelectorAll('*').forEach(el => {
  const bg = getComputedStyle(el).backgroundColor;
  const color = getComputedStyle(el).color;
  if (bg === 'rgb(255, 255, 255)' && color === 'rgb(255, 255, 255)') {
    el.style.color = 'rgb(0, 0, 0)';
  }
});
```

### 2. Browser Cache Issues
**Symptoms:** Old styles being used
**Solution:**
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Try incognito/private window

### 3. Development Server Issues
**Symptoms:** Changes not reflecting
**Solution:**
```bash
# Stop all node processes
Get-Process -Name node | Stop-Process -Force

# Restart dev server
npm run dev
```

### 4. Build Artifacts
**Symptoms:** Outdated compiled code
**Solution:**
```bash
# Clean Next.js cache
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules/.cache

# Rebuild
npm run dev
```

## Testing Steps

### Test 1: Dashboard Visibility
```
URL: http://localhost:3000/admin/quotes
Expected: See 3 quotes (2 draft, 1 sent)
Check: Text color should be dark on light backgrounds
```

### Test 2: Quote Builder
```
URL: http://localhost:3000/admin/quotes/new
Expected: Form fields visible with black text
Check: Input fields should have text-gray-900 class
```

### Test 3: PDF Download
```
URL: http://localhost:3000/admin/quotes/e5658a28-88dc-456b-95c5-a47c56fb1bbd/edit
Action: Click "Download PDF" button
Expected: Toast notification → PDF downloads
Check: Browser console for errors
```

## Emergency CSS Fix

If text is invisible, add this to `globals.css`:

```css
/* Emergency text visibility fix */
.dark input:not([type="checkbox"]):not([type="radio"]),
.dark textarea,
.dark select {
  color: #ffffff !important;
}

input:not([type="checkbox"]):not([type="radio"]),
textarea,
select {
  color: #111827 !important;
}

.dark .text-slate-900 {
  color: #f1f5f9 !important;
}

.dark .text-gray-900 {
  color: #f9fafb !important;
}
```

## Common Solutions

### Solution 1: Check Dark Mode
```javascript
// In browser console
localStorage.getItem('theme')
// If returns 'dark', try:
localStorage.setItem('theme', 'light')
location.reload()
```

### Solution 2: Verify Tailwind
Check `tailwind.config.js` has proper content paths:
```javascript
content: [
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx}',
  './app/**/*.{js,ts,jsx,tsx}',
]
```

### Solution 3: Test API Directly
```bash
# Test quotes API
curl http://localhost:3000/api/admin/quotes

# Should return JSON with quotes array
```

## Next Steps

1. ✅ **First**: Clear browser cache + hard refresh
2. ✅ **Second**: Check browser console for errors
3. ✅ **Third**: Inspect element to see computed styles
4. ✅ **Fourth**: Try incognito window
5. ✅ **Fifth**: Restart dev server

## Contact Points

If issues persist:
- Check browser console (F12) for JavaScript errors
- Check Network tab for failed API requests
- Check terminal for Next.js errors
- Try a different browser

## Files to Check

Key files for debugging:
- `src/app/admin/quotes/page.tsx` - Dashboard
- `src/components/admin/quotes/QuoteBuilderNew.tsx` - Builder
- `src/components/admin/quotes/BasicInfoTab.tsx` - Form fields
- `src/app/api/admin/quotes/route.ts` - API
- `src/app/api/admin/quotes/[id]/pdf/route.ts` - PDF generation
- `src/lib/pdfDownloader.ts` - Download utility

## Quick Test URLs

```
Dashboard: http://localhost:3000/admin/quotes
New Quote: http://localhost:3000/admin/quotes/new  
Edit Quote: http://localhost:3000/admin/quotes/e5658a28-88dc-456b-95c5-a47c56fb1bbd/edit
```
