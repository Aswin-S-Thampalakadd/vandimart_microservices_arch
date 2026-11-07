const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "car-service",
    status: "running",
  });
});

app.get("/cars", (req, res) => {
  res.json([
    {
      id: 1,
      brand: "Toyota",
      model: "Innova",
      price: 1200000,
    },
    {
      id: 2,
      brand: "Honda",
      model: "City",
      price: 850000,
    },
  ]);
});

const cars = [
  {
    id: 1,
    brand: "Toyota",
    model: "Innova",
    price: 1200000,
    sellerId: 1,
  },
  {
    id: 2,
    brand: "Honda",
    model: "City",
    price: 850000,
    sellerId: 2,
  },
];

app.get("/", (req, res) => {
  res.json(cars);
});

app.get("/cars/:id", async (req, res) => {
  try {
    const car = cars.find((c) => c.id === Number(req.params.id));

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    const userResponse = await axios.get(
      `http://localhost:5001/users/${car.sellerId}`,
      { timeout: 3000 },
    );

    const result = {
      ...car,
      seller: userResponse.data,
    };

    res.json(result);
  } catch (error) {
    console.error("User Service communication failed:", error.message);

    if (error.response?.status === 404) {
      return res.status(502).json({
        message: "Seller information could not be retrieved",
      });
    }

    if (error.code === "ECONNABORTED" || error.code === "ECONNREFUSED") {
      return res.status(503).json({
        message: "User Service is currently unavailable",
      });
    }

    res.status(502).json({
      message: "Failed to communicate with User Service",
    });
  }
});

const PORT = 5002;

app.listen(PORT, () => {
  console.log(`Car Service running on ${PORT}`);
});
