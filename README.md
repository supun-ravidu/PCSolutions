<div align="center">

# 🚀 PC Solutions - Ultimate E-Commerce Platform

### *Your One-Stop Shop for Premium PC Hardware & Gaming Gear*

[![Next.js](https://img.shields.io/badge/Next.js-16.0.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) • [Documentation](#features) • [Report Bug](#) • [Request Feature](#)

---

<img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square" alt="Status" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
<img src="https://img.shields.io/badge/Maintained-Yes-green?style=flat-square" alt="Maintained" />

</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🎯 User Roles](#-user-roles)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Configuration](#️-configuration)
- [👨‍💼 Admin Guide](#-admin-guide)
- [👤 User Guide](#-user-guide)
- [🎨 UI Components](#-ui-components)
- [📱 Pages Overview](#-pages-overview)
- [🔥 Firebase Integration](#-firebase-integration)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎨 **Stunning User Experience**
- 🌌 **Immersive Starfield Background** - Dynamic animated space theme
- 🎬 **Video Background Support** - Engaging visual storytelling
- ⚡ **Lightning-Fast Performance** - Optimized with Next.js 16 and React 19
- 📱 **Fully Responsive Design** - Perfect on all devices
- 🎭 **Smooth Animations** - Framer Motion & AOS integration
- 🎨 **Modern UI** - Built with Radix UI & Tailwind CSS

### 🛍️ **E-Commerce Powerhouse**
- 🛒 **Smart Shopping Cart** - Real-time cart management with Context API
- 💳 **Secure Checkout Process** - Streamlined payment flow
- 🔍 **Advanced Product Search** - Find exactly what you need
- ⭐ **Product Reviews & Ratings** - Community-driven feedback
- 📊 **Product Categories** - Organized browsing experience
- 🏷️ **Dynamic Pricing** - Real-time price updates

### 🔥 **Promotional Features**
- 🎁 **Featured Deals** - Highlight special offers
- ⚡ **Hot Deals** - Limited-time flash sales with stock counters
- 🎫 **Coupon System** - Discount codes with copy functionality
- 🎯 **Special Offers** - Curated promotional campaigns
- 📢 **Newsletter Integration** - Keep customers engaged

### 👨‍💼 **Comprehensive Admin Dashboard**
- 📊 **Analytics Dashboard** - Real-time business insights
- 📈 **Sales Tracking** - Revenue and order statistics
- 👥 **User Management** - Customer account oversight
- 📦 **Product Management** - Full CRUD operations
- 🎯 **Offer Management** - Create and manage promotions
- 🔥 **Hot Deals Manager** - Time-sensitive deals with stock tracking
- 🎁 **Featured Deals** - Spotlight products
- 🎫 **Coupon Code Generator** - Flexible discount system
- 📅 **Booking System** - Appointment management
- 💬 **Contact Management** - Customer inquiry handling with status tracking
- 🔔 **Smart Notifications** - Unread message alerts
- 📊 **Response Rate Analytics** - Track customer service performance

### 🔐 **Robust Authentication**
- 🔑 **Firebase Authentication** - Secure user login/registration
- 👤 **User Profiles** - Personalized account management
- 📜 **Order History** - Track past purchases
- 🔒 **Role-Based Access Control** - Admin vs User permissions

### 💬 **Communication Features**
- 📧 **Contact Form** - Multi-category support (General, Technical, Sales, Partnership)
- 🎯 **Priority System** - Automatic priority assignment
- 📊 **Status Tracking** - Unread, Read, Responded, Archived
- 🔔 **Admin Notifications** - Real-time unread count
- 📝 **Internal Notes** - Admin collaboration tools

### 🎭 **Customer Engagement**
- ⭐ **Testimonials Section** - Customer success stories
- 📚 **About Page** - Company story and values
- 📱 **Responsive Contact** - Multiple communication channels
- 🌟 **Dynamic Content** - Firebase-powered real-time updates

---

## 🎯 User Roles

### 👤 **Customer (Public User)**

**Access:** Full shopping experience without admin privileges

**Capabilities:**
- ✅ Browse products and categories
- ✅ View product details, reviews, and ratings
- ✅ Add items to cart and manage cart contents
- ✅ Complete checkout process
- ✅ Create account and login
- ✅ View order history and account details
- ✅ Submit contact inquiries
- ✅ View offers, deals, and use coupon codes
- ✅ Read testimonials and company information
- ✅ Subscribe to newsletter

**Restricted:**
- ❌ Cannot access admin dashboard
- ❌ Cannot manage products or inventory
- ❌ Cannot view other users' data
- ❌ Cannot create/edit promotional content

---

### 👨‍💼 **Administrator**

**Access:** Full system control and management

**Dashboard Access:**
```
/admin/dashboard - Main admin panel with analytics
/admin/contacts - Customer inquiry management
/admin/bookings - Appointment scheduling system
```

**Core Capabilities:**

**📊 Analytics & Monitoring**
- Real-time dashboard with key metrics
- Total users, products, and orders tracking
- Monthly revenue analysis
- Recent activity monitoring
- Response rate analytics
- Priority message alerts

**📦 Product Management**
- Create, Read, Update, Delete (CRUD) products
- Manage product specifications and pricing
- Update stock status and inventory
- Upload and manage product images
- Set product categories and brands
- Configure ratings and reviews

**🎯 Promotional Tools**
- **Offers Management**: Create promotional campaigns
- **Featured Deals**: Highlight special products
- **Hot Deals**: Create urgency with countdown timers and stock alerts
- **Coupon Codes**: Generate and manage discount codes
  - Percentage or fixed amount discounts
  - Set minimum purchase requirements
  - Configure usage limits
  - Track redemption statistics

**💬 Communication Hub**
- **Contact Management**:
  - View all customer inquiries in organized dashboard
  - Filter by status (Unread, Read, Responded, Archived)
  - Filter by priority (Normal, High, Urgent)
  - Real-time unread count notifications
  - Add internal notes for team collaboration
  - Mark messages as read/responded
  - Archive completed inquiries
  - View detailed submission information

**📅 Booking System**
- View and manage customer appointments
- Approve or reject booking requests
- Update booking status
- Track booking history

**👥 User Management**
- Monitor registered users
- View user activity and order history
- Access customer information (respecting privacy)

**📊 Statistics Cards**
- **Total Users**: Current user count
- **Total Products**: Inventory overview
- **Total Orders**: Sales volume
- **Revenue This Month**: Financial performance
- **Contact Messages**: Inquiry count with unread badge
- **Response Rate**: Customer service KPI
- **High Priority**: Urgent message alerts

**🔔 Notification System**
- Bell icon with unread count badge
- Color-coded priority indicators
- Real-time updates via Firebase listeners

**Restricted:**
- ❌ Cannot delete system-critical data without confirmation
- ❌ Access logged for security audit

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| ⚛️ **Next.js** | 16.0.4 | React framework with server-side rendering |
| ⚛️ **React** | 19.2.0 | UI component library |
| 📘 **TypeScript** | 5.0 | Type-safe development |
| 🎨 **Tailwind CSS** | 4.0 | Utility-first CSS framework |
| 🎭 **Framer Motion** | 12.23.24 | Animation library |
| 🎬 **AOS** | 2.3.4 | Scroll animations |
| 🎨 **Radix UI** | Latest | Accessible component primitives |
| 🎯 **Lucide React** | 0.554.0 | Beautiful icons |

### **Backend & Database**
| Technology | Version | Purpose |
|-----------|---------|---------|
| 🔥 **Firebase** | 12.6.0 | Backend-as-a-Service |
| 🔐 **Firebase Auth** | - | User authentication |
| 📊 **Firestore** | - | NoSQL database |
| 📈 **Firebase Analytics** | - | Usage tracking |

### **State Management & Forms**
| Technology | Version | Purpose |
|-----------|---------|---------|
| 🔄 **React Context** | - | Global cart state |
| 📝 **React Hook Form** | 7.66.1 | Form validation |
| 🔍 **TanStack Query** | 5.90.10 | Data fetching & caching |

### **Development Tools**
| Tool | Version | Purpose |
|------|---------|---------|
| 🧹 **ESLint** | 9.0 | Code linting |
| 🎨 **PostCSS** | 4.0 | CSS processing |
| ⚡ **React Compiler** | 1.0.0 | Performance optimization |

---

## 📦 Project Structure

```
pc-solutions-matala/
├── 📁 public/                    # Static assets
│   ├── images/                   # Image files
│   └── videos/                   # Video backgrounds
│
├── 📁 src/
│   ├── 📁 app/                   # Next.js App Router
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   │
│   │   ├── 📁 about/            # About page
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📁 account/          # User account
│   │   │   ├── page.tsx         # Account overview
│   │   │   └── 📁 orders/      # Order history
│   │   │       └── page.tsx
│   │   │
│   │   ├── 📁 admin/            # 👨‍💼 Admin Dashboard
│   │   │   ├── 📁 dashboard/   # Main admin panel
│   │   │   │   └── page.tsx    # Analytics & management
│   │   │   ├── 📁 bookings/    # Booking management
│   │   │   │   └── page.tsx
│   │   │   └── 📁 contacts/    # Contact management
│   │   │       └── page.tsx
│   │   │
│   │   ├── 📁 auth/             # Authentication
│   │   │   ├── 📁 login/
│   │   │   │   └── page.tsx
│   │   │   └── 📁 register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── 📁 cart/             # Shopping cart
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📁 checkout/         # Checkout process
│   │   │   ├── page.tsx
│   │   │   └── 📁 success/     # Order confirmation
│   │   │       └── page.tsx
│   │   │
│   │   ├── 📁 contact/          # Contact form
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📁 offers/           # Special offers
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📁 products/         # Product catalog
│   │   │   ├── page.tsx
│   │   │   └── 📁 [id]/        # Product details
│   │   │       └── page.tsx
│   │   │
│   │   └── 📁 testimonials/     # Customer reviews
│   │       └── page.tsx
│   │
│   ├── 📁 components/            # React components
│   │   ├── CartContext.tsx      # Cart state management
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Footer.tsx           # Site footer
│   │   ├── Starfield.tsx        # Animated background
│   │   ├── VideoBackground.tsx  # Video backgrounds
│   │   └── 📁 ui/               # UI components
│   │       ├── button.tsx       # Button component
│   │       ├── card.tsx         # Card component
│   │       └── input.tsx        # Input component
│   │
│   └── 📁 lib/                   # Utility functions
│       ├── firebase.ts          # Firebase configuration
│       ├── dashboard.ts         # Dashboard utilities
│       ├── migrateProducts.ts   # Data migration
│       └── utils.ts             # Helper functions
│
├── 📄 components.json            # Shadcn UI config
├── 📄 next.config.ts             # Next.js configuration
├── 📄 tailwind.config.ts         # Tailwind configuration
├── 📄 tsconfig.json              # TypeScript config
├── 📄 package.json               # Dependencies
├── 📄 eslint.config.mjs          # ESLint configuration
├── 📄 postcss.config.mjs         # PostCSS configuration
│
└── 📚 Documentation
    ├── README.md                 # This file
    ├── TESTING_GUIDE.md          # Testing documentation
    └── CONTACT_SYSTEM_FEATURES.md # Contact system details
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **Firebase Account** - [Sign Up](https://firebase.google.com/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/supun-ravidu/PCSolutions.git
cd PCSolutions
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up Firebase** (See [Configuration](#️-configuration) section)

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Production
npm run build        # Create optimized production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint for code quality checks
```

---

## ⚙️ Configuration

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Follow the setup wizard

2. **Enable Authentication**
   - Navigate to Authentication > Sign-in method
   - Enable Email/Password authentication

3. **Create Firestore Database**
   - Navigate to Firestore Database
   - Click "Create database"
   - Choose production mode
   - Select your region

4. **Get Firebase Configuration**
   - Go to Project Settings
   - Scroll to "Your apps"
   - Click the web icon (</>)
   - Copy the configuration

5. **Update Firebase Config**

Edit `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### Firestore Collections

Your database should have the following collections:

```
📊 Firestore Database
├── products/              # Product catalog
│   ├── id
│   ├── name
│   ├── price
│   ├── originalPrice
│   ├── imageUrl
│   ├── category
│   ├── brand
│   ├── rating
│   ├── reviews
│   ├── inStock
│   └── specs[]
│
├── offers/               # Special offers
│   ├── title
│   ├── description
│   ├── discount
│   ├── imageUrl
│   ├── validUntil
│   └── isActive
│
├── featuredDeals/        # Featured products
│   ├── productId
│   ├── productName
│   ├── imageUrl
│   ├── originalPrice
│   ├── dealPrice
│   ├── discount
│   ├── validUntil
│   └── isActive
│
├── hotDeals/             # Flash sales
│   ├── productId
│   ├── productName
│   ├── imageUrl
│   ├── originalPrice
│   ├── dealPrice
│   ├── discount
│   ├── validUntil
│   ├── stockLeft
│   └── isActive
│
├── couponCodes/          # Discount coupons
│   ├── code
│   ├── description
│   ├── discountType
│   ├── discountValue
│   ├── minPurchase
│   ├── maxDiscount
│   ├── validUntil
│   ├── usageLimit
│   ├── usedCount
│   └── isActive
│
├── contacts/             # Customer inquiries
│   ├── name
│   ├── email
│   ├── phone
│   ├── subject
│   ├── category
│   ├── message
│   ├── status
│   ├── priority
│   ├── submittedAt
│   ├── readAt
│   ├── respondedAt
│   └── notes
│
└── bookings/             # Appointment bookings
    ├── customerName
    ├── email
    ├── phone
    ├── service
    ├── preferredDate
    ├── status
    └── createdAt
```

---

## 👨‍💼 Admin Guide

### Accessing the Admin Dashboard

1. **Login as Admin**
   - Navigate to `/auth/login`
   - Use admin credentials
   - Access restricted to authorized users

2. **Dashboard Overview** (`/admin/dashboard`)

The admin dashboard is your command center with these sections:

#### 📊 Analytics Cards
```
┌────────────────┬────────────────┬────────────────┐
│  Total Users   │ Total Products │  Total Orders  │
│      125       │      450       │      1,234     │
└────────────────┴────────────────┴────────────────┘
┌────────────────┬────────────────┬────────────────┐
│Revenue (Month) │ Contact Messages│ Response Rate  │
│   $45,230      │   23 (5 new)   │      87%       │
└────────────────┴────────────────┴────────────────┘
```

### Managing Products

**Add New Product:**
1. Click "Add Product" button
2. Fill in product details:
   - Name, Brand, Category
   - Price & Original Price
   - Image URL
   - Specifications
   - Stock status
3. Click "Create Product"

**Edit Product:**
1. Find product in list
2. Click "Edit" icon
3. Update details
4. Save changes

**Delete Product:**
1. Click "Delete" icon
2. Confirm deletion

### Creating Promotional Content

#### 🎯 Offers
```typescript
{
  title: "Summer Sale",
  description: "Up to 50% off gaming laptops",
  discount: 50,
  imageUrl: "https://...",
  validUntil: "2025-12-31",
  isActive: true
}
```

#### 🔥 Hot Deals
```typescript
{
  productId: "prod_123",
  productName: "RTX 4090",
  discount: 15,
  stockLeft: 5,  // Creates urgency
  validUntil: "2025-12-10",
  isActive: true
}
```

#### 🎫 Coupon Codes
```typescript
{
  code: "WELCOME20",
  description: "20% off your first order",
  discountType: "percentage",
  discountValue: 20,
  minPurchase: 100,
  maxDiscount: 50,
  usageLimit: 100,
  isActive: true
}
```

### Managing Customer Contacts

**Contact Management Dashboard** (`/admin/contacts`)

**Features:**
- 📋 View all customer inquiries
- 🔔 Unread count in bell icon notification
- 🎨 Color-coded status badges
- 🔍 Filter by status and priority
- 📝 Add internal notes
- ⚡ Quick actions (Read, Respond, Archive)

**Status Workflow:**
1. **Unread** (Blue) → New submission
2. **Read** (Yellow) → Admin viewed
3. **Responded** (Green) → Admin replied
4. **Archived** (Gray) → Completed

**Priority Levels:**
- 🟢 **Normal** - General inquiries
- 🟡 **High** - Technical support (auto-assigned)
- 🔴 **Urgent** - Critical issues

**Actions:**
```
View Details → Mark as Read → Add Notes → Respond → Archive
```

### Managing Bookings

**Booking Dashboard** (`/admin/bookings`)

- View all appointment requests
- Filter by status (Pending, Approved, Completed, Cancelled)
- Update booking status
- View customer details

---

## 👤 User Guide

### Creating an Account

1. Navigate to `/auth/register`
2. Fill in registration form:
   - Email address
   - Password (minimum 6 characters)
   - Confirm password
3. Click "Register"
4. Verify email (if enabled)

### Shopping Experience

#### 🛍️ Browse Products

1. **Home Page** - Featured products and deals
2. **Products Page** (`/products`) - Full catalog
3. **Categories** - Filter by type
4. **Search** - Find specific items

#### 🛒 Add to Cart

1. Click on product to view details
2. Review specifications and reviews
3. Click "Add to Cart"
4. Continue shopping or proceed to checkout

#### 💳 Checkout Process

1. **Review Cart** (`/cart`)
   - Update quantities
   - Remove items
   - Apply coupon codes
   
2. **Enter Shipping Details** (`/checkout`)
   - Name and address
   - Contact information
   - Delivery preferences
   
3. **Payment** (Coming soon)
   - Choose payment method
   - Enter payment details
   
4. **Order Confirmation** (`/checkout/success`)
   - Order number
   - Delivery estimate
   - Email confirmation

#### 🎫 Using Coupon Codes

1. Find active coupons on home page or offers page
2. Click "Copy Code" button
3. Paste code at checkout
4. Discount applied automatically

### Account Management

**My Account** (`/account`)
- View profile details
- Update personal information
- Change password

**Order History** (`/account/orders`)
- View past orders
- Track current orders
- Download invoices
- Reorder previous purchases

### Contact Support

**Contact Form** (`/contact`)

1. Select inquiry category:
   - General Inquiry
   - Technical Support (High Priority)
   - Sales Questions
   - Partnership Opportunities

2. Fill in details:
   - Name, Email, Phone
   - Subject
   - Message

3. Submit form

4. Receive confirmation

**Your inquiry is tracked with:**
- Automatic priority assignment
- Status updates
- Response notifications

---

## 🎨 UI Components

### Custom Components

#### Starfield Background
```tsx
<Starfield
  starCount={200}
  speed={0.5}
  color="#ffffff"
/>
```
- Dynamic animated space theme
- Customizable star count and speed
- Performance optimized

#### Video Background
```tsx
<VideoBackground
  src="/videos/hero.mp4"
  overlay={true}
/>
```
- Full-screen video backgrounds
- Optional dark overlay
- Responsive and optimized

### Radix UI Components

- **Button** - Multiple variants and sizes
- **Card** - Container for content
- **Input** - Form inputs with validation
- **Dialog** - Modal windows
- **Dropdown** - Menu selections

### Icons

Using **Lucide React**:
```tsx
import { ShoppingCart, User, Search } from 'lucide-react';
```
- 1000+ beautiful icons
- Consistent design
- Fully customizable

---

## 📱 Pages Overview

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Home page with featured content | Public |
| `/products` | Product catalog | Public |
| `/products/[id]` | Product details | Public |
| `/cart` | Shopping cart | Public |
| `/checkout` | Checkout process | Registered users |
| `/checkout/success` | Order confirmation | Registered users |
| `/auth/login` | User login | Public |
| `/auth/register` | User registration | Public |
| `/account` | Account overview | Registered users |
| `/account/orders` | Order history | Registered users |
| `/contact` | Contact form | Public |
| `/offers` | Special offers | Public |
| `/testimonials` | Customer reviews | Public |
| `/about` | About company | Public |
| `/admin/dashboard` | Admin panel | Admin only |
| `/admin/contacts` | Contact management | Admin only |
| `/admin/bookings` | Booking management | Admin only |

---

## 🔥 Firebase Integration

### Collections in Use

**1. Products Collection**
- Real-time product data
- Stock management
- Price updates

**2. Orders Collection**
- Order processing
- Status tracking
- History maintenance

**3. Users Collection**
- User profiles
- Authentication
- Preferences

**4. Contacts Collection**
- Customer inquiries
- Priority tracking
- Status management

**5. Promotional Collections**
- Offers
- Featured Deals
- Hot Deals
- Coupon Codes

### Real-time Updates

Using Firebase listeners:
```typescript
onSnapshot(collection(db, 'products'), (snapshot) => {
  // Automatic UI updates when data changes
});
```

### Security Rules

Recommended Firestore rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{product} {
      allow read: if true;
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /contacts/{contact} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && 
                                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🧪 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing documentation.

### Manual Testing Checklist

**User Flow:**
- [ ] Register new account
- [ ] Login with credentials
- [ ] Browse products
- [ ] Add items to cart
- [ ] Apply coupon code
- [ ] Complete checkout
- [ ] View order history
- [ ] Submit contact form

**Admin Flow:**
- [ ] Access admin dashboard
- [ ] Create new product
- [ ] Edit existing product
- [ ] Create promotional offer
- [ ] Manage hot deal
- [ ] Generate coupon code
- [ ] View contact submissions
- [ ] Update contact status
- [ ] Manage bookings

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com/)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project settings

3. **Environment Variables**
Add Firebase config to Vercel:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live! 🎉

### Alternative Platforms

- **Netlify** - Similar to Vercel
- **Firebase Hosting** - Native Firebase solution
- **AWS Amplify** - Amazon's hosting service

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
4. **Commit with clear messages**
```bash
git commit -m "Add: Amazing new feature"
```

5. **Push to your fork**
```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**

### Contribution Guidelines

- Follow TypeScript best practices
- Maintain consistent code style
- Write clear commit messages
- Update documentation as needed
- Test your changes thoroughly

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use functional components with hooks
- Implement responsive design
- Add comments for complex logic

---

## 📄 License

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2025 PC Solutions

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Firebase Team** - Powerful backend services
- **Vercel** - Excellent hosting platform
- **Radix UI** - Accessible component primitives
- **Tailwind Labs** - Beautiful utility-first CSS
- **Lucide Icons** - Clean and modern icons

---

## 📞 Support

Need help? We're here for you!

- 📧 **Email**: support@pcsolutions.com
- 💬 **Contact Form**: [/contact](/contact)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/supun-ravidu/PCSolutions/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/supun-ravidu/PCSolutions/discussions)

---

## 🗺️ Roadmap

### Coming Soon
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Advanced product filtering
- [ ] Wishlist functionality
- [ ] Product comparison tool
- [ ] Live chat support
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode theme

### Future Enhancements
- [ ] AI-powered product recommendations
- [ ] Augmented reality product preview
- [ ] Voice search
- [ ] Social media integration
- [ ] Loyalty rewards program
- [ ] Subscription boxes
- [ ] Blog/Content management system

---

<div align="center">

### 🌟 Star Us on GitHub!

If you find this project helpful, please consider giving it a star ⭐

**Made with ❤️ by the PC Solutions Team**

[⬆ Back to Top](#-pc-solutions---ultimate-e-commerce-platform)

---

[![GitHub](https://img.shields.io/badge/GitHub-supun--ravidu-181717?style=for-the-badge&logo=github)](https://github.com/supun-ravidu)
[![Website](https://img.shields.io/badge/Website-PC%20Solutions-4CAF50?style=for-the-badge)](http://localhost:3000)

© 2025 PC Solutions. All rights reserved.

</div>
