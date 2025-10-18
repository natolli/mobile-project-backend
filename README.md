CarApp API Backend

Welcome to the CarApp API, a robust backend solution for a modern car marketplace application. This project is built with Node.js, Express, and Sequelize, featuring a complete set of endpoints for managing users, cars, favorites, and an AI-powered recommendation chat.

Features

User Authentication: Secure user registration and login using JWT.

Car Management: Full CRUD operations for car listings.

Advanced Filtering: Powerful search, pagination, filtering, and sorting for car browsing.

Favorites System: Users can save and manage a list of their favorite cars.

AI Assistant: Integrated with Google Gemini for intelligent car recommendations based on natural language queries.

PostgreSQL Database: Utilizes a powerful and scalable relational database.

Getting Started

Prerequisites

Node.js (v18 or higher)

npm

PostgreSQL

Installation & Setup

Clone the repository:

git clone <your-repository-url>
cd my-app

Install dependencies:

npm install

Set up your environment variables:

Copy the example file: cp .env.example .env

Open the .env file and fill in your database credentials and GEMINI_API_KEY.

Create your PostgreSQL database:

Ensure your PostgreSQL server is running.

Create a database with the name you specified in your .env file.

Run database migrations:

npm run db:migrate

(Optional) Seed the database with sample data:

npm run seed

Running the Application

Development Mode (with auto-reload):

npm run dev

Run Tests:

npm test

The server will be running at http://localhost:3000.

🚀 API Documentation

🔑 Authentication

Most endpoints are protected. First, register or log in to receive a JWT. Include this token in the Authorization header for all protected requests.

Header Format: Authorization: Bearer <your_jwt_here>

👤 Auth Endpoints

Method

Endpoint

Access

Description

POST

/api/auth/register

Public

Create a new user account.

POST

/api/auth/login

Public

Log in and receive a JWT.

GET

/api/auth/profile

Protected

Get the current user's profile.

<details>
<summary>View Auth Endpoint Details</summary>

Register User

Endpoint: POST /api/auth/register

Body:

{
"firstName": "John",
"lastName": "Doe",
"email": "john.doe@example.com",
"password": "password123"
}

Login User

Endpoint: POST /api/auth/login

Body:

{
"email": "john.doe@example.com",
"password": "password123"
}

</details>

🚗 Car Endpoints

Method

Endpoint

Access

Description

GET

/api/cars

Public

Get all cars with filtering, sorting, pagination.

GET

/api/cars/search

Public

Full-text search for cars.

GET

/api/cars/:id

Public

Get a single car by its ID.

POST

/api/cars

Protected

Create a new car listing.

PUT

/api/cars/:id

Protected (Owner)

Update a car listing.

DELETE

/api/cars/:id

Protected (Owner)

Delete a car listing.

<details>
<summary>View Car Endpoint Details</summary>

Get All Cars

Endpoint: GET /api/cars

Query Parameters:
| Parameter | Type | Description |
| :--------- | :----- | :------------------------------------- |
| page | number | Page number for pagination. |
| limit | number | Number of items per page. |
| make | string | Filter by car make (e.g., "Toyota"). |
| model | string | Filter by car model (e.g., "Camry"). |
| minPrice | number | Filter by minimum price. |
| maxPrice | number | Filter by maximum price. |
| year | number | Filter by a specific year. |
| bodyType | string | Filter by body type (e.g., "suv"). |
| sortBy | string | Sort by price, year, or mileage. |
| sortOrder| string | asc or desc. |

Create Car

Endpoint: POST /api/cars

Body:

{
"make": "Ford",
"model": "Mustang",
"year": 2023,
"price": 45000.00,
"bodyType": "coupe",
"mileage": 1500,
"color": "Red",
"description": "A beautiful sports car.",
"features": ["Leather Seats", "Turbo Engine"],
"images": ["url_to_image1.jpg"]
}

</details>

⭐ Favorites Endpoints

Method

Endpoint

Access

Description

GET

/api/favorites

Protected

Get the user's favorited cars.

POST

/api/favorites

Protected

Add a car to favorites.

DELETE

/api/favorites/:carId

Protected

Remove a car from favorites.

<details>
<summary>View Favorites Endpoint Details</summary>

Add Car to Favorites

Endpoint: POST /api/favorites

Body:

{
"carId": "car_uuid_to_favorite"
}

</details>

🤖 AI Chat Endpoint

Method

Endpoint

Access

Description

POST

/api/ai/chat

Protected

Get AI-powered car recommendations.

<details>
<summary>View AI Chat Endpoint Details</summary>

Chat with AI Assistant

Endpoint: POST /api/ai/chat

Body:

{
"message": "I'm looking for a reliable SUV under $30,000."
}

Example Response:

{
"message": "Based on your request...",
"recommendedCars": [
{ "id": "car_uuid_1", "make": "Toyota", "model": "RAV4" }
]
}

</details>
