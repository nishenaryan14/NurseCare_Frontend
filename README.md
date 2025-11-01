# NurseCare Frontend

A modern, responsive Next.js frontend for the NurseCare home nursing service platform.

## Features

- **Modern UI/UX**: Built with Tailwind CSS and Framer Motion for smooth animations
- **Authentication**: JWT-based authentication with role-based access control
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live data updates and notifications
- **Payment Integration**: Stripe integration for secure payments
- **Booking System**: Easy appointment booking and management
- **Review System**: Rate and review nurses after appointments

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Headless UI + Custom Components
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **State Management**: React Context
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:3000

### Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd nursing-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── patient/           # Patient dashboard
│   ├── nurse/             # Nurse dashboard
│   └── nurses/            # Nurse listing page
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── layout/           # Layout components
│   └── modals/           # Modal components
├── contexts/             # React contexts
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## Key Pages

### Landing Page (`/`)
- Hero section with call-to-action
- Features showcase
- How it works section
- Testimonials
- Statistics

### Authentication (`/auth/`)
- **Login** (`/auth/login`): User login with email/password
- **Register** (`/auth/register`): User registration with role selection

### Patient Dashboard (`/patient/dashboard`)
- Overview of appointments
- Quick actions
- Upcoming appointments
- Recent activity

### Nurse Dashboard (`/nurse/dashboard`)
- Profile status
- Today's appointments
- Earnings overview
- Recent reviews

### Nurse Listing (`/nurses`)
- Search and filter nurses
- Nurse profiles with ratings
- Booking functionality

## Components

### UI Components
- **Button**: Animated button with variants
- **Input**: Form input with validation
- **Modal**: Reusable modal component

### Layout Components
- **Header**: Navigation with authentication
- **Footer**: Site footer with links

### Feature Components
- **BookingModal**: Appointment booking interface
- **AuthContext**: Authentication state management

## API Integration

The frontend communicates with the NestJS backend through:

- **Authentication**: JWT token management
- **Bookings**: Create and manage appointments
- **Nurses**: Fetch and filter nurse profiles
- **Payments**: Stripe payment processing
- **Reviews**: Rate and review system

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable styled components
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Ready for dark mode implementation

## Animations

- **Framer Motion**: Smooth page transitions
- **Hover Effects**: Interactive element animations
- **Loading States**: Skeleton loaders and spinners

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.