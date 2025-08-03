# IEEE YESS'25 - Frontend Application

> The official frontend web application for IEEE YESS'25 (Yearly Engineering Students Summit), the largest engineering students summit organized by IEEE India Council and IEEE Kerala Section.

## 🎯 About YESS'25

IEEE YESS'25 is the largest engineering students summit by IEEE, a collaborative initiative of IEEE LINK and IEEE Kerala Section. Scheduled for **September 20th, 2025** at **NIT Calicut, Kerala**, this summit will bring together over **5,000 participants** from across India, creating a platform for students to connect with industry professionals and enhance their professional development.

## 🚀 Features

### Public Features
- **Event Landing Page** - Comprehensive information about YESS'25
- **Ticket Registration** - Seamless ticket booking with Razorpay integration
- **Payment Processing** - Secure payment handling with automatic verification
- **Ticket Status Check** - Real-time registration and payment status tracking
- **Event Gallery** - Highlights from previous YESS events
- **Responsive Design** - Optimized for all devices and screen sizes

### Admin Dashboard Features
- **Admin Authentication** - Secure login system with JWT tokens
- **Ticket Management** - Comprehensive ticket management system
  - Add individual tickets with full validation
  - Bulk upload via CSV with progress tracking
  - **Edit existing tickets** - Complete ticket editing with form validation
  - Real-time ticket filtering and search
- **IEEE Verification** - Bulk IEEE membership verification system
- **Event Management** - Create, update, and delete events with image upload
- **Updates Management** - Manage announcements and news
- **Payment Resolution** - Handle webhook failures and payment issues
- **Invoice Generation** - Send ticket invoices via email
- **Data Analytics** - Comprehensive ticket and registration analytics

### Technical Features
- **Environment-based Configuration** - Automatic switching between development and production
- **Real-time Updates** - Live status updates and notifications
- **File Upload Support** - CSV processing for bulk operations
- **Image Management** - Integration with ImgBB for image hosting
- **Progressive Web App** - PWA capabilities with offline support
- **SEO Optimized** - Complete meta tags and Open Graph support

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with modern hooks and features
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth interactions

### UI/UX Libraries
- **React Icons** - Comprehensive icon library
- **Lottie React** - Lightweight animations
- **AOS (Animate On Scroll)** - Scroll-based animations
- **React Slick** - Carousel/slider components
- **Swiper** - Modern touch slider

### Forms & Validation
- **React Hook Form** - Performant forms with easy validation
- **Yup** - Schema validation library
- **@hookform/resolvers** - Form validation resolvers

### Data & API
- **Axios** - HTTP client for API requests
- **React Intersection Observer** - Intersection Observer API wrapper

### Payment Integration
- **PayU WebSDK** - Payment gateway integration
- **Razorpay** - Primary payment processor

