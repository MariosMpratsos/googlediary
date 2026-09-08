# Advanced Full-Stack Reminder Application

A modern, containerized full-stack reminder system that allows users to schedule automated email reminders using Node.js, Express, Nodemailer, React, and Vite, fully orchestrated via Docker Compose.

---

## Key Features

* **Automated Email Notifications:** Sends scheduled reminders directly to any email address using Nodemailer and Gmail.
* **12-Hour AM/PM Time Picker:** Precise time selection with automatic conversion to 24-hour timestamps.
* **Interactive History Log:** Tracks past, present, and future reminders with real-time status updates (Scheduled vs. Done).
* **LocalStorage Persistence:** Keeps your history log saved across browser sessions.
* **Advanced Filtering:** Filter reminders by All, Past, Today, Tomorrow, and more.
* **Dockerized & Environment Secured:** Easily run the entire stack with hot-reloading using Docker Compose and secure environment variables (.env).

---

## Tech Stack

* **Backend:** Node.js, Express.js, Nodemailer, Cors, Dotenv
* **Frontend:** React, Vite, JavaScript (JSX)
* **Containerization:** Docker & Docker Compose

---

## Project Structure

```text
my-reminder-app/
├── server.js           # Express backend server
├── package.json        # Backend dependencies
├── Dockerfile          # Backend container configuration
├── .env                # Secret environment variables (Gmail credentials)
├── .gitignore          # Git exclusion rules
├── .dockerignore       # Docker exclusion rules
├── docker-compose.yml  # Docker Compose orchestration
└── frontend/           # React + Vite client app
    ├── src/
    │   └── App.js      # Main frontend UI component
    ├── package.json    # Frontend dependencies
    └── Dockerfile      # Frontend container configuration

Configuration (.env)

Make sure you have a .env file in your root folder with your Gmail app credentials:

PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

How to Run with Docker

Ensure you have Docker and Docker Compose installed on your machine.

    Open your terminal in the root project folder.

    Build and start the application containers:
    Bash

    docker compose up --build

    Access the application:

        Frontend UI (Vite dev server): http://localhost:5173

        Backend API: http://localhost:5000

To stop the containers, press Ctrl + C in your terminal or run:
Bash

docker compose down
