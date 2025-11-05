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

# 📚 Additional Documentation

## 🌍 Environment Configuration Guide

### Overview
This project uses environment-based configuration to automatically switch between localhost and production backend URLs.

### How it Works
- **Development**: Uses `http://localhost:5000/api` when running `npm run dev`
- **Production**: Uses `https://yess25-backend.up.railway.app/api` when building for production
- **Railway Deployment**: Automatically uses production environment variables

### Environment Files

#### Setup for Local Development
1. Copy `.env.development.example` to `.env.development`
2. Update the values with your development keys

#### `.env.development` (for local development)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xgawYkbdrfISRM
VITE_IMGBB_API_KEY=0e9cde7ae8a30c258f12071cc6a4eced
```

#### `.env.production` (for production builds)
```env
VITE_API_BASE_URL=https://yess25-backend.up.railway.app/api
VITE_RAZORPAY_KEY_ID=rzp_live_sTkXOTd2O2D904
VITE_IMGBB_API_KEY=0e9cde7ae8a30c258f12071cc6a4eced
```

#### `.env` (fallback/default)
Contains production values as fallback

### Usage

#### For Development
```bash
npm run dev
# Automatically uses localhost backend
```

#### For Production Build
```bash
npm run build
# Automatically uses production backend
```

#### For Development Build (if needed)
```bash
npm run build:dev
# Uses localhost backend in build
```

### Railway Deployment

Railway automatically detects the environment and uses the appropriate configuration:
- Set environment variables in Railway's project dashboard (not in files)
- Railway automatically sets `NODE_ENV=production`
- Fallback values in `api.js` ensure the app works even without explicit env vars
- No `.env` files needed in the repository

#### Setting up Railway Environment Variables:
1. Go to your Railway project dashboard
2. Navigate to Variables tab
3. Add these variables:
   - `VITE_API_BASE_URL`: `https://yess25-backend.up.railway.app/api`
   - `VITE_RAZORPAY_KEY_ID`: Your live Razorpay key
   - `VITE_IMGBB_API_KEY`: Your ImgBB API key

### API Configuration

All API endpoints are centralized in `src/config/api.js`:
- Import `API_ENDPOINTS` for predefined endpoints
- Import `API_BASE` for custom endpoints
- Environment info available via `getEnvironmentInfo()`

### Benefits

1. **No more manual URL switching** between development and production
2. **Environment-specific configuration** (test vs live Razorpay keys)
3. **Centralized API endpoint management**
4. **Railway-compatible** - works seamlessly with Railway's deployment process
5. **Development logging** - see current environment in browser console during development

---

## 🎓 Bulk IEEE Verification - Backend Implementation Guide

### Overview
The bulk IEEE verification feature processes CSV files containing IEEE membership data and matches them against registered tickets.

### Data Structure
The uploaded CSV can have either format:

#### Format 1: Simple Template Format
```csv
ieee_number,first_name,last_name,institution
99739023,ALEESHA,SHAMINS,College of Engineering-Perumon
100490042,Joshua,Bose,
```

#### Format 2: Official IEEE Export Format
```csv
School Name,Member/Customer Number,Last Name,First Name
College of Engineering-Perumon,99739023,SHAMINS,ALEESHA
,100490042,Bose,Joshua
```

### API Endpoint: `/api/bulk-ieee-verify`

#### Request
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Field**: `ieeeFile` (the uploaded CSV/Excel file)
- **Headers**: Authorization: Bearer {token}

#### Response Format
```json
{
  "verified": 25,
  "failed": 3,
  "notFound": 15,
  "total": 43,
  "details": [
    {
      "ieee_number": "99739023",
      "name": "ALEESHA SHAMINS",
      "status": "verified",
      "message": "IEEE membership verified and ticket updated"
    },
    {
      "ieee_number": "100490042",
      "name": "Joshua Bose", 
      "status": "not_found",
      "message": "No matching ticket found for this IEEE member"
    }
  ]
}
```

### Backend Processing Logic

