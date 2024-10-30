import request from "supertest";
import { app } from "../../app";

it("return a 201 on successful signup", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "test",
      emailAddress: "test@test.com",
      password: "Password123@@",
    })
    .expect(201);
});

it("return a 400 with an invalid email", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "test",
      emailAddress: "test.com",
      password: "Password123@@",
    })
    .expect(400);
});

it("return a 400 with an invalid password", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "test",
      emailAddress: "test@test.com",
      password: "p",
    })
    .expect(400);
});

it("return a 400 with an invalid username", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "t",
      emailAddress: "test@test.com",
      password: "Password123@@",
    })
    .expect(400);
});

it("return a 400 with missing username, email and password", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "",
      emailAddress: "",
      password: "",
    })
    .expect(400);
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "test",
      emailAddress: "test@test.com",
      password: "",
    })
    .expect(400);
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "test",
      emailAddress: "",
      password: "Password123@@",
    })
    .expect(400);
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "",
      emailAddress: "test@test.com",
      password: "Password123@@",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "test",
      emailAddress: "test@test.com",
      password: "Password123@@",
    })
    .expect(201);
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "test1",
      emailAddress: "test@test.com",
      password: "Password123@@",
    })
    .expect(400);
});

it("disallows duplicate usernames", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "test",
      emailAddress: "test@test.com",
      password: "Password123@@",
    })
    .expect(201);
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "test",
      emailAddress: "test1@test.com",
      password: "Password123@@",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/v1/users/signup")
    .send({
      userName: "test",
      emailAddress: "test@test.com",
      password: "Password123@@",
    })
    .expect(201);
  console.log("Set-Cookie header in test:", response.get("Set-Cookie"));
  expect(response.get("Set-Cookie")).toBeDefined();
});
