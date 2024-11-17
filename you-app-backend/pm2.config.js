module.exports = {
  apps: [
    {
      name: "api-gateway",
      script: "./api-gateway/dist/api-gateway/src/main.js",
      cwd: "./api-gateway",
      watch: true, // Enable watch mode
      env_development: {
        // Correct key for development environment
        NODE_ENV: "development",
      },
    },
    {
      name: "auth-microservice",
      script: "./auth-microservice/dist/main.js",
      cwd: "./auth-microservice",
      watch: true, // Enable watch mode
      env_development: {
        NODE_ENV: "development",
      },
    },
    {
      name: "chat-microservice",
      script: "./dist/main.js",
      cwd: "./chat-microservice",
      watch: true, // Enable watch mode
      env_development: {
        NODE_ENV: "development",
      },
    },
    {
      name: "notification-microservice",
      script: "./dist/main.js",
      cwd: "./notification-microservice",
      watch: true, // Enable watch mode
      env_development: {
        NODE_ENV: "development",
      },
    },
    {
      name: "user-microservice",
      script: "./user-microservice/dist/main.js",
      cwd: "./user-microservice",
      watch: true, // Enable watch mode
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
