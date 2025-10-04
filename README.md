# Product Listing Application

A full-stack product listing web application that displays gold jewelry products with real-time price calculation based on the current gold price.

It consists of two parts:

1. **Backend (Render)** – A RESTful API built with Node.js and Express, serving product data with dynamic price calculation.
2. **Frontend (Vercel)** – A responsive web interface that displays the products.

## Features

### Backend

- RESTful API serving product data from a JSON file.
- Real-time gold price fetched from (https://www.goldapi.io/).
- Filtering support: filter by price and popularity score.

### Frontend

- Fetches product data from the backend API.
- Displays product name, price, popularity, and color options.
- Color picker switches product images.
- Popularity score displayed out of 5 with star icons.
- Responsive carousel with arrow and swipe support.
- Fully responsive design (mobile, tablet, desktop).

### Tech Stack

- Frontend - HTML, CSS & Javascript
- Backend - Node.js, Express
- API - [GoldAPI.io](http://goldapi.io/)
- Deployment - Render, Vercel
- Version control - Git & GitHub
  
### Live Demo
- **Frontend (Vercel):** [https://product-app-yaren.vercel.app](https://product-app-yaren.vercel.app)
- **Backend (Render):** [https://product-api-yaren.onrender.com/api/products](https://product-api-yaren.onrender.com/api/products)
