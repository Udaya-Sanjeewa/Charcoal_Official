# User eCommerce Features Guide

## Overview

Your website now has a complete eCommerce system allowing users to register, browse products, add items to cart, and place orders.

## Sample User Account

A demo user account has been created for testing:

- **Email**: `user@example.com`
- **Password**: `user123`

## User Features

### 1. User Registration (`/register`)
- New users can create an account
- Required fields: Full Name, Email, Password
- Optional fields: Phone number
- After registration, users are automatically logged in

### 2. User Login (`/user-login`)
- Existing users can log in with email and password
- Demo credentials are displayed on the login page
- Session is stored in localStorage

### 3. Product Browsing (`/products`)
- View all active products
- Filter by category (firewood, charcoal, bundles, rentals)
- Switch between grid and list views
- **Add to Cart** button for each product (except rentals)
- Products display: name, price, description, and features

### 4. Shopping Cart (`/cart`)
- View all items in cart
- Update quantities (increase/decrease)
- Remove items from cart
- See real-time total calculation
- Proceed to checkout
- Empty cart shows helpful message

### 5. My Orders (`/orders`)
- View all placed orders
- See order details:
  - Order number
  - Order date
  - Order status (pending, processing, completed, cancelled)
  - Products ordered
  - Total amount

### 6. User Profile (`/profile`)
- Edit personal information
- Update address details
- Modify phone number
- Save changes to database

### 7. Navigation Features
- Cart icon with item count badge
- User menu with:
  - My Orders
  - Profile
  - Logout
- Login/Sign Up buttons when not logged in

## Database Structure

### Tables Created

1. **user_profiles** - Extended user information
   - Full name, phone, address details
   - Linked to Supabase Auth users

2. **cart_items** - Shopping cart
   - User's products
   - Quantities
   - Linked to both users and products

3. **orders** - Completed orders
   - Order number (auto-generated)
   - Status, total amount
   - Shipping address
   - Order notes

4. **order_items** - Individual order products
   - Product details at time of order
   - Quantities
   - Linked to orders and products

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Cart items are user-specific
- Orders are user-specific
- Profile data is protected

## Admin vs User

### Admin Features
- Login at `/login`
- Credentials: `admin@example.com` / `admin123`
- Full product management (CRUD operations)
- Can view/edit/delete all products
- Toggle product status (active/inactive)

### User Features
- Login at `/user-login`
- Credentials: `user@example.com` / `user123`
- Browse and purchase products
- Manage personal cart
- View own orders
- Update own profile

## How to Use

1. **As a New User**:
   - Click "Sign Up" in navigation
   - Fill out registration form
   - Start shopping immediately

2. **As an Existing User**:
   - Click "Login" in navigation
   - Enter email and password
   - Browse products and add to cart

3. **Shopping Flow**:
   - Browse products at `/products`
   - Click "Add to Cart" on desired items
   - Click cart icon to view cart
   - Adjust quantities if needed
   - Click "Proceed to Checkout"

4. **Managing Account**:
   - Click your name in navigation
   - Select "Profile" to update info
   - Select "My Orders" to view purchase history
   - Select "Logout" to sign out

## Technical Implementation

- **Frontend**: Next.js 13 with React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context (Cart, Language)

## Next Steps

You can enhance the system by:
1. Implementing actual checkout/payment processing
2. Adding order status updates
3. Sending email notifications
4. Adding product reviews
5. Implementing wishlist functionality
6. Adding order tracking
7. Integrating payment gateway (Stripe, PayPal, etc.)

## Support

All user authentication is handled through Supabase Auth with proper RLS policies ensuring data security and privacy.
