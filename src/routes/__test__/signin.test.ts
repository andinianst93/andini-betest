import request from "supertest";
import { app } from "../../app";

it("fails when an email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/v1/users/signin")
    .send({
      userName: "test",
      emailAddress: "test@test.com",
      password: "Password123@@",
    })
    .expect(400);
});

it("fails when an incorrect username, email and password is supplied", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "test",
      emailAddress: "test@test.com",
      password: "Password123@@",
    })
    .expect(201);
  await request(app)
    .post("/api/v1/users/signin")
    .send({
      userName: "test",
      emailAddress: "test@test.com",
      password: "Password123@##",
    })
    .expect(400);
  await request(app)
    .post("/api/v1/users/signin")
    .send({
      userName: "test",
      emailAddress: "test.com",
      password: "Password123@@",
    })
    .expect(400);
  await request(app)
    .post("/api/v1/users/signin")
    .send({
      userName: "test",
      emailAddress: "",
      password: "Password123@@",
    })
    .expect(400);
  await request(app).post("/api/v1/users/signin").send({
    userName: "",
    emailAddress: "test@test.com",
    password: "Password123@@",
  });
  await request(app)
    .post("/api/v1/users/signin")
    .send({
      userName: "testzzz",
      emailAddress: "test.com",
      password: "Password123@@",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "test",
      emailAddress: "test@test.com",
      password: "Password123@@",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/v1/users/signin")
    .send({
      userName: "test",
      emailAddress: "test@test.com",
      password: "Password123@@",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
