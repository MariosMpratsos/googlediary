# Advanced Full-Stack Reminder Application

A modern, containerized **full-stack reminder application** that allows users to schedule automated email reminders.

The application uses **Node.js**, **Express**, **Nodemailer**, **React**, and **Vite**, with the entire stack orchestrated through **Docker Compose**.

## Key Features

### Automated Email Notifications

Sends scheduled reminder emails to any specified email address using:

* **Nodemailer**
* **Gmail SMTP**
* Automated scheduling

---

### 12-Hour AM/PM Time Picker

Provides an intuitive **12-hour AM/PM time picker** for scheduling reminders.

The selected time is automatically converted into a **24-hour timestamp** for backend processing and scheduling.

Example:

```text
02:30 PM
    │
    ▼
14:30
```

---

### Interactive History Log

Maintains a history of reminders and displays their current status.

Reminders can be categorized as:

* **Scheduled**
* **Done**
* **Past**
* **Today**
* **Tomorrow**
* **Future**

The interface updates the reminder status based on its scheduled time.

---

### LocalStorage Persistence

The frontend uses the browser's **LocalStorage** to preserve the reminder history between browser sessions.

This means previously stored reminders remain available after closing and reopening the browser.

---

### Advanced Filtering

Users can filter reminders according to their scheduled date.

Available filters include:

* **All**
* **Past**
* **Today**
* **Tomorrow**
* **Future**

---

### Dockerized Development Environment

The entire application can be launched using **Docker Compose**.

The development environment supports:

* Containerized frontend
* Containerized backend
* Hot reloading
* Environment variables
* Isolated dependencies
* Easy application startup

---

## Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **Nodemailer**
* **Cors**
* **Dotenv**

### Frontend

* **React**
* **Vite**
* **JavaScript**
* **JSX**
* **LocalStorage**

### Infrastructure

* **Docker**
* **Docker Compose**

---

## Project Structure

```text
my-reminder-app/
├── server.js
├── package.json
├── Dockerfile
├── .env
├── .gitignore
├── .dockerignore
├── docker-compose.yml
│
└── frontend/
    ├── src/
    │   └── App.js
    ├── package.json
    └── Dockerfile
```

### Important Files

| File                    | Description                                   |
| ----------------------- | --------------------------------------------- |
| `server.js`             | Main Express backend server                   |
| `package.json`          | Backend dependencies and npm scripts          |
| `Dockerfile`            | Backend Docker image configuration            |
| `.env`                  | Environment variables and email configuration |
| `.gitignore`            | Files excluded from Git                       |
| `.dockerignore`         | Files excluded from Docker builds             |
| `docker-compose.yml`    | Frontend and backend orchestration            |
| `frontend/src/App.js`   | Main React application component              |
| `frontend/package.json` | Frontend dependencies                         |
| `frontend/Dockerfile`   | Frontend Docker image configuration           |

---

## Application Architecture

The application consists of a React frontend and a Node.js backend.

```text
                     ┌──────────────────┐
                     │      User        │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │ React + Vite     │
                     │    Frontend      │
                     │   Port: 5173     │
                     └────────┬─────────┘
                              │
                              │ HTTP
                              ▼
                     ┌──────────────────┐
                     │ Node.js +        │
                     │ Express Backend  │
                     │   Port: 5000     │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │    Nodemailer    │
                     │   Gmail SMTP     │
                     └────────┬─────────┘
                              │
                              ▼
                       Reminder Email
```

---

# Configuration

## Environment Variables

The backend uses a `.env` file to store configuration values such as the server port and Gmail credentials.

Create a `.env` file in the **root project directory**:

```text
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Environment Variables

| Variable     | Description                                |
| ------------ | ------------------------------------------ |
| `PORT`       | Port used by the Express backend           |
| `EMAIL_USER` | Gmail account used to send reminder emails |
| `EMAIL_PASS` | Gmail App Password used by Nodemailer      |

> **Security Note:** Never commit your `.env` file or email credentials to GitHub.

Make sure `.env` is included in your `.gitignore`:

```text
.env
```

---

## Gmail Configuration

The application uses **Nodemailer** to send emails through Gmail.

For Gmail authentication, an **App Password** should be used rather than your normal Gmail account password.

The credentials are loaded through environment variables:

```javascript
process.env.EMAIL_USER
process.env.EMAIL_PASS
```

This keeps the credentials outside the application source code.

---

# Getting Started

## Prerequisites

Make sure the following are installed on your machine:

* **Docker**
* **Docker Compose**

Verify Docker:

```bash
docker --version
```

Verify Docker Compose:

```bash
docker compose version
```

---

## Running with Docker

### 1. Open the Project Directory

Open a terminal in the root project directory:

```bash
cd my-reminder-app
```

---

### 2. Configure the Environment

Create the `.env` file:

```text
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

