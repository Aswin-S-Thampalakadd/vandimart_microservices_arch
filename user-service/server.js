const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.json({
    service: "user-service",
    status: "running",
  });
});

app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Aswin" },
    { id: 2, name: "John" },
  ]);
});

const PORT = Number(process.env.PORT) || 5001;

const users = [
  {
    id: 1,
    name: "Aswin",
    email: "aswin@example.com",
  },
  {
    id: 2,
    name: "John",
    email: "john@example.com",
  },
];

app.get("/", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
});

app.get("/users/:id/cars", (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(
      `Failed to start User Service on port ${PORT}: ${error.message}`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(`User Service running on ${PORT}`);
});
