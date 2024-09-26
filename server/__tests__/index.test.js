const request = require("supertest");
const app = require("../app");
const { hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { sequelize } = require("../models/index")
const { queryInterface } = sequelize;
const axios = require("axios");
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
    await queryInterface.bulkInsert("RoastHistories", [
      {
        UserId: 1,
        roastType: "spotify_account",
        roastData: JSON.stringify("Lo, bro, kalo lu masih dengerin TWICE dan aespa, berarti selera musik lu stuck di era 2018 dan sampe sekarang masih berjuang buat move on! TWICE followersnya banyak, tapi kualitas musiknya kayak snack instan: enak di awal, tapi bikin enek kalo kebanyakan. Sementara itu, aespa? Mereka nyoba futuristik, tapi nyatanya tetep terjebak di dunia pop yang udah basi. Lu tau nggak ada artis lain yang lebih tinggi levelnya, kayak Taylor Swift, tapi lu malah milih yang kayak gini? Kayak milih nasi goreng di resto Michelin, percuma! Bukan karena lu jelek, tapi karena selera musik lu tuh butuh GPS biar bisa nyari jalan keluar dari rutinitas yang monoton!"),
        createdAt: new Date(),
        updatedAt: new Date(),
        tracks: JSON.stringify([
          {
            name: "Espresso",
            album: {
              name: "Espresso",
              total_track: 1,
              release_data: "2024-04-12"
            },
            artists: "Sabrina Carpenter",
            explicit: true,
            popularity: 98
          },
          {
            name: "Hold On Tight",
            album: {
              name: "Hold On Tight",
              total_track: 1,
              release_data: "2023-03-30"
            },
            artists: "aespa",
            explicit: false,
            popularity: 70
          },
          {
            name: "You Were Beautiful",
            album: {
              name: "SUNRISE",
              total_track: 14,
              release_data: "2017-06-07"
            },
            artists: "DAY6",
            explicit: false,
            popularity: 63
          },
        ]),
        artists: JSON.stringify([
          {
            name: "TWICE",
            genres: "k-pop, k-pop girl group, pop",
            total_followers: 20485577,
            popularity_score: 79
          },
          {
            name: "aespa",
            genres: "k-pop girl group",
            total_followers: 6028188,
            popularity_score: 80
          },
          {
            name: "NewJeans",
            genres: "k-pop, k-pop girl group",
            total_followers: 8630404,
            popularity_score: 82
          },
        ])
      }
    ])
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    await queryInterface.bulkDelete("RoastHistories", null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete("Users", null, { truncate: true, restartIdentity: true, cascade: true });
  } catch (error) {
    console.log(error)
  }
});

const access_token = signToken({ id: 1 })

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

  test("It should return an error if email is already used", async () => {
    const response = await request(app)
      .post("/register")
      .send({ email: "newuser@example.com", password: "newpassword", fullName: "New User 2" });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Error Account already exists");
  });
  test("It should return an validation error if credentials empty", async () => {
    const response = await request(app)
      .post("/register")
      .send({ email: "newuser@example.com", password: "newpassword" });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
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

  test("It should return an error if email is missing", async () => {
    const response = await request(app)
      .post("/login")
      .send({ password: "newpassword" });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Error Credentials are required, please input the correct credentials");
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

describe("GET /spotify-login", () => {
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

jest.mock('axios');

describe("GET /spotify-callback", () => {
  test("It should handle successful callback and redirect", async () => {
    axios.mockResolvedValue({
      data: {
        access_token: 'mock_access_token'
      }
    });

    const response = await request(app)
      .get("/spotify-callback")
      .query({
        code: "mock_code",
        state: "mock_state"
      });

    expect(response.status).toBe(302);
    expect(response.header.location).toBe(`${process.env.CLIENT_BASE_URL}/callback?spotify_access_token=mock_access_token`);
  });

  test("It should return 400 if code or state is missing", async () => {
    const response = await request(app)
      .get("/spotify-callback")
      .query({
        code: "mock_code"
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Missing code or state' });
  });

  test("It should handle Spotify API error", async () => {
    axios.mockRejectedValue(new Error('Spotify API error'));

    const response = await request(app)
      .get("/spotify-callback")
      .query({
        code: "mock_code",
        state: "mock_state"
      });

    expect(response.status).toBe(500);
  });
});

describe("GET /roasts/", () => {
  test("It should return all roast the user has", async () => {
    const response = await request(app)
      .get(`/roasts`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data", expect.any(Array));
    expect(response.body.data[0]).toHaveProperty("id", expect.any(Number))
    expect(response.body.data[0]).toHaveProperty("id", expect.any(Number))
    expect(response.body.data[0]).toHaveProperty("tracks", expect.any(Array))
    expect(response.body.data[0]).toHaveProperty("artists", expect.any(Array))
    expect(response.body.data[0]).toHaveProperty("roastData", expect.any(String))
    expect(response.body.data[0]).toHaveProperty("roastType", expect.any(String))
  });

  test("It should return an error non authorized", async () => {
    const response = await request(app)
      .get("/roasts")
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Error Unauthorized");
  });
});

describe("GET /roasts/:id", () => {

  test("It should a specific roast data by id", async () => {
    const response = await request(app)
      .get(`/roasts/${1}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data", expect.any(Object));
    expect(response.body.data).toHaveProperty("id", expect.any(Number))
    expect(response.body.data).toHaveProperty("id", expect.any(Number))
    expect(response.body.data).toHaveProperty("id", expect.any(Number))
    expect(response.body.data).toHaveProperty("tracks", expect.any(Array))
    expect(response.body.data).toHaveProperty("artists", expect.any(Array))
    expect(response.body.data).toHaveProperty("roastData", expect.any(String))
    expect(response.body.data).toHaveProperty("roastType", expect.any(String));
  });

  test("It should return an error non authorized", async () => {
    const response = await request(app)
      .get("/roasts/1")
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Error Unauthorized");
  });

  test("It should return an error data not found", async () => {
    const response = await request(app)
      .get("/roasts/99999999")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Error Data not found");
  });
});

describe("DELETE /roasts/:roastId", () => {
  test("It should delete a specific roast by ID", async () => {
    const response = await request(app)
      .delete(`/roasts/${1}`)
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

  test("It should return an error non authorized", async () => {
    const response = await request(app)
      .delete("/roasts/999999")
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Error Unauthorized");
  });
});


describe("GET /profile", () => {

  test("It should return the user's profile", async () => {
    const response = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("profile");
    expect(response.body.profile).toHaveProperty("email", "test@example.com");
  });

  test("It should return error due to invalid token", async () => {
    const response = await request(app)
      .get("/profile")
      .set("Authorization", `${access_token}`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Error Unauthorized");
  });

  test("It should return an error for unauthenticated request", async () => {
    const response = await request(app).get("/profile");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Error Unauthorized");
  });
});
