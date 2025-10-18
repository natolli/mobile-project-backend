const request = require("supertest");
const app = require("../src/app");
const { sequelize, User } = require("../src/models");
const bcrypt = require("bcryptjs");

describe("Auth Endpoints", () => {
  // Before all tests, connect to the test database and clear it
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // After all tests, close the database connection
  afterAll(async () => {
    await sequelize.close();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user and return a token", async () => {
      const res = await request(app).post("/api/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data.user.email).toBe("john.doe@example.com");
    });

    it("should fail if email is already in use", async () => {
      const res = await request(app).post("/api/auth/register").send({
        firstName: "Jane",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(500); // Or your custom error code
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Email already in use");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login an existing user and return a token", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data).toHaveProperty("token");
    });

    it("should fail with incorrect password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john.doe@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid email or password");
    });
  });
});
