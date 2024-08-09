const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models/index");
const { hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { queryInterface } = sequelize;

beforeAll(async () => {
  try {
    await queryInterface.bulkInsert("Users", [
      {
        email: "test@example.com",
        password: hashPassword("password123"),
        fullName: "Test User",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, { truncate: true, restartIdentity: true, cascade: true });
});

describe("GET /", () => {
  test("It should return a welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Welcome to Roastify API");
  });
});

describe("POST /register", () => {
  test("It should register a new user", async () => {
    const response = await request(app)
      .post("/register")
      .send({ email: "newuser@example.com", password: "newpassword", fullName: "New User" });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email", "newuser@example.com");
    expect(response.body).toHaveProperty("fullName", "New User");
  });

  test("It should return an error if email is missing", async () => {
    const response = await request(app)
      .post("/register")
      .send({ password: "newpassword", fullName: "New User" });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Error Credentials are required, please input the correct credentials");
  });
});

describe("POST /login", () => {
  test("It should login a user and return an access token", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
  });

  test("It should return an error for incorrect credentials", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "wrongpassword" });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Error credentials does not match");
  });
});

describe("GET /roasts", () => {
  let access_token;

  beforeAll(async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });
    access_token = response.body.access_token;
  });

  test("It should return roasts for authenticated user", async () => {
    const response = await request(app)
      .get("/roasts")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });

  test("It should return an error for unauthenticated request", async () => {
    const response = await request(app).get("/roasts");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Error Unauthorized");
  });
});

describe("GET /roasts/:roastId", () => {
  let access_token;
  let roastId;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });
    access_token = loginResponse.body.access_token;

    const roastResponse = await request(app)
      .get("/spotify-roast")
      .set("Authorization", `Bearer ${access_token}`)
      .query({ spotify_access_token: "dummy_spotify_token" });
    roastId = roastResponse.body.output.id;
  });

  test("It should return a specific roast by ID", async () => {
    const response = await request(app)
      .get(`/roasts/${roastId}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("id", roastId);
  });

  test("It should return an error for non-existent roast ID", async () => {
    const response = await request(app)
      .get("/roasts/999999")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Error Data not found");
  });
});

describe("DELETE /roasts/:roastId", () => {
  let access_token;
  let roastId;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });
    access_token = loginResponse.body.access_token;

    const roastResponse = await request(app)
      .get("/spotify-roast")
      .set("Authorization", `Bearer ${access_token}`)
      .query({ spotify_access_token: "dummy_spotify_token" });
    roastId = roastResponse.body.output.id;
  });

  test("It should delete a specific roast by ID", async () => {
    const response = await request(app)
      .delete(`/roasts/${roastId}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Success delete Roast History");
  });

  test("It should return an error for non-existent roast ID", async () => {
    const response = await request(app)
      .delete("/roasts/999999")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Error Data not found");
  });
});

describe("GET /spotify-login", () => {
  let access_token;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });
    access_token = loginResponse.body.access_token;
  });

  test("It should return a Spotify login URL", async () => {
    const response = await request(app)
      .get("/spotify-login")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("loginUrl");
    expect(response.body.loginUrl).toContain("https://accounts.spotify.com/authorize");
  });

  test("It should return an error for unauthenticated request", async () => {
    const response = await request(app).get("/spotify-login");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Error Unauthorized");
  });
});

describe("GET /profile", () => {
  let access_token;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });
    access_token = loginResponse.body.access_token;
  });

  test("It should return the user's profile", async () => {
    const response = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("profile");
    expect(response.body.profile).toHaveProperty("email", "test@example.com");
  });

  test("It should return an error for unauthenticated request", async () => {
    const response = await request(app).get("/profile");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Error Unauthorized");
  });
});

describe("PATCH /profile", () => {
  let access_token;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });
    access_token = loginResponse.body.access_token;
  });

  test("It should update the user's profile picture", async () => {
    const response = await request(app)
      .patch("/profile")
      .set("Authorization", `Bearer ${access_token}`)
      .attach("image", "path/to/test/image.jpg");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Success update profile picture");
  });

  test("It should return an error for invalid file type", async () => {
    const response = await request(app)
      .patch("/profile")
      .set("Authorization", `Bearer ${access_token}`)
      .attach("image", "path/to/test/invalid.txt");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Error Uploading Image. Please make sure file uploaded is in image format");
  });
});