#### 1. File Processing
```javascript
// Parse CSV file (handle both formats)
const records = parseCsv(uploadedFile);

// Normalize to standard format
const normalizedRecords = records.map(record => ({
  ieee_number: record['Member/Customer Number'] || record['ieee_number'],
  first_name: record['First Name'] || record['first_name'], 
  last_name: record['Last Name'] || record['last_name'],
  institution: record['School Name'] || record['institution']
}));
```

#### 2. Verification Logic
```javascript
const results = {
  verified: 0,
  failed: 0, 
  notFound: 0,
  total: normalizedRecords.length,
  details: []
};

for (const member of normalizedRecords) {
  // Find matching ticket by IEEE number and name similarity
  const ticket = await findMatchingTicket(member);
  
  if (!ticket) {
    results.notFound++;
    results.details.push({
      ieee_number: member.ieee_number,
      name: `${member.first_name} ${member.last_name}`,
      status: 'not_found',
      message: 'No matching ticket found for this IEEE member'
    });
    continue;
  }
  
  // Verify IEEE number matches and update ticket
  if (ticket.ieeeMembershipNumber === member.ieee_number) {
    await updateTicketVerification(ticket._id, true);
    results.verified++;
  } else {
    results.failed++;
  }
}
```

#### 3. Matching Strategy
```javascript
async function findMatchingTicket(member) {
  // Strategy 1: Exact IEEE number match
  let ticket = await Ticket.findOne({ 
    ieeeMembershipNumber: member.ieee_number,
    isIEEEMember: 'yes'
  });
  
  if (ticket) return ticket;
  
  // Strategy 2: Name similarity + no IEEE number in ticket yet
  const nameVariations = generateNameVariations(member.first_name, member.last_name);
  
  ticket = await Ticket.findOne({
    isIEEEMember: 'yes',
    $or: nameVariations.map(name => ({
      fullName: { $regex: name, $options: 'i' }
    })),
    $or: [
      { ieeeMembershipNumber: { $exists: false } },
      { ieeeMembershipNumber: '' },
      { ieeeMembershipNumber: null }
    ]
  });
  
  return ticket;
}
```

### Key Features
1. **Flexible Format Support**: Handles both template and official IEEE export formats
2. **Smart Matching**: Uses IEEE number and name similarity for matching
3. **Detailed Results**: Provides specific feedback for each record
4. **Bulk Processing**: Efficiently handles large files
5. **Error Handling**: Graceful handling of malformed data

### Security Considerations
- Validate file size (max 10MB)
- Sanitize CSV input
- Require admin authentication
- Log all verification activities
- Rate limiting for bulk operations

---

## ✅ Mark Attendance - Bulk CSV Upload with SSE Streaming

> **Complete documentation for the Mark Attendance feature with real-time Server-Sent Events (SSE) integration**

### Overview

The Mark Attendance feature allows administrators to mark attendance for multiple students in bulk by uploading a CSV file. The system uses **Server-Sent Events (SSE)** for real-time progress updates, providing instant feedback as each ticket is processed.

#### Key Capabilities:
- ✅ Bulk attendance marking via CSV upload
- 📊 Real-time progress tracking with SSE
- 🎨 Live visual feedback for each ticket
- 📈 Statistics dashboard (success/skipped/failed)
- 🔄 Batch processing (20 tickets per batch)
- ⚡ Instant status updates without page refresh

### Features

#### 1. CSV File Upload
- Drag-and-drop or click-to-upload interface
- CSV file validation (must end with .csv)
- Automatic parsing of CSV data
- Preview of parsed data (first 5 entries)
- File removal option with reset functionality
- Format instructions displayed inline

#### 2. Real-Time Processing with SSE
- EventSource connection for live updates
- Sends CSV data as JSON to backend
- Listens for 8 different event types
- Handles connection errors gracefully
- Automatically closes connection on completion
- Progress bar with percentage and count

#### 3. Visual Feedback System
- 🟢 **Green cards** - Successfully marked attendance
- 🟡 **Yellow cards** - Already marked (skipped)
- 🔴 **Red cards** - Failed to process
- **Batch indicator** - Shows current batch being processed
- **Live statistics** - Updates in real-time
- **Progress bar** - Animated with smooth transitions

