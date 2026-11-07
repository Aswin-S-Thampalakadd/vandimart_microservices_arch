const express = require("express");
const dotenv = require("dotenv");
const { createProxyMiddleware } = require("http-proxy-middleware");

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  console.log({
    method: req.method,
    url: req.url,
    timestamp: new Date(),
  });
  next();
});

app.get("/health", (req, res) => {
  res.json({
    service: "api-gateway",
    status: "running",
  });
});

app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/users": "/users",
    },
  }),
);

app.use(
  "/api/cars",
  createProxyMiddleware({
    target: process.env.CAR_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/cars": "/cars",
    },
  }),
);

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
