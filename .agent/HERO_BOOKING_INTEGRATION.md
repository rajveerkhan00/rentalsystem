# Hero to Booking Page Integration

## Overview
This document explains how the booking form in the hero section communicates with the `/booking` page.

## How It Works

### 1. **Hero Section (Parent Page)**
The hero section (`app/components/mainwebsite/hero.tsx`) contains an iframe that embeds the booking form from:
```
https://booking-system-rouge-phi.vercel.app/embed
```

#### Message Listener
The hero component listens for postMessage events from the iframe:

```typescript
if (event.data && event.data.type === 'searchClicked') {
  // Store the form data in sessionStorage
  sessionStorage.setItem('bookingFormData', JSON.stringify(event.data.formData));
  
  // Navigate to booking page
  window.location.href = '/booking';
}
```

When the user clicks the "Search" button in the iframe, the embedded form should send a message like:
```javascript
window.parent.postMessage({
  type: 'searchClicked',
  formData: {
    // All form fields like pickup, dropoff, date, time, etc.
  }
}, '*');
```

### 2. **Booking Page**
The booking page (`app/booking/page.tsx`) receives the form data through sessionStorage:

```typescript
useEffect(() => {
  const savedData = sessionStorage.getItem('bookingFormData');
  if (savedData) {
    setPrefilledData(encodeURIComponent(savedData));
    // Clear the data after retrieving it
    sessionStorage.removeItem('bookingFormData');
  }
}, []);
```

The data is then passed to the iframe via URL parameter:
```typescript
src={`https://booking-system-rouge-phi.vercel.app/embed?domain=${domainName}&hide-bg=true&hide-header=true${prefilledData ? `&formData=${prefilledData}` : ''}`}
```

### 3. **Iframe Integration**
The embedded booking system needs to:

#### On the Hero Page (Search Button):
```javascript
// When search button is clicked
const handleSearchClick = () => {
  const formData = {
    serviceType: 'airport-transfers', // or 'car-rentals'
    pickup: pickupLocation,
    dropoff: dropoffLocation,
    date: pickupDate,
    time: pickupTime,
    passengers: passengerCount,
    // ... other fields
  };
  
  // Send data to parent window
  window.parent.postMessage({
    type: 'searchClicked',
    formData: formData
  }, '*');
};
```

#### On the Booking Page (Receive Data):
```javascript
// In the embedded form
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const formDataParam = urlParams.get('formData');
  
  if (formDataParam) {
    try {
      const decoded = decodeURIComponent(formDataParam);
      const formData = JSON.parse(decoded);
      
      // Prefill form fields
      setPickupLocation(formData.pickup);
      setDropoffLocation(formData.dropoff);
      setDate(formData.date);
      setTime(formData.time);
      // ... set other fields
      
      // Auto-scroll to the appropriate tab
      if (formData.serviceType === 'car-rentals') {
        setActiveTab('car-rentals');
      }
    } catch (error) {
      console.error('Error parsing form data:', error);
    }
  }
}, []);
```

## Data Flow Diagram

```
┌─────────────────────────┐
│   Hero Section (Main)   │
│  ┌──────────────────┐   │
│  │  Iframe (Embed)  │   │
│  │                  │   │
│  │  [Search Button] │───┼─── postMessage({ type: 'searchClicked', formData })
│  └──────────────────┘   │
└─────────────────────────┘
           │
           │ sessionStorage.setItem('bookingFormData', ...)
           │
           ▼
    window.location = '/booking'
           │
           │
           ▼
┌─────────────────────────┐
│   Booking Page          │
│  ┌──────────────────┐   │
│  │  Iframe (Embed)  │◄──┼─── formData via URL parameter
│  │                  │   │
│  │  [Pre-filled]    │   │
│  └──────────────────┘   │
└─────────────────────────┘
```

## Required Changes in Embedded Form

To complete this integration, the embedded booking form at `https://booking-system-rouge-phi.vercel.app` needs to:

1. **Add postMessage on Search Click**: Send form data to parent when search is clicked
2. **Handle formData URL Parameter**: Parse and prefill form when receiving data
3. **Switch Tabs**: If the data includes `serviceType`, switch to the appropriate tab

## Testing

1. Fill out the form in the hero section
2. Click the "Search" button
3. You should be redirected to `/booking`
4. The iframe should load with the same data pre-filled

## Notes

- Data is stored in `sessionStorage` temporarily during navigation
- Data is cleared immediately after being used to prevent stale data
- All data is URL-encoded to ensure safe transmission
- The iframe origin is validated for security (`https://booking-system-rouge-phi.vercel.app`)
