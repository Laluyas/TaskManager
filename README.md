# Task Manager MERN App README

## Overview

This is a Task Manager application built using the MERN (MongoDB, Express, React, Node.js) stack. The project is structured with separate folders for the frontend and backend. The frontend folder contains the React application, while the backend folder contains the Express server and database logic.

## Features

- **Frontend**: Built with React for creating a dynamic user interface.
- **Backend**: Built with Node.js and Express for handling API requests.
- **Database**: Uses MongoDB for data storage.
- **Task Management**: Create, read, update, and delete tasks.

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js (https://nodejs.org/)
- MongoDB (https://www.mongodb.com/)

## Installation

Follow these steps to download and set up the project on your local machine:

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. **Install dependencies for the backend**

    ```bash
    cd backend
    npm install
    ```

3. **Install dependencies for the frontend**

    ```bash
    cd ../frontend
    npm install
    ```

## Configuration

### Backend

1. Create a `.env` file in the `backend` folder with the following content:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    ```

    Replace `your_mongodb_connection_string` with your actual MongoDB connection string.

### Frontend

1. If needed, create a `.env` file in the `frontend` folder with the following content:

    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```

    Ensure the URL matches the backend server's API endpoint.

## Running the Application

### Backend

1. Start the backend server:

    ```bash
    cd backend
    npm start
    ```

    The backend server should now be running on `http://localhost:5000`.

### Frontend

1. Start the frontend development server:

    ```bash
    cd frontend
    npm start
    ```

    The frontend application should now be running on `http://localhost:3000`.

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Interact with the application through the UI to manage your tasks.

## Project Structure

```
your-repo-name/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env (you create this file)
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env (you create this file)
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```
