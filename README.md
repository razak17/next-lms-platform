# Learning Platform

A comprehensive learning management system (LMS)

## Features

### For Learners

- **Multi-track Learning**: Access to Software Development, Data Science, and Cloud Computing tracks
- **Course Enrollment**: Seamless enrollment process with Stripe integration
- **Progress Tracking**: Monitor learning progress across courses and tracks
- **Profile Management**: Manage personal information and learning preferences
- **Purchase History**: View and manage course purchases and receipts
- **Rating System**: Rate and review tracks and courses

### For Administrators

- **User Management**: Comprehensive learner management and analytics
- **Course Administration**: Create, update, and manage courses and tracks
- **Analytics Dashboard**: Real-time insights into platform usage and revenue
- **Invoice Management**: Handle payments, refunds, and financial reporting
- **Content Management**: Upload and organize learning materials
- **Reporting**: Generate detailed reports on user engagement and performance

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **shadcn/ui** - Component library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icon library

### Backend

- **Next.js API Routes** - Server-side API
- **Better Auth** - Authentication system
- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL** - Primary database (Neon)
- **Stripe** - Payment processing
- **UploadThing** - File upload service
- **Resend** - Email service
- **React Email** - Email templates

### Additional Tools

- **Husky** - Git hooks
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Drizzle Studio** - Database management

## Project Structure

```
learning-platform/
├── app/                    # Next.js app directory
│   ├── (learner)/         # Learner-facing routes
│   ├── admin/             # Admin dashboard routes
│   └── api/               # API routes
├── components/            # Reusable UI components
├── features/              # Feature-based modules
│   ├── admin/            # Admin functionality
│   ├── learner/          # Learner functionality
│   └── shared/           # Shared utilities
├── db/                   # Database configuration
│   ├── schema/           # Drizzle schema definitions
│   └── migrations/       # Database migrations
├── lib/                  # Utility libraries
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── assets/               # Static assets
```

## Installation

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Stripe account
- Google OAuth credentials
- Resend API key

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd learning-platform
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following environment variables:

   ```env
   # App Configuration
   ENV=development
   BETTER_AUTH_SECRET="your-better-auth-secret"
   BETTER_AUTH_URL="http://localhost:3000"

   # Database
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=root
   DB_NAME=next_lms
   DB_URL="your-neon-url"  # For production
   DB_TYPE=postgresql

   # Authentication
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Email Service
   RESEND_API_KEY="your-resend-api-key"
   EMAIL_SENDER_NAME="warrior"
   EMAIL_SENDER_ADDRESS="orcdev.com"

   # File Upload
   UPLOADTHING_SECRET="your-uploadthing-secret"
   UPLOADTHING_APP_ID="your-uploadthing-app-id"

   # Payment Processing
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
   ```

4. **Database Setup**

   ```bash
   # Generate migration files
   pnpm db:generate

   # Push schema to database
   pnpm db:push

   # Seed database with initial data
   pnpm db:seed
   ```

5. **Start Development Server**

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Database Schema

The platform uses a relational database with the following core entities:

- **Users**: Learner and admin user accounts
- **Tracks**: Learning tracks (Software Development, Data Science, Cloud Computing)
- **Courses**: Individual courses within tracks
- **Learner Tracks**: Junction table for user enrollments
- **Purchases**: Payment and enrollment records
- **Invoices**: Financial transaction records
- **Track Ratings**: User feedback and ratings

## Authentication

The platform uses Better Auth for authentication with support for:

- Email/password authentication
- Google OAuth integration
- OTP verification
- Password reset functionality
- Role-based access control (learners vs admins)

## Payment Integration

Stripe integration provides:

- Secure payment processing
- Subscription management
- Invoice generation
- Refund handling
- Webhook event processing

## Email Service

Resend integration for:

- Account verification emails
- Password reset emails
- Course enrollment confirmations
- Payment receipts
- Custom email templates using React Email

## Development Scripts

```bash
# Development
pnpm dev                 # Start development server with Turbopack
pnpm build              # Build for production
pnpm start              # Start production server
pnpm lint               # Run ESLint
pnpm format:write       # Format code with Prettier
pnpm format:check       # Check code formatting

# Database
pnpm db:generate        # Generate migration files
pnpm db:push           # Push schema changes to database
pnpm db:migrate        # Run database migrations
pnpm db:seed           # Seed database with initial data
pnpm db:studio         # Open Drizzle Studio

# UI Components
pnpm shadcn:add        # Add new shadcn/ui components
```

## Deployment

### Production Deployment

The application is configured for deployment on:

- **Vercel** (recommended for Next.js)

Ensure environment variables are properly configured in your deployment platform.

## Configuration

### Database Configuration

- Local development uses PostgreSQL
- Production uses Neon (PostgreSQL-compatible)
- Drizzle ORM handles migrations and type safety

### File Upload

- UploadThing service for handling file uploads
- Supports profile images and course materials

### Rate Limiting

- Upstash Redis for rate limiting API endpoints
- Prevents abuse and ensures fair usage

## API Documentation

API endpoints are documented in the Postman collection:
[API Documentation](https://documenter.getpostman.com/view/10820261/2sB2cYdfrM)

### Key API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/tracks/*` - Track management
- `/api/courses/*` - Course operations
- `/api/purchases/*` - Payment processing
- `/api/webhooks/*` - External service webhooks

## Design System

The UI follows the design specifications available in Figma:
[Design System](https://www.figma.com/design/ELDM75420gf27P1Hu7gIJE/Azubi-africa?node-id=7695-7770&t=ygm966gdYGA6mmw2-1)

### Color Palette

- Primary: `#005CFF`
- Secondary: `#256FF1`
- Accent: `#4784EE`
- Light: `#8CB4FA`
- Lighter: `#C9DDFF`

## Testing

Testing setup includes:

- Unit testing with Jest (configure as needed)
- Integration testing for API endpoints
- E2E testing with Playwright (configure as needed)

## Analytics and Monitoring

The admin dashboard provides comprehensive analytics:

- User enrollment trends
- Revenue tracking
- Course completion rates
- Platform usage statistics
- Performance metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting
5. Submit a pull request
