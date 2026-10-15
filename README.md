ShopKart — MERN E-Commerce Application

ShopKart is a full-stack e-commerce web application built with the MERN stack. It demonstrates the core shopping flow—from browsing products and managing a cart to placing orders with Razorpay payment integration. The project is organized as a React frontend and an Express/Node.js backend, with MongoDB for persistence.

Features

Product catalogue: Browse products and view individual product details.

Customer accounts: Register, log in, view the current profile, log out, and change passwords.

Wishlist: Add products to a wishlist and remove them later.

Shopping cart: Add products, change quantities, and remove items.

Checkout and orders: Submit a shipping address, create a payment order, verify payment, and view order history and order details.

Protected pages and API routes: Authentication is required for personal cart, wishlist, checkout, and order features.

Sample product data: The backend seeds products automatically when the database is empty; a manual seed command is also available.

Tech Stack

Layer

Technologies

Frontend

React 18, Vite, React Router, Axios, Tailwind CSS, Lucide React

Backend

Node.js, Express 4

Database

MongoDB, Mongoose

Authentication

JSON Web Tokens, bcryptjs, cookies

Payments

Razorpay SDK (configure test credentials for payment testing)

Project Structure

MERN LAB/
├── backend/
│   ├── config/          # MongoDB and Razorpay configuration
│   ├── controllers/     # Request/business logic
│   ├── middlewares/     # Authentication middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # Customer, product, cart, wishlist, and order routes
│   ├── utils/           # Token generation and product seeding
│   ├── .env.example     # Example backend environment variables
│   ├── index.js         # Express application entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Authentication and cart state
│   │   ├── pages/       # Application pages
│   │   └── services/    # API client and service methods
│   ├── package.json
│   └── vite.config.js
├── package.json         # Root-level convenience scripts
└── README.md

Prerequisites

Install the following before running the project:

Node.js (a current LTS version is recommended)

npm

MongoDB locally, or a MongoDB connection string from a hosted provider

Razorpay test API credentials if you want to test payment checkout

Getting Started

1. Install dependencies

Run these commands from the project root (MERN LAB/):

npm run install:all

Alternatively, install each package separately:

cd backend && npm install
cd ../frontend && npm install

2. Configure the backend environment

Create backend/.env by copying backend/.env.example and update the values:

PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shopkart
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret

Make sure MongoDB is running if you use the local URI. The backend also attempts to start an in-memory MongoDB instance if the configured database connection fails and the required package can start successfully. In-memory data is temporary and will not persist after the process stops.

Security: Never commit your real .env file or payment credentials. Use your own strong JWT secret and keep Razorpay secrets private. Use Razorpay test credentials during development.

3. Start the backend

From the project root, run:

npm run dev:backend

The API should be available at http://localhost:5000. Visiting the root endpoint should return a JSON status message.

4. Start the frontend

Open a second terminal at the project root and run:

npm run dev:frontend

Vite normally serves the app at http://localhost:5173. Open that address in your browser.

The frontend defaults to http://localhost:5000 for its API. To use a different backend URL, create frontend/.env with:

VITE_API_URL=http://localhost:5000

Restart the Vite development server after changing environment variables.

Useful Commands

Run these from the project root unless noted otherwise:

Command

Purpose

npm run install:all

Install backend and frontend dependencies

npm run dev:backend

Start the backend in watch mode

npm run dev:frontend

Start the Vite frontend development server

npm run seed

Run the product seeding script

npm run build:frontend

Create a production build of the frontend

To serve the frontend build locally for a preview:

cd frontend
npm run preview

API Overview

The backend uses http://localhost:5000 by default.

Base path

Purpose

Main operations

/customers

Account and authentication

POST /register, POST /login, GET /me, POST /logout, PATCH /change-password

/products

Product catalogue

GET /, GET /:id, POST /

/wishlist

Customer wishlist (protected)

GET /, POST /:productId, DELETE /:productId

/cart

Shopping cart (protected)

GET /, POST /:productId, PATCH /:productId, DELETE /:productId

/orders

Checkout and orders (protected)

POST /create-payment-order, POST /verify-payment, GET /, GET /:id

GET / returns a basic backend status response. Protected endpoints require a valid authenticated session/token as implemented by the application.

Typical User Flow

Open the product catalogue and select a product.

Register or log in to use account-specific features.

Add products to the cart or wishlist.

Update cart quantities and proceed to checkout.

Enter shipping details and complete the Razorpay test payment flow.

View the resulting order in the order history or open its detail page.

Troubleshooting

MongoDB connection error: Confirm MongoDB is running and MONGODB_URI is correct. If using a hosted database, check network access and credentials.

Frontend cannot reach the API: Confirm the backend is running on port 5000, and check VITE_API_URL if you changed the API address.

Authentication or cookie issues: Use the frontend and backend URLs configured for local development, and check the browser console and backend logs.

Payment setup errors: Verify that the Razorpay key ID and secret are valid test credentials. Do not use live keys for local testing.

No products displayed: Check the backend logs and database connection; the seed script can be run with npm run seed.

Notes

This project is intended as a learning/lab application. Review and strengthen validation, authorization, payment verification, error handling, and production security before deploying it publicly.

Do not expose secret keys in frontend code. Only frontend variables prefixed with VITE_ are intended to be available to browser-side code.

License

This project currently declares the ISC license in the root package.json.