### 3. Build and Start the Containers

Build the Docker images and start the application:

```bash
docker compose up --build
```

Docker Compose will start both the frontend and backend services.

---

## Access the Application

Once the containers are running, open the frontend in your browser:

```text
http://localhost:5173
```

The backend API is available at:

```text
http://localhost:5000
```

### Application Ports

| Service                   |   Port |
| ------------------------- | -----: |
| React / Vite Frontend     | `5173` |
| Node.js / Express Backend | `5000` |

---

## How the Application Works

The basic reminder workflow is:

```text
User
 │
 │ Creates reminder
 ▼
React Frontend
 │
 │ Sends reminder data
 ▼
Express Backend
 │
 │ Stores / schedules reminder
 ▼
Reminder Scheduler
 │
 │ When scheduled time is reached
 ▼
Nodemailer
 │
 │ Gmail SMTP
 ▼
User's Email
```

---

## Reminder Status

The frontend determines the state of reminders based on their scheduled date and time.

For example:

```text
                    Reminder
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
        Past          Today       Future
          │            │            │
          ▼            ▼            ▼
        Done        Scheduled    Scheduled
```

The history interface allows users to quickly identify which reminders have already been completed and which are still scheduled.

---

## LocalStorage

Reminder history is persisted using the browser's LocalStorage.

Conceptually, the application stores reminder data like:

```javascript
localStorage.setItem(
  "reminders",
  JSON.stringify(reminders)
);
```

When the application starts, the stored reminders can be retrieved:

```javascript
const reminders = JSON.parse(
  localStorage.getItem("reminders")
);
```

This allows reminder history to persist between browser sessions.

---

# Docker Commands

## Start the Application

```bash
docker compose up
```

## Build and Start

```bash
docker compose up --build
```

## Run in the Background

```bash
docker compose up -d
```

## Stop the Containers

```bash
docker compose down
```

## Rebuild the Containers

```bash
docker compose build
```

## View Logs

```bash
docker compose logs
```

## Follow Logs

```bash
docker compose logs -f
```

## View Running Containers

```bash
docker ps
```

---

# Development

During development, Docker Compose can be used to run the frontend and backend simultaneously.

Start the development environment:

```bash
docker compose up --build
```

When source files are mounted into the containers and the appropriate development servers are configured, changes can be reflected automatically through **hot reloading**.

---

## Email Notification Flow

The email notification process works as follows:

```text
Scheduled Reminder
       │
       ▼
Backend Scheduler
       │
       ▼
Nodemailer
       │
       ▼
Gmail SMTP
       │
       ▼
Recipient Email
```

Nodemailer handles the communication between the Node.js backend and the Gmail SMTP service.

---

## Features

* **Automated email reminders**
* **Gmail SMTP integration**
* **Nodemailer email delivery**
* **12-hour AM/PM time picker**
* **Automatic 24-hour time conversion**
* **Reminder history**
* **Scheduled / Done status tracking**
* **LocalStorage persistence**
* **Advanced reminder filtering**
* **React frontend**
* **Express backend**
* **Docker containerization**
* **Docker Compose orchestration**
* **Hot reloading for development**
* **Environment variable configuration**

---

## Security Considerations

The application uses environment variables for sensitive email configuration.

Never place credentials directly inside source code:

```javascript
// Do not do this
const password = "my-real-password";
```

Instead, use environment variables:

```javascript
const password = process.env.EMAIL_PASS;
```

Also make sure the `.env` file is excluded from Git:

```text
.env
```

For production deployments, additional security measures such as HTTPS, authentication, rate limiting, and secure secret management should be considered.

---

## License

This project is intended for educational and development purposes.
