# Booking System - Receiving Form Data

## Problem
When users click the search button on the hero page, they are redirected to `/booking` but the form starts from scratch instead of being pre-filled with their data.

## Solution
The main website is passing the form data via URL parameter `formData`. Your booking system iframe needs to read this parameter and pre-fill the form.

## Where to Add the Code

In your **booking system** project (`https://booking-system-rouge-phi.vercel.app`), find the main form component. This is likely:
- `app/embed/page.tsx` or
- `components/AirportTransfersForm.tsx` or
- Similar component that contains the form

## Code to Add

### Step 1: Add a useEffect to Read URL Parameters

Add this code at the top of your form component:

```typescript
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // if using Next.js App Router
// OR
// import { useRouter } from 'next/router'; // if using Pages Router

export default function YourFormComponent() {
  const searchParams = useSearchParams(); // App Router
  // OR
  // const router = useRouter(); // Pages Router
  
  useEffect(() => {
    // Read formData parameter from URL
    const formDataParam = searchParams?.get('formData');
    // OR for Pages Router: const formDataParam = router.query.formData;
    
    if (formDataParam) {
      try {
        console.log('📩 Received formData parameter');
        
        // Decode and parse the JSON data
        const decoded = decodeURIComponent(formDataParam as string);
        const formData = JSON.parse(decoded);
        
        console.log('✅ Parsed form data:', formData);
        
        // Pre-fill the form fields
        if (formData.pickup) {
          setPickupLocation(formData.pickup);
          // Also set coordinates if available
          if (formData.pickupCoords) {
            setPickupCoords(formData.pickupCoords);
          }
        }
        
        if (formData.dropoff) {
          setDropoffLocation(formData.dropoff);
          if (formData.dropoffCoords) {
            setDropoffCoords(formData.dropoffCoords);
          }
        }
        
        if (formData.pickupDate) {
          setPickupDate(formData.pickupDate);
        }
        
        if (formData.pickupTime) {
          setPickupTime(formData.pickupTime);
        }
        
        if (formData.passengers) {
          setPassengers(formData.passengers);
        }
        
        if (formData.isReturnJourney !== undefined) {
          setIsReturnJourney(formData.isReturnJourney);
        }
        
        if (formData.returnDate) {
          setReturnDate(formData.returnDate);
        }
        
        if (formData.returnTime) {
          setReturnTime(formData.returnTime);
        }
        
        // Switch to correct tab if specified
        if (formData.serviceType) {
          setActiveTab(formData.serviceType); // 'airport-transfers' or 'car-rentals'
        }
        
        console.log('✅ Form pre-filled successfully!');
        
      } catch (error) {
        console.error('❌ Error parsing formData:', error);
      }
    } else {
      console.log('ℹ️ No formData parameter found');
    }
  }, [searchParams]); // or [router.query.formData] for Pages Router
  
  // ... rest of your component
}
```

### Step 2: Make Sure postMessage Sends All Required Data

In your search button handler, make sure you're sending all the form data:

```typescript
const handleSearchClick = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const shouldRedirect = urlParams.get('redirectOnSearch') === 'true';
  
  if (shouldRedirect && window.parent !== window) {
    // Collect ALL form data
    const formData = {
      serviceType: activeTab, // 'airport-transfers' or 'car-rentals'
      pickup: pickupLocation,
      dropoff: dropoffLocation,
      pickupCoords: pickupCoords, // if you have these
      dropoffCoords: dropoffCoords, // if you have these
      pickupDate: pickupDate,
      pickupTime: pickupTime,
      passengers: passengers,
      isReturnJourney: isReturnJourney,
      returnDate: returnDate,
      returnTime: returnTime,
      // Add any other fields your form has
    };
    
    console.log('🚀 Sending form data to parent:', formData);
    
    // Send to parent
    window.parent.postMessage({
      type: 'searchClicked',
      formData: formData
    }, '*');
    
    return; // Don't show results
  }
  
  // Normal behavior - show results inline
  // ... existing code
};
```

## Testing Steps

1. Open your browser console (F12)
2. Fill out the form on the hero page
3. Click the Search button
4. Watch the console logs:
   - `🔔 Received searchClicked message from iframe!` - From hero.tsx
   - `📋 Form data: {...}` - Shows the data being sent
   - `💾 Saved to sessionStorage` - Data saved
   - `🚀 Navigating to /booking...` - About to redirect
   - `📦 Checking sessionStorage for bookingFormData: {...}` - On booking page
   - `✅ Form data found! Encoded: ...` - Data retrieved
   - `🎯 Iframe URL with formData: ...` - Full URL being used
   - `📩 Received formData parameter` - Inside iframe
   - `✅ Parsed form data: {...}` - Data parsed successfully
   - `✅ Form pre-filled successfully!` - Form fields set

## Common Issues

### Issue 1: "No formData parameter found"
**Cause**: The iframe is not reading the URL parameter
**Fix**: Make sure you're using `useSearchParams()` or `router.query` correctly

### Issue 2: Form data is there but fields not filling
**Cause**: State setters don't match the actual state variable names
**Fix**: Check that `setPickupLocation`, `setPickupDate`, etc. match your actual state setters

### Issue 3: Data is lost after navigation
**Cause**: sessionStorage might be clearing too early
**Fix**: The current implementation should work - check browser console for errors

## Quick Check

Open browser console and run:
```javascript
sessionStorage.getItem('bookingFormData')
```

If it returns data, the first part is working. If null, the postMessage isn't being sent.