### SSE Event Structure

The backend sends 8 different event types:

#### 1. `start` - Processing Begins
```json
{
  "message": "Bulk attendance marking started",
  "totalTickets": 100,
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

#### 2. `batch-start` - Batch Processing Begins
```json
{
  "batchNumber": 1,
  "totalBatches": 5,
  "batchSize": 20,
  "startIndex": 1,
  "endIndex": 20,
  "timestamp": "2025-10-21T10:30:01.000Z"
}
```

#### 3. `processing` - Individual Ticket Check
```json
{
  "ticketId": "YESS25001",
  "index": 1,
  "total": 100,
  "status": "checking",
  "timestamp": "2025-10-21T10:30:02.000Z"
}
```

#### 4. `success` ✅ - Attendance Marked Successfully
```json
{
  "ticketId": "YESS25001",
  "yessTicketId": "YESS25001",
  "fullName": "John Doe",
  "email": "john@example.com",
  "institution": "ABC College",
  "index": 1,
  "total": 100,
  "status": "completed",
  "attendanceMarked": true,
  "attendanceMarkedAt": "2025-10-21T10:30:02.500Z",
  "timestamp": "2025-10-21T10:30:02.500Z"
}
```

#### 5. `skipped` ⚠️ - Already Marked
```json
{
  "ticketId": "YESS25002",
  "yessTicketId": "YESS25002",
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "index": 2,
  "total": 100,
  "status": "already-marked",
  "message": "Attendance already marked",
  "timestamp": "2025-10-21T10:30:03.000Z"
}
```

#### 6. `error` ❌ - Processing Failed
```json
{
  "ticketId": "YESS25003",
  "index": 3,
  "total": 100,
  "status": "failed",
  "error": "Ticket not found: YESS25003",
  "timestamp": "2025-10-21T10:30:03.500Z"
}
```

#### 7. `batch-complete` - Batch Finished
```json
{
  "batchNumber": 1,
  "totalBatches": 5,
  "completedTickets": 20,
  "totalTickets": 100,
  "successCount": 18,
  "errorCount": 2,
  "timestamp": "2025-10-21T10:30:05.000Z"
}
```

#### 8. `complete` 🎉 - All Tickets Processed
```json
{
  "message": "Bulk attendance marking completed",
  "totalTickets": 100,
  "successCount": 95,
  "errorCount": 3,
  "skippedCount": 2,
  "timestamp": "2025-10-21T10:30:30.000Z"
}
```

### User Guide

#### How to Use

1. **Prepare CSV File**: Create a CSV file with the following format:
   ```csv
   ticketId
   YESS25001
   YESS25002
   YESS25003
   ```

2. **Upload File**: Navigate to "Mark Attendance" page from admin dashboard and upload your CSV file

3. **Review Preview**: Check the number of entries found and verify ticket IDs

4. **Process Attendance**: Click "Mark Attendance for X Entries" button and watch real-time progress

5. **Review Results**: After completion, review the summary with success/skipped/failed counts

### API Endpoint

**Endpoint:** `POST /api/admin/mark-attendance-bulk`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "tickets": [
    { "ticketId": "YESS25001" },
    { "ticketId": "YESS25002" }
  ]
}
```

### Files Modified

1. **`/src/pages/MarkAttendance.jsx`** - Complete implementation with CSV upload and SSE handling
2. **`/src/config/api.js`** - Added `ADMIN_MARK_ATTENDANCE_BULK` endpoint
3. **`/src/pages/TicketDetails.jsx`** - Added "Mark Attendance" navigation links
4. **`/src/App.jsx`** - Added MarkAttendance route

### Security Considerations
- JWT authentication required for all operations
- Token validation on backend for SSE connection
- File type validation (only .csv accepted)
- XSS prevention (all user input sanitized)
- CORS configuration for SSE endpoints

---

**Built with ❤️ for the engineering student community by IEEE LINK**
