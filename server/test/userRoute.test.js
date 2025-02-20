/** @format */

const request = require("supertest");
const express = require("express");
const userRouter = require("../src/routes/userRoute");

describe("User Routes", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/users", userRouter);
  });

  describe("POST /api/users/register", () => {
    it("should have register route", async () => {
      const response = await request(app).post("/api/users/register");
      expect(response.status).not.toBe(404);
    });
  });

  describe("POST /api/users/login", () => {
    it("should have login route", async () => {
      const response = await request(app).post("/api/users/login");
      expect(response.status).not.toBe(404);
    });
  });

  describe("POST /api/users/refresh-token", () => {
    it("should have refresh token route", async () => {
      const response = await request(app).post("/api/users/refresh-token");
      expect(response.status).not.toBe(404);
    });
  });

  describe("POST /api/users/logout", () => {
    it("should have logout route", async () => {
      const response = await request(app).post("/api/users/logout");
      expect(response.status).not.toBe(404);
    });
  });
});
