module.exports = {
  apps: [
    {
      name: "api-gateway",
      script: "./api-gateway/dist/api-gateway/src/main.js",
      cwd: "./api-gateway",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "auth-microservice",
      script: "./auth-microservice/dist/main.js",
      cwd: "./auth-microservice",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "chat-microservice",
      script: "./chat-microservice/dist/main.js",
      cwd: "./chat-microservice",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "notification-microservice",
      script: "./notification-microservice/dist/main.js",
      cwd: "./notification-microservice",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "user-microservice",
      script: "./user-microservice/dist/main.js",
      cwd: "./user-microservice",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
