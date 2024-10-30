import request from "supertest";
import { app } from "../../app";

it("responds with details about the user by account number", async () => {
  const { cookie, accountNumber } = await signin();

  const response = await request(app)
    .get(`/api/v1/users/account/${accountNumber}`)
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body).toMatchObject({
    accountNumber,
    userName: "test",
    emailAddress: "test@test.com",
  });
});

it("responds with details about the user by identityNumber", async () => {
  const { cookie, identityNumber } = await signin();

  const response = await request(app)
    .get(`/api/v1/users/identity/${identityNumber}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.identityNumber).toEqual(identityNumber);
});

it("responds with an error if not authenticated", async () => {
  const res = await request(app)
    .get("/api/v1/users/account/random123asd")
    .send()
    .expect(401);

  // Check for the error message
  expect(res.body.errors).toBeDefined();
  expect(res.body.errors[0].message).toEqual("Not authorized");
});
