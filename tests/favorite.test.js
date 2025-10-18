const request = require("supertest");
const app = require("../src/app");
const { sequelize, User, Car, Favorite } = require("../src/models");
const jwt = require("jsonwebtoken");
const config = require("../src/config");
const { v4: uuidv4 } = require("uuid");

describe("Favorite Endpoints", () => {
  let user1, token1, car1;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create User 1
    const user1Id = uuidv4();
    user1 = await User.create({
      id: user1Id,
      firstName: "Fav",
      lastName: "User",
      email: "fav@example.com",
      password: "password",
    });
    token1 = jwt.sign({ id: user1.id }, config.jwt.secret);

    // Create a car
    car1 = await Car.create({
      id: uuidv4(),
      make: "FavMake",
      model: "FavModel",
      year: 2021,
      price: 30000,
      userId: user1.id,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("POST /api/favorites", () => {
    it("should add a car to a user's favorites", async () => {
      const res = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${token1}`)
        .send({ carId: car1.id });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.carId).toBe(car1.id);
      expect(res.body.data.userId).toBe(user1.id);
    });

    it("should not add a duplicate favorite", async () => {
      const res = await request(app)
        .post("/api/favorites")
        .set("Authorization", `Bearer ${token1}`)
        .send({ carId: car1.id });

      expect(res.statusCode).toEqual(409); // Conflict
    });
  });

  describe("GET /api/favorites", () => {
    it("should get the user's list of favorites", async () => {
      const res = await request(app)
        .get("/api/favorites")
        .set("Authorization", `Bearer ${token1}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].Car.make).toBe("FavMake");
    });
  });

  describe("DELETE /api/favorites/:carId", () => {
    it("should remove a car from favorites", async () => {
      const res = await request(app)
        .delete(`/api/favorites/${car1.id}`)
        .set("Authorization", `Bearer ${token1}`);

      expect(res.statusCode).toEqual(200);

      // Verify it's gone
      const favs = await Favorite.findAll({ where: { userId: user1.id } });
      expect(favs.length).toBe(0);
    });
  });
});
