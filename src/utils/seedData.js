require("dotenv").config();
const { sequelize, User, Car } = require("../models");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const seedData = async () => {
  try {
    await sequelize.sync({ force: true }); // WARNING: This will drop all tables!
    console.log("Database synced!");

    // 1. Create a sample user
    const hashedPassword = await bcrypt.hash("123456", 10);
    const user = await User.create({
      id: uuidv4(),
      firstName: "Natoli",
      lastName: "Lemma",
      email: "natoli@mobile.com",
      password: hashedPassword,
    });
    console.log("Sample user created!");

    // 2. Create sample cars
    const cars = [
      {
        make: "Toyota",
        model: "Camry",
        year: 2021,
        price: 25000,
        bodyType: "sedan",
        mileage: 15000,
        features: ["Bluetooth", "Backup Camera"],
        images: ["https://placehold.co/600x400/cacaca/000?text=Camry"],
      },
      {
        make: "Honda",
        model: "CR-V",
        year: 2020,
        price: 28000,
        bodyType: "suv",
        mileage: 20000,
        features: ["Apple CarPlay", "Lane Assist"],
        images: ["https://placehold.co/600x400/cacaca/000?text=CR-V"],
      },
      {
        make: "Ford",
        model: "F-150",
        year: 2019,
        price: 35000,
        bodyType: "truck",
        mileage: 40000,
        features: ["Towing Package", "4x4"],
        images: ["https://placehold.co/600x400/cacaca/000?text=F-150"],
      },
      {
        make: "BMW",
        model: "3 Series",
        year: 2022,
        price: 45000,
        bodyType: "sedan",
        mileage: 10000,
        features: ["Sunroof", "Leather Seats"],
        images: ["https://placehold.co/600x400/cacaca/000?text=3+Series"],
      },
      {
        make: "Tesla",
        model: "Model 3",
        year: 2023,
        price: 40000,
        bodyType: "sedan",
        fuelType: "electric",
        mileage: 5000,
        features: ["Autopilot", "Panoramic Roof"],
        images: ["https://placehold.co/600x400/cacaca/000?text=Model+3"],
      },
      {
        make: "Jeep",
        model: "Wrangler",
        year: 2018,
        price: 32000,
        bodyType: "suv",
        mileage: 50000,
        features: ["Off-road Tires", "Convertible Top"],
        images: ["https://placehold.co/600x400/cacaca/000?text=Wrangler"],
      },
      {
        make: "Subaru",
        model: "Outback",
        year: 2021,
        price: 30000,
        bodyType: "suv",
        mileage: 25000,
        features: ["All-Wheel Drive", "Roof Rack"],
        images: ["https://placehold.co/600x400/cacaca/000?text=Outback"],
      },
      {
        make: "Chevrolet",
        model: "Silverado",
        year: 2020,
        price: 38000,
        bodyType: "truck",
        mileage: 35000,
        features: ["Bed Liner", "Bluetooth"],
        images: ["https://placehold.co/600x400/cacaca/000?text=Silverado"],
      },
      {
        make: "Hyundai",
        model: "Elantra",
        year: 2022,
        price: 22000,
        bodyType: "sedan",
        mileage: 12000,
        features: ["Android Auto", "Blind Spot Monitor"],
        images: ["https://placehold.co/600x400/cacaca/000?text=Elantra"],
      },
      {
        make: "Kia",
        model: "Telluride",
        year: 2023,
        price: 48000,
        bodyType: "suv",
        mileage: 8000,
        features: ["Third-row Seating", "Heated Seats"],
        images: ["https://placehold.co/600x400/cacaca/000?text=Telluride"],
      },
      {
        make: "Ford",
        model: "Mustang",
        year: 2019,
        price: 33000,
        bodyType: "coupe",
        mileage: 28000,
        features: ["V8 Engine", "Performance Exhaust"],
        images: ["https://placehold.co/600x400/cacaca/000?text=Mustang"],
      },
      {
        make: "Volkswagen",
        model: "Golf",
        year: 2018,
        price: 18000,
        bodyType: "hatchback",
        mileage: 45000,
        features: ["Turbocharged Engine", "Apple CarPlay"],
        images: ["https://placehold.co/600x400/cacaca/000?text=Golf"],
      },
      {
        make: "Mazda",
        model: "CX-5",
        year: 2021,
        price: 29000,
        bodyType: "suv",
        mileage: 18000,
        features: ["Premium Sound System", "AWD"],
        images: ["https://placehold.co/600x400/cacaca/000?text=CX-5"],
      },
      {
        make: "Lexus",
        model: "RX 350",
        year: 2020,
        price: 42000,
        bodyType: "suv",
        mileage: 22000,
        features: ["Navigation", "Sunroof"],
        images: ["https://placehold.co/600x400/cacaca/000?text=RX+350"],
      },
      {
        make: "Nissan",
        model: "Rogue",
        year: 2022,
        price: 27000,
        bodyType: "suv",
        mileage: 14000,
        features: ["360 Camera", "ProPILOT Assist"],
        images: ["https://placehold.co/600x400/cacaca/000?text=Rogue"],
      },
      // ... Add more cars to reach 25-30
    ];

    const carPromises = cars.map((car) =>
      Car.create({ ...car, id: uuidv4(), userId: user.id })
    );
    await Promise.all(carPromises);
    console.log(`${cars.length} cars created!`);

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await sequelize.close();
  }
};

seedData();
