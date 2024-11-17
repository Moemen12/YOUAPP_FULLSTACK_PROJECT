# YOUAPP Fullstack Project

## Quick Start

```bash
git clone https://github.com/Moemen12/YOUAPP_FULLSTACK_PROJECT.git
```

## Project Structure
```
YOUAPP_FULLSTACK_PROJECT (root)
├── you-app-backend
│   ├── api-gateway
│   ├── auth-microservice
│   ├── chat-microservice
│   ├── notification-microservice
│   ├── shared
│   └── user-microservice
└── you-app-frontend
```

## Environment Variables Setup

### Frontend (.env)
```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3000/api
JWT_SECRET_KEY=
```

### Backend Services

#### API Gateway (.env)
```env
CORS_ORIGIN=http://localhost:5300
MAIN_PORT=3000
HOST=127.0.0.1
JWT_SECRET_KEY=
RABBITMQ_URL=amqp://guest:guest@127.0.0.1:5672
AUTH_SERVICE_PORT=4001
CHAT_SERVICE_PORT=5001
USER_SERVICE_PORT=6001
```

#### Auth Microservice (.env)
```env
HOST=127.0.0.1
MAIN_PORT=4001
MONGODB_URI=mongodb://localhost/nest_backend
JWT_SECRET_KEY=
USER_SERVICE_PORT=6001
```

#### Chat Microservice (.env)
```env
HOST=127.0.0.1
MAIN_PORT=5001
MONGODB_URI=mongodb://localhost/nest_backend
JWT_SECRET_KEY=
JWT_SOCKET_TOKEN=
RABBITMQ_URL=amqp://guest:guest@127.0.0.1:5672
CHAT_SERVICE_PORT=6001
```

#### Notification Microservice (.env)
```env
HOST=127.0.0.1
MONGODB_URI=mongodb://localhost/nest_backend
RABBITMQ_URL=amqp://guest:guest@127.0.0.1:5672
CHAT_SERVICE_PORT=6001
```

#### User Microservice (.env)
```env
UPLOADTHING_TOKEN=
HOST=127.0.0.1
MAIN_PORT=6001
MONGODB_URI=mongodb://localhost/nest_backend
```

## Running the Application

### Frontend
```bash
npm run dev
```

### Backend (Development Mode) 
This command will run all microservices without needing to run each one separately

```bash

cd you-app-backend
npm run install:all
npm run start:dev-all

```

Note: The `shared` folder is a common utilities folder and doesn't need to be run separately.

## Verification
To verify that the application is running correctly, visit:
```
http://localhost:3000/api
```
You should see the message: "API GATEWAY MICROSERVICE IS RUNNING ..."

## Docker Support
Docker implementation is currently in progress.
