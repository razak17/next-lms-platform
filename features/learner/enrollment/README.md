# Enrollment Feature

This module handles the enrollment functionality for the learning platform, allowing users to enroll in tracks through a comprehensive checkout process.

## Features

- **Checkout Form**: Complete enrollment form with personal information collection
- **Promo Code System**: Support for discount codes (WELCOME20, STUDENT10)
- **Phone Number Input**: International phone number support with country selection
- **Form Validation**: Comprehensive validation using Zod schemas
- **Success Page**: Post-enrollment confirmation page
- **API Integration**: RESTful API for enrollment processing

## File Structure

```
features/learner/enrollment/
├── components/
│   └── checkout-form.tsx          # Main checkout form component
├── actions/
│   └── enroll.ts                  # Server action for enrollment
├── validations/
│   └── enrollment.ts              # Zod validation schemas
└── index.ts                       # Module exports

app/(learner)/
├── tracks/checkout/[trackId]/
│   ├── page.tsx                   # Checkout page
│   └── layout.tsx                 # Checkout layout
└── enrollment/success/
    ├── page.tsx                   # Success page
    └── layout.tsx                 # Enrollment layout

app/api/enrollment/
└── route.ts                       # API endpoint for enrollment
```

## Usage

### Accessing Checkout

Users can access the checkout page by clicking "Enroll Now" on any track preview page:

```
/tracks/preview/[trackId] → /tracks/checkout/[trackId]
```

### Enrollment Process

1. User fills out personal information (first name, last name, email, phone)
2. Optional: User applies promo code for discounts
3. User agrees to terms and conditions
4. Form submission creates/updates user record and creates enrollment
5. Redirect to success page

### Promo Codes

- `WELCOME20`: 20% discount
- `STUDENT10`: 10% discount

## API Endpoints

### POST /api/enrollment

Handles enrollment requests.

**Request Body:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "agreeToTerms": boolean,
  "promoCode": "string?",
  "trackId": "string"
}
```

**Response:**

```json
{
  "success": boolean,
  "message": "string"
}
```

## Database Schema

The enrollment creates records in:

- `user` table: Creates new user or updates existing
- `learner_track` table: Creates enrollment relationship

## Validation

Uses Zod schemas for:

- Required fields validation
- Email format validation
- Phone number validation (minimum 8 characters)
- Terms agreement validation

## Components

### CheckoutForm

Main component handling the entire checkout process with:

- Personal information form
- Promo code application
- Price calculation
- Form submission
- Loading states

### Features:

- Responsive design
- Form validation with error messages
- Promo code application with feedback
- Price breakdown display
- Security indicators
- Track information summary

## Error Handling

- Form validation errors
- API request errors
- Duplicate enrollment prevention
- Network error handling with user feedback

## Future Enhancements

- Payment integration
- Multiple payment methods
- Installment plans
- Group enrollments
- Waitlist functionality
