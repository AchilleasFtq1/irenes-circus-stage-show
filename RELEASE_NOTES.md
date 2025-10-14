# Release Notes — Irene's Circus Shop Update

## Version 2.0.0 - October 2025

### 🛍️ E-commerce Features

#### Payment and Checkout
- **Redesigned Checkout Flow**: Clean 3-step process (Information → Shipping → Payment)
- **Complete Address Collection**: Full shipping address with phone numbers
- **Consistent Payment Buttons**: Stripe/PayPal buttons with loading states and mobile-friendly layout
- **Server-calculated Totals**: VAT and shipping calculated on backend; orders store subtotal/tax/shipping/total
- **Discount System**: Optional discount codes and gift cards at checkout with automatic balance deduction

#### Product Management
- **Product Variants**: Support for size/color variants with individual pricing and inventory
- **Multiple Product Images**: Swipe gallery with touch support and full-screen lightbox
- **Product Categories**: Products now have categories with filtering on shop page
- **Enhanced Shop Page**: Search bar, category filter, and sort options (newest/price)

#### Order Management
- **Tracking Numbers**: Admin can add tracking numbers when fulfilling orders
- **Complete Order Data**: Orders store full contact info and shipping addresses
- **Order Status Workflow**: Pending → Paid → Fulfilled with admin controls

### 🎫 Promotions & Gift Cards

#### Discount Codes
- **Promotion System**: Percentage or fixed-amount discounts
- **Admin CRUD Interface**: Create, edit, activate/deactivate promotions
- **Validation Rules**: Minimum subtotal, usage limits, date ranges
- **Automatic Application**: Applied during checkout with real-time validation

#### Gift Cards  
- **Digital Gift Cards**: Generate codes with balance tracking
- **Admin Management**: Issue, view balance, activate/deactivate
- **Checkout Integration**: Apply gift card balance to orders
- **Balance Updates**: Automatic deduction on successful payment

### 📧 Transactional Emails
- **Order Confirmation**: Sent automatically on payment completion
- **Fulfillment Notification**: Includes tracking number when order ships
- **Email Configuration**: Backend EMAIL_* environment variables
- **Professional Templates**: Clean HTML emails with order details

### 📊 Admin Features

#### New Admin Pages
- **Orders Dashboard**: View all orders, update status, add tracking
- **Promotions Manager**: Full control over discount campaigns
- **Gift Cards Manager**: Issue and manage gift card inventory
- **Accounting Export**: Export orders by date/status for tax reporting

#### Accounting Tools
- **CSV Export**: Download order data with filters
- **Batch Marking**: Mark orders as exported for tracking
- **Date Range Selection**: Filter by order date
- **Status Filtering**: Export only specific order statuses

### 🔧 Technical Improvements

#### Database
- **Migration System**: Automated database schema updates
- **New Collections**: promotions, giftcards tables
- **Enhanced Models**: Orders with shipping addresses, variants in products
- **Indexes**: Optimized queries for categories and order status

#### Infrastructure
- **Build Process**: Fixed Render deployment with proper dependency handling
- **Environment Config**: Additional variables for email service
- **Error Handling**: Improved validation and error messages

### 📱 UI/UX Enhancements

#### Checkout Experience
- **Progress Indicators**: Visual step tracking
- **Form Validation**: Required field checking before proceeding
- **Auto-save**: Form data persists during checkout
- **Mobile Responsive**: Optimized for all screen sizes

#### Product Display
- **Image Gallery**: Swipe gestures, navigation arrows, fullscreen mode
- **Variant Selector**: Easy size/color selection with price updates
- **Loading States**: Clear feedback during add-to-cart actions
- **Stock Indicators**: Real-time inventory checks

### 🔒 Security & Compliance
- **Guest Checkout**: No forced registration for better conversion
- **Secure Payments**: Stripe and PayPal integration
- **Data Protection**: Customer info stored securely
- **Email Verification**: Contact email collected for order updates

### 📝 Notes
- Email service requires configuration of EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
- Run migrations after deployment to update database schema
- Guest-first checkout approach for optimal conversion rates
- All prices internally stored in cents for precision

### 🚀 Deployment
- Updated render.yaml for stable builds
- Migration scripts run automatically on startup
- Environment variables documented in .env.example
