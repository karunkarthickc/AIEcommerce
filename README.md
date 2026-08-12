# AI-Assisted E-Commerce Platform (MERN Stack)

A full-stack e-commerce web application built on the **MERN stack** (MongoDB, Express.js, React.js, Node.js), featuring an integrated **AI assistant** that helps customers with product discovery, recommendations, and support queries throughout their shopping experience.

## Features

- User authentication and account management
- Product catalog with search, filtering, and categories
- Shopping cart and checkout flow
- Order management and history
- **AI-powered customer assistant** for product recommendations, FAQs, and shopping guidance
- Admin panel for managing products, orders, and users
- Responsive design for desktop and mobile

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI Integration:** AI assistant module for customer interaction

## Project Structure

```
project-root/
├── client/          # React frontend
├── server files/    # Express backend, API routes, controllers
├── models/          # MongoDB schemas
└── ...
```

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local instance or a MongoDB Atlas connection string)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies

Install server dependencies from the project root:

```bash
npm install
```

Install client dependencies:

```bash
cd client
npm install
cd ..
```

### 3. Configure environment variables

Create a `.env` file in the project root and add the required variables, such as:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_service_api_key
```

> Adjust variable names to match what the codebase expects.

## Running the Project

You need to run the **server** and the **client** separately, typically in two terminal windows.

### Run the server

From the project root:

```bash
npm start
```

This starts the backend Express server (and connects to MongoDB).

### Run the client

In a separate terminal, from the project root:

```bash
cd client
npm start
```

This starts the React development server, usually available at `http://localhost:3000`, while the backend typically runs at `http://localhost:5000` (or the port specified in your `.env`).

## Usage

1. Start the server (`npm start` from root).
2. Start the client (`cd client && npm start`).
3. Open your browser at the client URL to browse products, add items to your cart, and check out.
4. Use the AI assistant widget/chat to get product recommendations or ask shopping-related questions.

## Contributing

Contributions are welcome. Please fork the repository, create a feature branch, and submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License.
