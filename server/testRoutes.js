const express = require("express");
const request = require("supertest");
const app = express();
app.use(express.json());

// Import the routes
const canchaRoutes = require("./rutas/canchaRoutes");
app.use("/api/cancha", canchaRoutes);

// Test the routes
describe("API Routes", () => {
  it("GET /api/cancha/test should return a test message", async () => {
    const response = await request(app).get("/api/cancha/test");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Test route works!");
  });

  it("POST /api/cancha should create a new cancha", async () => {
    const response = await request(app)
      .post("/api/cancha")
      .send({
        nombre: "Cancha Nueva",
        descripcion: "Descripción de la cancha nueva",
        locacion: "Ubicación de la cancha",
        direccion: "Dirección de la cancha"
      });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.Cancha).toHaveProperty("id"); // Assuming the response includes an ID
  });

  it("GET /api/cancha/ should return all canchas", async () => {

    const response = await request(app).get("/api/cancha/");
    expect(response.status).toBe(200);
  });
});

// Start the server for testing
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
