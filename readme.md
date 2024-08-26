# Social Media Microservices Application

This project is a social media microservices-based application that demonstrates user management and post interactions using RabbitMQ for messaging, Redis for caching, MongoDB for non-relational data storage, and Sequelize with PostgreSQL for relational data.

## Features

- **User Service**: Manage user profiles, including creating and updating user information.
- **Post Service**: Create and manage posts and comments, with support for MongoDB.
- **Messaging Service**: Utilize RabbitMQ to send notifications between services.
- **Caching**: Implement Redis to cache user data for improved performance.
- **Relational Data Storage**: Use Sequelize with PostgreSQL for relational database management.
- **Non-relational Data Storage**: Use MongoDB for managing post comments.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for Node.js.
- **RabbitMQ**: Messaging broker to handle communication between microservices.
- **Redis**: In-memory data structure store, used as a database, cache, and message broker.
- **MongoDB**: NoSQL database for non-relational data storage.
- **Sequelize**: Promise-based Node.js ORM for relational databases.
- **PostgreSQL**: Relational database for user and post data.
- **Docker**: Containerization platform to deploy the application.
- **Docker Compose**: Tool for defining and running multi-container Docker applications.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Node.js**: [Install Node.js](https://nodejs.org/)
- **yarn**: Yarn package manager

## Set up environment variables

Create a .env file in the root directory for sensitive information like database credentials and API keys. Here's an example:

```bash
REDIS_HOST=redis

RABBITMQ_URL=amqp://user:pass@rabbitmq:5672

MONGO_URL=mongodb://mongodb:27017/posts

RABBITMQ_USR=administrator
RABBITMQ_PWD=administrator

POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=db
POSTGRES_HOST=host
```

## Build and run the services using Docker Compose

To start all services (User Service, Post Service, RabbitMQ, Redis, and MongoDB), use Docker Compose.

```bash
docker-compose up --build
```

This command will:

    Build the Docker images for each service.
    Start the containers, making the services accessible.

## Verify the Setup

Once the containers are up and running, you can verify that the services are operational:

    User Service: http://localhost:4001
    Post Service: http://localhost:4002

## API Endpoints

Here are the key API endpoints for each service:
User Service

    POST /users: Create a new user.
    GET /users/:id: Get a user by ID, with Redis caching.
    PUT /users/:id: Update a user by ID.

Post Service

    POST /posts: Create a new post.
    GET /posts: Get all posts.
    POST /posts/:postId/comments: Add a comment to a post (stored in MongoDB).

## Testing the Application

You can use Postman or curl to test the API endpoints.

Example to create a user:

```bash

curl -X POST http://localhost:4001/users -H "Content-Type: application/json" -d '{"id":1,"name":"John Doe"}'
```

Example to create a post:

```bash

curl -X POST http://localhost:4002/posts -H "Content-Type: application/json" -d '{"userId":1,"content":"Hello World!"}'
```

## Shutting Down the Application

To stop and remove all running containers:

```bash

docker-compose down
```

## Additional Configuration

    Sequelize Migrations: Manage your database schema by adding Sequelize migrations.
    Environment Variables: Adjust environment variables as needed for production environments.

## Future Enhancements

- Implement authentication and authorization using JWT.
- Add more microservices (e.g., Notification Service).
- Enhance caching strategies.
- Deploy the application using Kubernetes.
