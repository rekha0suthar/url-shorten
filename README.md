# Shortify - URL Shortener Application

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## Overview

**Shortify** is a professional and user-friendly URL shortening application designed to help users create, manage, and analyze short links effortlessly. Whether you're looking to share links on social media, track URL performance, or organize links by topics, Shortify provides a comprehensive solution.

## Features

- **Google Authentication:**

  - Secure user login via Google accounts.
  - Protects user data and URL history.

- **URL Shortening:**

  - Generate short URLs for any long URL.
  - Option to create custom aliases for personalized short links.
  - Categorize URLs by topics for better organization.

- **URL History:**

  - View a paginated list of all shortened URLs.
  - Filter URLs based on topics.
  - Access detailed analytics for each URL.

- **Analytics Dashboard:**

  - Overall analytics to monitor URL performance.
  - Detailed insights for individual URLs, including click counts, geographical data, and user-agent information.

- **Topic Analytics:**

  - View analytics for URLs grouped by topics.
  - Track performance of URLs by topic.

- **Responsive Design:**

  - Optimized for various devices and screen sizes.
  - Intuitive and clean UI built with Material-UI.

- **Theme Customization:**
  - Modern color themes to match your brand or preference.

## Technologies Used

### Frontend

- **React**: User interface library.
- **Material-UI (MUI)**: UI component library for React.
- **React Router DOM**: Routing library for React applications.
- **Axios**: Promise-based HTTP client for browser and Node.js.
- **React Toastify**: Notification library for React.
- **Vite**: Fast frontend build tool.

### Backend

- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **Nanoid**: Unique string ID generator.
- **express-rate-limit**: Basic rate-limiting middleware for Express.
- **UAParser.js**: User-Agent parser.
- **geoip-lite**: Geolocation lookup library.

## Demo

