# 🛍️ Full-Stack E-Commerce Platform

A modern, fully responsive e-commerce application built with **Next.js**, **Express.js**, and **MongoDB**.  
Provides a complete shopping experience for customers and a management dashboard for admins.

---

## 🚀 Project Overview

This project delivers a full e-commerce system featuring:

- Product browsing & filtering  
- Cart and checkout simulation  
- User authentication & profile  
- Order management  
- Admin dashboard (products, categories, orders)  

Designed with clean UI/UX and scalable backend architecture.

---

## 🧰 Technology Stack

### 🎨 Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Context API
- Lucide Icons
- react-hot-toast

### 🛠️ Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs
- cookie-parser

---

## ✨ Features

### 👤 Customer Features
- User login/register system
- Profile page + order history
- Homepage with categories & featured products
- Product list page with:
  - Category filter  
  - Price filter  
  - Rating filter  
  - Sorting (price, rating, newest)  
  - Pagination  
  - Search bar  
- Product detail page (gallery, specs, rating)
- Add to cart + quantity updates
- Checkout simulation (shipping address + dummy payment)
- View personal orders

### 🛒 Shopping Cart
- Add/remove/update items  
- Price calculations  
- Stored in React context for fast UX  

### 🛠️ Admin Features
- Dashboard with key statistics:
  - Total sales  
  - Total orders  
  - Customer count  
  - Recent orders  
- Product management (add, edit, delete)
- Category management
- Stock management (hide out-of-stock products)
- Order listing for admins
- Bonus: Customer list + order history

---

## ⚙️ Installation

### Requirements
- Node.js 18+
- MongoDB (Local or Atlas)

---

## 🔐 Environment Variables

### Backend → `.env`

```bash
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3000
```

### Frontend → `.env`

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd backend
npm install
npm run dev
```

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📡 API Documentation

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user |
| GET    | /api/auth/me       | Get logged user |

### 📦 Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/products | List products |
| GET    | /api/products/:id | Product details |

### 🏷️ Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/categories | List categories |

### 🧾 Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/orders | Create order |
| GET    | /api/orders/my | User's orders |

### 🛠️ Admin API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/admin/orders | All orders |
| GET    | /api/admin/products | All products |
| GET    | /api/admin/customers | Customer list |

---

## ☁️ Deployment Guide

### Backend Deployment
- Render  

### Frontend Deployment
- Vercel

---

## 🏁 Final Notes

This project was developed as a complete full-stack e-commerce system, focusing on clean architecture, reusable UI, and scalable backend structure.