### 3D & Visual Effects
- **Three.js** - 3D graphics library
- **Vanta.js** - Animated backgrounds
- **Three-stdlib** - Three.js utilities

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── images/            # Image gallery and media files
│   ├── favicon files      # PWA icons and favicons
│   └── manifest files     # PWA configuration
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── BgAnimation.jsx      # Background animations
│   │   ├── TicketForm.jsx       # Registration form
│   │   ├── UpdateTicketForm.jsx # Ticket editing form
│   │   ├── Header2.jsx          # Navigation header
│   │   ├── LandingSection.jsx   # Hero section
│   │   ├── AboutSection.jsx     # About YESS section
│   │   ├── HighlightsSection.jsx # Event highlights
│   │   ├── ExploreEventsSection.jsx # Events showcase
│   │   ├── UpdatesSection.jsx   # News and updates
│   │   ├── PartnersSection.jsx  # Partner logos
│   │   └── NewFooter.jsx        # Site footer
│   ├── pages/             # Page components
│   │   ├── Home2.jsx            # Main landing page
│   │   ├── AdminLogin.jsx       # Admin authentication
│   │   ├── TicketDetails.jsx    # Admin ticket management
│   │   ├── AddTicket.jsx        # Add single ticket
│   │   ├── AddBulkTickets.jsx   # Bulk ticket upload
│   │   ├── BulkIEEEVerification.jsx # IEEE verification
│   │   ├── EventDetails.jsx     # Event management
│   │   ├── AddEvent.jsx         # Create events
│   │   ├── Updates.jsx          # Updates management
│   │   ├── CheckStatus.jsx      # Status checker
│   │   ├── PaymentCallback.jsx  # Payment success handler
│   │   ├── PaymentCancelled.jsx # Payment failure handler
│   │   ├── About.jsx            # About page
│   │   ├── Contact.jsx          # Contact page
│   │   ├── Privacy.jsx          # Privacy policy
│   │   ├── ToS.jsx             # Terms of service
│   │   └── NotFound.jsx         # 404 error page
│   ├── config/
│   │   └── api.js              # API endpoints configuration
│   ├── assets/            # Static assets used by components
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── vercel.json          # Vercel deployment configuration
└── README.md            # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Backend API** running (see backend repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ieeelink/yess25-webapp.git
   cd yess25-webapp/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.development.example .env.development
   
   # Edit the environment file with your configuration
   # See ENVIRONMENT_SETUP.md for detailed instructions
   ```

4. **Environment Variables**
   Create `.env.development` file:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_test_key
   VITE_IMGBB_API_KEY=your_imgbb_api_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev:prod     # Start development server in production mode

# Building
npm run build        # Build for production
npm run build:dev    # Build for development

# Other
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

## 🔧 Configuration

### Environment Files
The application uses environment-based configuration:

- **Development**: `.env.development`
- **Production**: Environment variables set in deployment platform

### API Configuration
API endpoints are centrally managed in `src/config/api.js`:
- Automatic environment detection
- Configurable base URLs
- Comprehensive endpoint definitions
- Support for all CRUD operations
- Authentication-aware requests

### Vite Configuration
- React plugin enabled
- Tailwind CSS integration
- Custom host and port settings
- Production optimizations

## 🎨 Styling & Design

### Design System
- **Color Palette**: Dark theme with red accents (#fe4a56)
- **Typography**: Nunito Sans font family
- **Layout**: Mobile-first responsive design
- **Components**: Reusable UI components with consistent styling

### Tailwind CSS
- Utility-first CSS framework
- Custom configuration for YESS'25 brand colors
- Responsive design utilities
- Dark mode optimized

### Animations
- **AOS**: Scroll-based animations
- **Framer Motion**: Page transitions and interactions
- **Lottie**: Lightweight animations
- **Custom CSS**: Hover effects and transitions

## 💳 Payment Integration

### Razorpay Integration
- Secure payment processing
- Real-time payment verification
- Automatic callback handling
- Payment retry functionality

### Features
- Multiple payment methods support
- Automatic invoice generation
- Payment status tracking
- Failed payment recovery

## 🔐 Admin Features

### Authentication
- JWT-based authentication
- Secure admin routes
- Automatic token validation
- Session management

### Ticket Management
- **Individual ticket creation** - Add single tickets with comprehensive form validation
- **Bulk CSV upload** - Upload multiple registrations with progress tracking
- **Ticket editing** - Full-featured editing system with:
  - React Hook Form with Yup validation
  - Dynamic dropdown menus for institutions and courses
  - "Other" option support with custom input fields
  - Real-time form validation and error handling
  - API integration with MongoDB ObjectId support
- **IEEE membership verification** - Bulk verification processing
- **Payment status management** - Track and update payment states
- **Advanced filtering** - Search by name, email, status, institution, IEEE membership

### Event Management
- Create and manage events
- Image upload with ImgBB integration
- Event categorization
- Real-time updates

### Communication Features
- **Invoice email system** - Send ticket invoices directly to participants
- Automated email notifications
- Payment confirmation emails

## 📊 Data Management

### CSV Processing
- **Bulk Tickets**: Upload multiple registrations
- **IEEE Verification**: Bulk membership verification
- **Webhook Resolution**: Handle payment webhooks
- Template downloads available

### File Formats Supported
- **Tickets CSV**: fullName, email, phone, gender, institution, course, yearOfStudy, foodPreference, isIEEEMember, ieeeMembershipNumber
- **IEEE CSV**: ieee_number, first_name, last_name, institution
- **Images**: JPEG, PNG, WebP for events and gallery

### Data Processing Features
- Real-time validation during CSV upload
- Progress tracking for bulk operations
- Error reporting with detailed feedback
- Template downloads for proper formatting
- MongoDB integration with ObjectId support

## 🌐 Deployment

### Vercel Deployment
The application is configured for Vercel deployment:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Production Build
```bash
npm run build
```

### Environment Variables for Production
Set these in your deployment platform:
- `VITE_API_BASE_URL`: Production API URL
- `VITE_RAZORPAY_KEY_ID`: Live Razorpay key
- `VITE_IMGBB_API_KEY`: ImgBB API key

## 🔌 API Integration

### Backend Endpoints Used
The frontend integrates with the following key API endpoints:

#### Authentication & Admin
- `POST /api/admin/login` - Admin login with JWT
- `POST /api/admin/changepassword` - Change admin password
- `GET /api/admin/data` - Fetch all tickets and analytics

#### Ticket Management
- `POST /api/admin/addticket` - Create individual ticket
- `POST /api/admin/addbulktickets` - Bulk ticket upload via CSV
- **`PUT /api/admin/update-ticket/:id`** - Update existing ticket (MongoDB ObjectId)
- `POST /api/admin/generate-invoice/:id` - Send invoice email

#### Data & Configuration
- `GET /api/colleges` - Fetch institution/college list
- `GET /api/updates` - Fetch announcements
- `GET /api/events` - Fetch events list

#### IEEE Verification
- `POST /api/admin/verifyieee/:id` - Verify individual IEEE membership
- `POST /api/admin/bulk-ieee-verify` - Bulk IEEE verification

### API Features
- **MongoDB Integration**: Full support for MongoDB ObjectIds
- **JWT Authentication**: Secure token-based authentication
- **Error Handling**: Comprehensive error responses with user-friendly messages
- **Data Validation**: Server-side validation with detailed error reporting
- **Audit Trail**: Change tracking for ticket modifications

## 📋 Recent Updates & Features

### Latest Changes (August 2025)
- ✅ **Advanced Ticket Editing System**
  - Complete ticket editing modal with React Hook Form
  - Dynamic institution and course dropdowns with "Other" options
  - Real-time form validation with Yup schema
  - API integration with MongoDB ObjectId support
  - Proper data mapping between display and server formats

- ✅ **Enhanced Admin Dashboard**
  - Improved ticket filtering and search functionality
  - Invoice email system with status tracking
  - Better date formatting for timestamp display
  - Responsive design optimizations

- ✅ **API Integration Improvements**
  - Centralized API endpoint management
  - Enhanced error handling and user feedback
  - Authentication-aware requests with JWT tokens
  - Support for CRUD operations on ticket data

- ✅ **Form Enhancements**
  - Institution dropdown with searchable college list
  - Course dropdown with predefined options
  - Conditional field rendering for "Other" selections
  - Improved validation messages and user experience

### Technical Improvements
- **Performance**: Optimized form rendering and API calls
- **Accessibility**: Better form labels and error messaging
- **Code Quality**: Modular components with proper error boundaries
- **Documentation**: Updated with latest API endpoints and features

## 🧪 Development Workflow

### Code Style
- ESLint configuration for consistent code style
- React hooks and modern JavaScript practices
- Component-based architecture
- Functional components with hooks

### Best Practices
- Environment-based configuration
- Error boundary implementation
- Loading states and user feedback
- Responsive design principles
- SEO optimization

## 🤝 Contributing

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Test thoroughly on different devices and screen sizes
- Update documentation for new features
- Ensure responsive design compatibility
- Implement proper error handling and user feedback
- Use TypeScript-style JSDoc comments where applicable
- Follow React best practices with hooks and functional components

### Code Quality Standards
- **Component Architecture**: Modular, reusable components
- **State Management**: React hooks with proper dependency arrays
- **Form Handling**: React Hook Form with Yup validation
- **API Integration**: Centralized API configuration with error handling
- **Styling**: Tailwind CSS with consistent design tokens
- **Performance**: Optimized builds with lazy loading where applicable

## 📄 License

This project is developed for IEEE YESS'25. All rights reserved by IEEE LINK and IEEE Kerala Section.

## 📞 Support & Contact

- **Event Website**: [yess.ieee-link.org](https://yess.ieee-link.org)
- **Email**: yess@ieee-link.org
- **Organization**: IEEE LINK
- **Event Partner**: IEEE Kerala Section

## 🏆 Event Information

- **Event**: IEEE YESS'25 (Yearly Engineering Students Summit)
- **Date**: September 20, 2025  
- **Venue**: NIT Calicut, Kerala, India
- **Expected Participants**: 5,000+
- **Organizers**: IEEE India Council & IEEE Kerala Section

---

**Built with ❤️ for the engineering student community by IEEE LINK**