[Shortify Demo](https://shortify-nu.vercel.app/) <!-- Replace with actual demo GIF or screenshot -->

## Challenges Faced

1. Short URL Redirect

   > Challenge: Implementing a short URL redirect proved to be tricky.

   > Solution: I initially attempted to solve it on my own. When I encountered difficulties, I turned to a YouTube tutorial which provided the guidance I needed.

2. URLs Analytics

   > Challenge: Tracking and analyzing URL data was another hurdle.

   > Solution: I conducted online research and discovered several informative blog posts that helped me understand the analytics process and proceed with the implementation.

3. Login only while creating a url

   > Challenge: I wanted to ensure that users are logged in only while creating a url.

   > Solution: I used the `useLocation` hook to get the state from the redirect and then used the `useAuth` hook to check if the user is logged in. If not, I redirected the user to the login page.

4. Docker setup

   > Challenge: I never used docker before.

   > Solution: I read the documentation and followed the steps to setup the docker compose file.

## Getting Started

### Prerequisites

- **Node.js** (v14 or later)
- **npm** or **Yarn**
- **MongoDB** instance (local or cloud-based)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/rekha0suthar/url-shorten.git
   cd url-shorten
   ```

2. **Install Backend Dependencies:**

   ```bash
   cd backend
   npm install
   # or
   yarn install
   ```

3. **Install Frontend Dependencies:**

   ```bash
   cd ../frontend
   npm install
   # or
   yarn install
   ```

## Docker setup

1. **Build the Docker Images:**

   ```bash
   docker-compose build
   ```

2. **Start the Docker Containers:**

   ```bash
   docker-compose up -d
   ```

3. **Access the Application:**

   Open your browser and navigate to `http://localhost:3000` to access Shortify.

   > **Note:**
   >
   > - The application will be available at `http://localhost:3000`.
   > - The backend will be available at `http://localhost:5000`.
   > - The MongoDB will be available at `http://localhost:27017`.
   > - The Redis will be available at `http://localhost:6379`.

4. **Stop the Docker Containers:**

   ```bash
   docker-compose down
   ```

5. **Remove the Docker Containers, Docker Network, Images, Volumes:**

   ```bash
   docker-compose down -v
   ```

6. **Execute Commands Inside Containers:**

   ```bash
     docker-compose exec backend bash
     docker-compose exec frontend sh
   ```

## Environment Variables

Create a `.env` file in both the `backend` and `frontend` directories with the following configurations:

#### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> **Note:**
>
> - Replace `your_mongodb_connection_string` and `your_jwt_secret` with your actual MongoDB URI and a strong secret key for JWT.
> - Replace `your_google_client_id` and `your_google_client_secret` with your Google OAuth credentials. You can obtain these from the [Google Developers Console](https://console.developers.google.com/).

### Running the Application

1. **Start the Backend Server:**

   ```bash
   cd frontend
   npm run dev
   ```

   The backend server should now be running on `http://localhost:5000`.

2. **Start the Frontend Development Server:**

   Open a new terminal window/tab and navigate to the `frontend` directory:

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`.

3. **Accessing the Application:**

   Open your browser and navigate to `http://localhost:3000` to access Shortify.

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### 1. **Login with Google**

- **URL:** `/auth/google`
- **Method:** `POST`
- **Description:** Redirects the user to Google for authentication.
- **Request Body:**

  ```json
  {
    "token": "djbvdsddbd"
  }
  ```

- **Response:**

  ```json
  {
    "token": "jwttoken",
    "user": {
      "email": "user@example.com",
      "name": "John Doe",
      "picture": "https://example.com/picture.jpg"
    }
  }
  ```

#### 2. **Google Authentication Callback**

- **URL:** `/auth/google/callback`
- **Method:** `GET`
- **Description:** Handles the OAuth callback from Google.
- **Response:**

  - On successful authentication, redirects the user to the frontend application with a JWT token.

#### 3. **Shorten URL**

- **URL:** `/shorten`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Description:** Create a shortened URL.
- **Request Body:**

  ```json
  {
    "originalUrl": "https://www.example.com",
    "customAlias": "exmpl", // Optional
    "topic": "acquisition" // Optional
  }
  ```

- **Response:**

  ```json
  {
    "shortUrl": "http://localhost:5000/api/shorten/exmpl",
    "createdAt": "2023-10-01T00:00:00.000Z"
  }
  ```

#### 4. **Redirect to Original URL**

- **URL:** `/shorten/:alias`
- **Method:** `GET`
- **Description:** Redirect to the original URL using the shortened alias.

#### 5. **Fetch All URLs**

- **URL:** `/urls`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Description:** Retrieve all shortened URLs for the authenticated user with pagination.
- **Query Parameters:**

  - `page` (default: `1`)
  - `limit` (default: `7`)
  - `topic` (optional)

- **Response:**

  ```json
  {
    "urls": [
      {
        "shortUrl": "exmpl",
        "originalUrl": "https://www.example.com",
        "topic": "acquisition",
        "createdAt": "2023-10-01T00:00:00.000Z",
        "clicks": [
          /* Array of click analytics */
        ]
      }
      // More URL objects...
    ],
    "total": 100,
    "page": 1,
    "pages": 15
  }
  ```

#### 6. **Fetch URL Analytics**

- **URL:** `/analytics/:alias`
- **Method:** `GET`
- **Description:** Retrieve detailed analytics for a specific shortened URL.

#### 7. **Fetch Topic Analytics**

- **URL:** `/analytics/topic/:topic`
- **Method:** `GET`
- **Description:** Retrieve analytics for a specific topic.

## Folder Structure

```
shortify/
│
├── backend/
│   ├── models/
│   │   └── UrlModel.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   └── UrlRoute.js
│   ├── controllers/
│   │   └── UrlController.js
│   └── index.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── apis/
│   │   │   └── index.js
│   │   ├── components/
│   │   │   ├── CreateUrlForm.jsx
│   │   │   └── Layout.jsx
│   │   │   └── Loading.jsx
│   │   │   └── AnalyticsChart.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── UrlList.jsx
│   │   │   └── TopicAnalytics.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── README.md
│   └── vite.config.js
│
├── README.md
└── package.json
```

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

### Steps to Contribute

1. **Fork the Repository**

   Click on the `Fork` button at the top-right corner of this repository's page.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/rekha0suthar/url-shorten.git
   cd url-shorten
   ```

3. **Create a New Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Make Your Changes**

   Implement your feature or bug fix.

5. **Commit Your Changes**

   ```bash
   git commit -m "Add feature: YourFeatureName"
   ```

6. **Push to Your Fork**

   ```bash
   git push origin feature/YourFeatureName
   ```

7. **Create a Pull Request**

   Navigate to the original repository and create a pull request from your fork's branch.

## License

Distributed under the [MIT License](LICENSE).

## Contact

- **Rekha Suthar**
- **Email:** rekha0suthar@gmail.com
- **LinkedIn:** [linkedin.com/in/rekha0suthar](https://www.linkedin.com/in/rekha0suthar)
- **GitHub:** [github.com/rekha0suthar](https://github.com/rekha0suthar)

## Acknowledgements

- [Material-UI](https://mui.com/) for powerful and flexible React components.
- [React Toastify](https://fkhadra.github.io/react-toastify/introduction) for elegant notifications.
- [Express.js](https://expressjs.com/) for the robust backend framework.
- [MongoDB](https://www.mongodb.com/) for the reliable NoSQL database solution.
- [Nanoid](https://github.com/ai/nanoid) for unique ID generation.
