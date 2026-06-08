# Frontend Description — Pizza Ordering & Inventory Management System

The frontend of the application is built using React with a modern responsive UI for both users and admins. The application provides seamless pizza customization, secure authentication, payment integration, real-time order tracking, and inventory management.

---

# Frontend Tech Stack

* React
* Tailwind CSS
* React Router DOM
* Axios
* Redux Toolkit / Context API
* Socket.IO Client
* React Hot Toast
* Razorpay Checkout Integration

---

# Frontend Modules

## 1. Authentication Module

### Features

* User Registration
* Login
* Email Verification
* Forgot Password
* Reset Password
* JWT Authentication
* Protected Routes
* Role-Based Navigation

---

## Authentication Pages

### Register Page

Users can:

* Enter name, email, password
* Register account
* Receive verification email

### Login Page

Users/Admin can:

* Login securely
* Redirect to respective dashboard

### Forgot Password Page

* Enter email
* Receive reset link

### Reset Password Page

* Set new password securely

---

# 2. User Dashboard

After login, users are redirected to the dashboard where they can:

* View available pizza varieties
* Start building custom pizzas
* Track order history
* View real-time order status updates

---

# Dashboard UI Components

## Navbar

Contains:

* Logo
* Dashboard
* Orders
* Cart
* Profile
* Logout

---

## Pizza Cards Section

Displays:

* Pizza Image
* Pizza Name
* Ingredients
* Price
* “Customize Pizza” Button

---

# 3. Custom Pizza Builder

The pizza builder is the core interactive feature.

---

## Step-Based Pizza Builder Flow

### Step 1 — Choose Pizza Base

Display 5 options:

* Thin Crust
* Cheese Burst
* Pan Pizza
* Wheat Base
* Stuffed Crust

UI:

* Selectable cards/radio buttons
* Dynamic price update

---

### Step 2 — Select Sauce

Options:

* Tomato
* BBQ
* Garlic
* Alfredo
* Pesto

UI:

* Interactive sauce selector

---

### Step 3 — Select Cheese

Options:

* Mozzarella
* Cheddar
* Parmesan

UI:

* Dropdown or card selection

---

### Step 4 — Add Veggies

Options:

* Onion
* Capsicum
* Mushroom
* Corn
* Olive

UI:

* Multi-select checkboxes

---

### Step 5 — Add Meat

Options:

* Chicken
* Pepperoni
* Sausage

UI:

* Multi-select options

---

## Live Price Calculation

As users select ingredients:

* Total price updates dynamically
* Cart preview updates instantly

---

# 4. Cart & Checkout Module

## Cart Page

Displays:

* Selected pizza configuration
* Quantity
* Price breakdown
* Total amount

Features:

* Remove item
* Update quantity
* Proceed to payment

---

# 5. Razorpay Payment Integration

Integrated using Razorpay Test Mode.

---

## Payment Flow

1. User clicks “Pay Now”
2. Razorpay checkout popup opens
3. User completes test payment
4. On success:

   * Order placed
   * Payment confirmed
   * Success toast shown

---

# 6. Order Tracking System

Users can track pizza order status in real time.

---

## Order Status Timeline

```txt
Order Received
→ In Kitchen
→ Sent To Delivery
→ Delivered
```

---

## Real-Time Updates

Using Socket.IO:

* Status changes instantly reflect
* No page refresh required

---

# 7. Admin Dashboard

Separate frontend dashboard for admins.

---

# Admin Features

## Inventory Management

Admin can:

* Add stock
* Edit stock
* Delete ingredients
* Set threshold limits

---

## Inventory Table UI

Columns:

* Ingredient Name
* Category
* Quantity
* Threshold
* Status
* Actions

---

## Low Stock Indicator

If stock < threshold:

* Row turns red
* Alert badge displayed

---

# 8. Order Management Panel

Admin can:

* View all orders
* Change order status
* Monitor payment status

---

## Admin Order Table

Columns:

* Order ID
* User
* Pizza Details
* Payment Status
* Order Status
* Update Actions

---

# 9. Notification System

Frontend notifications include:

* Successful login
* Payment success
* Order placed
* Status updated
* Low stock alerts (admin)

Using:

* React Hot Toast

---

# 10. Real-Time Features

Using Socket.IO Client:

* Instant order updates
* Admin dashboard live refresh
* Inventory auto-update after orders

---

# Frontend Folder Structure

```bash
src/
│
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── pizza/
│   ├── cart/
│   ├── admin/
│   └── common/
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── PizzaBuilder.jsx
│   ├── Cart.jsx
│   ├── Orders.jsx
│   ├── AdminDashboard.jsx
│   └── Inventory.jsx
│
├── redux/
├── services/
├── hooks/
├── utils/
├── routes/
└── App.jsx
```

---

# Frontend Security

* Protected Routes
* JWT Token Storage
* Role-Based Rendering
* Axios Interceptors
* Form Validation
* Secure API Calls

---

# Responsive Design

The frontend is fully responsive:

* Desktop
* Tablet
* Mobile

Using:

* Tailwind Grid
* Flexbox
* Responsive Breakpoints

---

# User Experience Features

* Smooth Animations
* Loading Spinners
* Skeleton Screens
* Toast Notifications
* Interactive Pizza Builder
* Real-Time Tracking
* Clean Dashboard UI

---

# Optional Advanced Frontend Features

You can additionally add:

* Dark Mode
* Drag & Drop Pizza Builder
* Animated Pizza Preview
* Coupon System
* Google Login
* PWA Support
* Voice Ordering AI

---

# Frontend Workflow Summary

```txt
User Register/Login
        ↓
Dashboard
        ↓
Customize Pizza
        ↓
Add to Cart
        ↓
Razorpay Payment
        ↓
Order Placed
        ↓
Admin Receives Order
        ↓
Status Updates
        ↓
User Tracks Order Live
```
