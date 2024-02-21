# CapStone_FullStack
# backend

# API Endpoints
The application provides a set of RESTful API endpoints organized by functionality. Below are the key endpoint categories and their descriptions:

# # User Management
POST /api/users/register - Register a new user.
POST /api/users/login - Authenticate a user and login.
GET /api/users/ - Retrieve all users.
GET /api/users/:id - Retrieve a single user by ID.
PUT /api/users/:id - Update a user by ID.
DELETE /api/users/:id - Delete a user by ID.

# Product Management
POST /api/products - Create a new product.
GET /api/products - Retrieve all products.
GET /api/products/:id - Retrieve a product by ID.
PUT /api/products/:id - Update a product by ID.
DELETE /api/products/:id - Delete a product by ID.
GET /api/products/filter - Retrieve products based on filters.

# Order Management
POST /api/orders - Create a new order.
GET /api/orders - List all orders.
GET /api/orders/:orderId - Get details of a specific order.
PUT /api/orders/:orderId/status - Update the status of an order.
DELETE /api/orders/cancel/:orderId - Cancel a specific order.

# Admin Routes
GET /api/admin/users - Admin endpoint to retrieve all users.
GET /api/admin/user/:id - Admin endpoint to retrieve a single user by ID.
POST /api/admin/user - Admin endpoint to create a user.
PUT /api/admin/user/:id - Admin endpoint to update a user by ID.
DELETE /api/admin/user/:id - Admin endpoint to delete a user by ID.
# Products
GET /api/admin/products - Admin endpoint to retrieve all products.
GET /api/admin/products/:id - Admin endpoint to retrieve a single product by ID.
POST /api/admin/products - Admin endpoint to create a product.
PUT /api/admin/products/:id - Admin endpoint to update a product by ID.
DELETE /api/admin/products/:id - Admin endpoint to delete a product by ID.
# Orders
GET /api/admin/orders - Admin endpoint to retrieve all orders.
GET /api/admin/order/:id - Admin endpoint to retrieve a single order by ID.
POST /api/admin/order - Admin endpoint to create an order.
PUT /api/admin/order/:id - Admin endpoint to update an order by ID.
DELETE /api/admin/order/:id - Admin endpoint to delete an order by ID.


# Core Dependencies
## These dependencies and scripts are foundational for building and running a secure, efficient, and maintainable backend server with Node.js and Express. They cover a broad spectrum of the application's needs, from security to data management, request handling, and development productivity.
# express 
The backbone of most Node.js web applications, providing a robust set of features to create servers and APIs.
# mongoose
A MongoDB object modeling tool designed to work in an asynchronous environment. It provides a straightforward, schema-based solution to model your application data.
# cors
Enables Cross-Origin Resource Sharing (CORS) with various options. It's essential for allowing or restricting requested resources on a web server depending on where the HTTP request was initiated.
# dotenv
Loads environment variables from a .env file into process.env. This module is critical for managing sensitive information (like database passwords and API keys) outside of your codebase.
# axios 
A promise-based HTTP client for the browser and Node.js. Useful for making requests to external APIs from your server.
# bcryptjs
A library to help you hash passwords. It's crucial for storing user passwords securely in your database.
# jsonwebtoken (JWT)
Used for implementing token-based authentication. JWTs are compact, URL-safe means of representing claims to be transferred between two parties, allowing for stateless authentication.
# helmet
Helps secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help prevent some well-known web vulnerabilities.
# compression
Middleware that attempts to compress response bodies for all requests that traverse through the middleware, improving performance by reducing payload sizes.
# morgan
An HTTP request logger middleware for Node.js. It simplifies the process of logging requests to your application.
# body-parser
Parse incoming request bodies in a middleware before your handlers, available under the req.body property.


# Development Dependencies
# nodemon 
A utility that monitors for any changes in your source and automatically restarts your server. Perfect for development as it saves time by obviating the need to manually restart the server after each change.
## Important Scripts
# "dev"
"nodemon server.js" - This script uses nodemon to run your server, automatically restarting it whenever you make changes to your files. It's particularly useful during development for immediate feedback on your application's behavior.

