const request = require("supertest");
const app = require("../src/app");
const { sequelize, User, Car } = require("../src/models");
const jwt = require("jsonwebtoken");
const config = require("../src/config");
const { v4: uuidv4 } = require("uuid");

describe("Car Endpoints", () => {
  let testUser;
  let testToken;
  let testCar;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create a test user
    const userId = uuidv4();
    testUser = await User.create({
      id: userId,
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password123",
    });

    // Create a JWT for the test user
    testToken = jwt.sign({ id: testUser.id }, config.jwt.secret, {
      expiresIn: "1h",
    });

    // Create a car for the test user
    testCar = await Car.create({
      id: uuidv4(),
      make: "TestMake",
      model: "TestModel",
      year: 2020,
      price: 20000,
      userId: testUser.id,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("GET /api/cars", () => {
    it("should get a list of cars", async () => {
      const res = await request(app).get("/api/cars");
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rows).toBeInstanceOf(Array);
      expect(res.body.data.rows.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/cars", () => {
    it("should create a new car when authenticated", async () => {
      const res = await request(app)
        .post("/api/cars")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          make: "Honda",
          model: "Civic",
          year: 2022,
          price: 22000,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.make).toBe("Honda");
    });

    it("should fail to create a car without authentication", async () => {
      const res = await request(app).post("/api/cars").send({
        make: "Honda",
        model: "Civic",
        year: 2022,
        price: 22000,
      });
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("PUT /api/cars/:id", () => {
    it("should update a car if user is the owner", async () => {
      const res = await request(app)
        .put(`/api/cars/${testCar.id}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({ price: 21000 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.price).toBe("21000.00");
    });

    it("should fail to update if user is not the owner", async () => {
      // Create another user and token
      const otherUser = await User.create({
        id: uuidv4(),
        firstName: "Other",
        lastName: "User",
        email: "other@example.com",
        password: "password",
      });
      const otherToken = jwt.sign({ id: otherUser.id }, config.jwt.secret, {
        expiresIn: "1h",
      });

      const res = await request(app)
        .put(`/api/cars/${testCar.id}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ price: 22000 });

      expect(res.statusCode).toEqual(403);
    });
  });
});
