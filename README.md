# MERN Book Search Engine

## Description
This project transforms a RESTful API-driven Google Books search engine into a GraphQL-powered application using Apollo Server. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it allows users to search for books, save favorites, and manage their saved books seamlessly.

## Table of Contents 
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributin]



## Features
- Search for books using the Google Books API.
- User authentication with sign-up and login functionality.
- Save books to your personal account and view them later.
- Remove saved books from your account.

## Technologies
Front End: React, Apollo Client
Back End: Node.js, Express.js, Apollo Server
Database: MongoDB with MongoDB Atlas
Hosting: Render

## Installation
1. Clone the repository: Copy code
```
git clone <repository-url>
cd <repository-name>
```
2. Install dependencies: Copy code
```
npm install
```
3. Set up environment variables for MongoDB Atlas and authentication secrets in a .env file: Copy code
```
MONGODB_URI=<your-mongodb-uri>
SECRET=<your-secret-key>
```
4. Start the development server: Copy code
```
npm run develop
```

## Deployment
The application is deployed on Render. Access the live application [here]().

## Screenshots
The homepage.
The saved books list.

## Contributions
Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
Create a new branch: Copy code
```
git checkout -b feature-name
```
2.Commit your changes: Copy code
```
git commit -m "Add a new feature"
```
3. Push to the branch: Copy code
```
git push origin feature-name
```
4. Open a pull request.