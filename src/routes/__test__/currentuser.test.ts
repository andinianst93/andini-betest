import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const { cookie } = await signin();
  console.log("Cookie in test:", cookie);

  const res = await request(app)
    .get("/api/v1/users/me")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  // Check for the user details
  expect(res.body.currentUser).toBeDefined();

  expect(res.body.currentUser.emailAddress).toEqual("test@test.com");
});

it("responds with an error if not authenticated", async () => {
  const res = await request(app).get("/api/v1/users/me").send().expect(401);

  // Check for the error message
  expect(res.body.errors).toBeDefined();
  expect(res.body.errors[0].message).toEqual("Not authorized");
});
