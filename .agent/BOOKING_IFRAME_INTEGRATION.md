# Booking System Iframe Integration

## Overview
This document explains how the booking system iframe is integrated into the rentalsystem-seven.vercel.app website.

## Current Implementation

### 1. Hero Section (Homepage)
**File:** `app/components/mainwebsite/hero.tsx`

The hero section includes an iframe for quick booking quotes:

```tsx
<iframe
  id="booking-iframe"
  src={`https://booking-system-rouge-phi.vercel.app/embed?domain=${domainName}&hide-bg=true&hide-header=true&redirectOnSearch=true`}
  width="100%"
  height="700"
  style={{ border: 'none', minHeight: '500px' }}
  scrolling="no"
  title="Booking Form"
/>
```

**Parameters:**
- `domain` - Specifies the domain for domain validation
- `hide-bg=true` - Hides the background for seamless integration
- `hide-header=true` - Hides the header for cleaner look
- `redirectOnSearch=true` - Enables redirect to booking page when search is clicked

### 2. Booking Page
**File:** `app/booking/page.tsx`

The booking page includes the full booking form:

```tsx
<iframe
  id="booking-iframe"
  src={`https://booking-system-rouge-phi.vercel.app/embed?domain=${domainName}&hide-bg=true&hide-header=true${prefilledData ? `&formData=${prefilledData}` : ''}`}
  width="100%"
  height="800"
  className="w-full border-none"
  style={{
    minHeight: '420px',
    background: 'transparent'
  }}
  scrolling="no"
  title="Booking Form"
/>
```

**Parameters:**
- `domain` - Specifies the domain for domain validation
- `hide-bg=true` - Hides the background
- `hide-header=true` - Hides the header
- `formData` - (Optional) Pre-fills form with data from hero section

## Domain Validation

The booking system validates requests based on the `domain` parameter. For rentalsystem-seven.vercel.app:

```
https://booking-system-rouge-phi.vercel.app/embed?domain=rentalsystem-seven.vercel.app
```

### Testing Mode (Development Only)

For testing purposes, you can bypass domain validation:

```
https://booking-system-rouge-phi.vercel.app/embed?allowAll=true
```

⚠️ **Warning:** Do not use `allowAll=true` in production as it bypasses security checks.

## Auto-Resize Functionality

Both the hero section and booking page include message listeners to auto-resize the iframe:

```tsx
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    // Only accept messages from the booking system
    if (event.origin !== 'https://booking-system-rouge-phi.vercel.app') return;

    if (event.data && event.data.type === 'resize') {
      const iframe = document.getElementById('booking-iframe') as HTMLIFrameElement;
      if (iframe) {
        iframe.style.height = (event.data.height) + 'px';
      }
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

## Form Pre-filling

When users interact with the hero form and click "Search":

1. Hero section sends a `postMessage` with form data
2. Data is stored in `sessionStorage`
3. User is redirected to `/booking`
4. Booking page retrieves data from `sessionStorage`
5. Data is passed to iframe via `formData` parameter

## Summary

✅ **Domain Parameter:** Using `domain=rentalsystem-seven.vercel.app`
✅ **Auto-Resize:** Implemented with `postMessage` listeners
✅ **Form Pre-filling:** Working via sessionStorage and URL parameters
✅ **Seamless Integration:** Background and headers hidden for clean look

## Troubleshooting

### Issue: "Service Unavailable: This booking form is not configured for this domain"

**Solution:** Ensure the domain parameter matches exactly:
```
?domain=rentalsystem-seven.vercel.app
```

### Issue: Iframe not resizing

**Solution:** Check that:
1. Message listener is properly set up
2. Origin check matches `https://booking-system-rouge-phi.vercel.app`
3. Iframe has an `id="booking-iframe"`

### Issue: Form data not pre-filling

**Solution:** Verify:
1. `sessionStorage` is being populated in hero section
2. Data is being retrieved in booking page
3. `formData` parameter is properly encoded in URL
