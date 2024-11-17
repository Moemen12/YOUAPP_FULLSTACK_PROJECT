# YOUAPP Fullstack Project

A modern fullstack application built with microservices architecture, featuring real-time chat, user authentication, and notifications.

## 🚀 Features

- User authentication and authorization
- Real-time chat functionality
- Notification system
- Profile management
- Microservices architecture
- API Gateway pattern

## 🛠️ Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js, NestJS
- **Database**: MongoDB
- **Message Broker**: RabbitMQ
- **File Upload**: UploadThing

## 📋 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Notifications
- `GET /api/notification/get-invitations` - Get pending invitations
- `POST /api/notification/invite` - Send invitation
- `PATCH /api/notification/invitations/respond` - Respond to invitation

### Chat
- `GET /api/chat/view-chats` - View all chats
- `GET /api/chat/invitees` - Get potential chat invitees
- `GET /api/chat/:userId` - Get chat with specific user
- `DELETE /api/chat/delete-account` - Delete user account
- `DELETE /api/chat/clear-chat` - Clear chat history

## 🏗️ Project Structure

```
YOUAPP_FULLSTACK_PROJECT (root)
├── you-app-backend
│   ├── api-gateway         # API Gateway service
│   ├── auth-microservice   # Authentication & Authorization
│   ├── chat-microservice   # Real-time chat functionality
│   ├── notification-microservice  # Notification handling
│   ├── shared             # Shared utilities and common code
│   └── user-microservice  # User management
└── you-app-frontend       # Next.js frontend application
```

## 🚦 Quick Start

### Prerequisites
- Node.js
- MongoDB
- RabbitMQ

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Moemen12/YOUAPP_FULLSTACK_PROJECT.git
cd YOUAPP_FULLSTACK_PROJECT
```

## ⚙️ Environment Variables Setup

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

## 🚀 Running the Application

### Frontend
```bash
cd you-app-frontend
npm install
npm run dev
```

### Backend
From the root directory:
```bash
cd you-app-backend
npm run install:all  # Install dependencies for all services
npm run dev:all     # Start all microservices
```

> Note: The `shared` folder contains common utilities and doesn't need to be run separately.

## ✅ Verification

To verify the application is running correctly, visit:
```
http://localhost:3000/api
```
You should see the message: "API GATEWAY MICROSERVICE IS RUNNING ..."

## 🐳 Docker Support

Docker implementation is currently in progress. Stay tuned for containerization support!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

[Add your license information here]
