# Budget Buddy

Budget Buddy is a personal finance tracking application designed to help users manage their income and expenses, visualize spending habits, and stay on top of their budget.

## Access the Application

* **Live Frontend:** [https://budgetbuddy-frontend.vercel.app/](https://budgetbuddy-frontend.vercel.app/)
* **Signup Invite Code:** `indy@39012`

## Features

* User Authentication (Signup, Login, Logout)
* Transaction Tracking (Income/Expense)
* Categorization of Transactions
* Editing and Deleting Transactions
* Dashboard with visualizations (Income vs Expense, Spending by Category)

## Technology Stack

* **Frontend:** React, Tailwind CSS
* **Backend:** Node.js (Express), Prisma ORM, PostgreSQL Database
* **Containerization:** Docker

## Deployment

The application is currently deployed using free tier hosting services:

* **Frontend (React):** Hosted on Vercel
* **Backend (Express/Prisma/Postgres):** Hosted on Render (Dockerized)

## Limitations of Free Tier Hosting

Please be aware of the following limitations due to using free hosting tiers:

* **Backend Spin Down:** The backend service on Render may spin down after a period of inactivity. The first request after spin-down will experience a delay while the service starts up again.
* **Database Limits:** The free tier PostgreSQL database on Render has limitations on storage size and resources. It is suitable for testing and demonstration but not for large-scale production use.
* **Performance:** Free tier resources are limited, which may affect the overall speed and responsiveness, especially under load.

## Getting Started

### Prerequisites

* Node.js (v18 or later recommended)
* Docker & Docker Compose (for running the backend locally)
* A PostgreSQL database (for local development, can use Docker)

### Local Development

1.  **Clone the repositories:**
    ```bash
    git clone <your-frontend-repo-url> budgetbuddy-frontend
    git clone <your-backend-repo-url> budgetbuddy-backend
    ```
2.  **Backend Setup:**
    * Navigate to the `budgetbuddy-backend` directory.
    * Set up your environment variables (e.g., in a `.env` file based on a `.env.example` if provided) for `DATABASE_URL` and `JWT_SECRET`.
    * Ensure Docker is running.
    * Build and run the backend using Docker Compose (if you have a `docker-compose.yml`) or build the Docker image and run the container manually.
    * Run Prisma migrations: `docker exec <backend-container-name> npx prisma migrate deploy` (adjust container name as needed).
3.  **Frontend Setup:**
    * Navigate to the `budgetbuddy-frontend` directory.
    * Install dependencies: `npm install` or `yarn install`.
    * Set up your environment variable for the backend API URL (e.g., in a `.env` file based on a `.env.example` if provided): `VITE_API_URL=http://localhost:4000` (or whatever port your backend runs on locally).
    * Start the frontend development server: `npm run dev` or `yarn dev`.

The application should now be running locally.

### Deployment (Overview)

Deployment involves building the frontend and backend and deploying them to their respective hosting platforms. Refer to the deployment steps discussed previously for detailed instructions on using Vercel for the frontend and Render for the backend.

## Contributing

(Optional: Add information on how others can contribute if this is an open-source project)

## License

This project is licensed under the MIT License.
