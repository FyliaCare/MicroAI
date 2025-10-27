# Quote System Fixes - Implementation Guide

## Issues to Fix:

1. **Dashboard**: Amount and Line Items not displaying
2. **Quote Generator**: Change buttons to "Save as Draft" and "Generate Quote"  
3. **PDF Header**: Too close to top
4. **PDF Footer**: Overlapping content
5. **PDF Layout**: Better spacing and proper 3-page structure

## Quick Fixes Required:

### 1. Dashboard Display Fix (QuotesManager.tsx)

The dashboard cards are showing amounts correctly based on the code - issue might be with data. Check if quotes have `totalAmount` and `lineItems` populated.

### 2. Quote Generator Buttons (QuoteGenerator.tsx line ~1568-1574)

**Current:**
```tsx
📥 Download Quote as PDF
```

**Should be two buttons:**
```tsx
💾 Save as Draft
📄 Generate Quote
```

### 3. PDF Layout Fixes (pdf/page.tsx)

**Current Issues:**
- Header margin-top: 0 (too close)
- Footer positioned absolutely at bottom-8 (overlaps content)
- Page padding: p-8 (inconsistent spacing)

**Fixes needed:**
- Add top padding/margin to headers
- Move footers to fixed positions with more space
- Adjust page content area to prevent overlap

## CSS Changes for PDF:

```css
@media print {
  @page {
    size: A4;
    margin: 15mm 20mm; /* Top/bottom, Left/right */
  }
  
  .page {
    padding: 20mm 0 25mm 0 !important; /* Top, sides, bottom */
  }
  
  .page-header {
    margin-top: 5mm !important;
    margin-bottom: 8mm !important;
  }
  
  .page-footer {
    position: absolute;
    bottom: 15mm !important; /* More space from bottom */
  }
}
```

## Files to Update:

1. `src/components/admin/QuotesManager.tsx` - Check data structure
2. `src/components/admin/QuoteGenerator.tsx` - Update buttons (lines 1568-1580)
3. `src/app/admin/quotes/pdf/page.tsx` - Fix header/footer spacing

Would you like me to proceed with these specific changes one file at a time?
