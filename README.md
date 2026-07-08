# 🐔 Poultry E-Commerce Platform (In Progress)

A full-stack MERN e-commerce application for purchasing fresh poultry products online. The platform provides a complete shopping experience for customers while offering an administrative dashboard for managing products, categories, inventory, and orders.

> Project Status: 🚧 In Progress
> Core e-commerce functionality has been implemented, and additional features are currently under development.

---

## 📖 Overview

This project demonstrates the development of a real-world e-commerce application using the MERN stack. It focuses on scalable architecture, secure authentication, state management, RESTful APIs, and responsive user interfaces.

The application includes separate user and admin experiences, allowing customers to browse products, manage shopping carts, place orders, and maintain delivery addresses, while administrators manage products, categories, inventory, and platform data.

---

## ✨ Features

### Customer Features

* User registration and login
* Google OAuth authentication
* JWT-based authentication and authorization
* Browse products by category
* Product details page
* Shopping cart management
* Update cart quantities
* Shipping address management
* Responsive user interface

### Admin Features

* Secure admin authentication
* Dashboard with platform statistics
* Add products
* Update products
* Delete products
* Upload product images
* Manage product categories

---

## 🛠 Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS
* Context API
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Google OAuth
* Cloudinary

---

## 📂 Project Structure

```
client/
│
├── api/
├── assests/
├── components/
├── context/
├── layouts/
├── pages/

server/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── config/
└── uploads/
```

---

## 🔐 Authentication

The application supports multiple authentication methods:

* Email and password authentication
* Google Sign-In
* JWT-based authorization
* Protected routes
* Role-based access control for administrators

---

## 🛒 Shopping Cart

Users can:

* Add products to cart
* Remove products
* Update product quantities
* View cart totals
* Validate product stock before checkout

---

## 📦 Product Management

Administrators can:

* Create products
* Edit products
* Delete products
* Upload product images
* Assign categories
* Manage inventory levels
* Control product availability

---

## 📍 Address Management

Customers can:

* Add delivery addresses
* Edit existing addresses
* Delete saved addresses
* Select a shipping address during checkout

---

## ☁ Image Uploads

Product images are uploaded and stored using Cloudinary, providing reliable cloud-based image management.

---

## 📱 Responsive Design

The application is fully responsive and optimized for desktop, tablet, and mobile devices.

---
## screenshots
## home page
![home page](screenshots/Screenshot%20(70).png);
## cart page
![cart page](screenshots/Screenshot%20(71).png)
## shop page
![shop page](screenshots/Screenshot%20(69).png)
## product page
![admin page to add product](screenshots/Screenshot%20(68).png)

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/injifann/mern_poulty_ecommerce.git
```

### Install dependencies

Client

```bash
cd client
npm install
```

Server

```bash
cd server
npm install
```

### Configure environment variables

Create a `.env` file inside the server directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file inside the client directory.

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## ▶ Running the Application

Start the backend

```bash
npm run dev
```

Start the frontend

```bash
npm run dev
```

---

## 📚 What I Learned

Through this project I gained practical experience with:

* Building scalable REST APIs
* Designing MongoDB schemas with Mongoose
* JWT authentication and authorization
* Google OAuth integration
* React Context API for state management
* CRUD operations
* File uploads with Cloudinary
* Shopping cart implementation
* Inventory validation
* Role-based access control
* Responsive UI development
* Full-stack application architecture

---

## 🚧 Planned Features

* Product search
* Product filtering and sorting
* Wishlist
* Order status tracking
* Email notifications

---

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome. Feel free to open an issue or submit a pull request.

---


