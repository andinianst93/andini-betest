import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/User";

it("deletes the user if authenticated", async () => {
  const { cookie } = await signin();

  let existingUser = await User.findOne({ emailAddress: "test@test.com" });
  expect(existingUser).not.toBeNull();

  await request(app)
    .delete("/api/v1/users/me")
    .set("Cookie", cookie)
    .expect(200);

  existingUser = await User.findOne({ emailAddress: "test@test.com" });
  expect(existingUser).toBeNull();
});

it("responds with an error if the user is not authenticated", async () => {
  const response = await request(app)
    .delete("/api/v1/users/me")
    .send()
    .expect(401);

  expect(response.body.errors).toBeDefined();
  expect(response.body.errors[0].message).toEqual("Not authorized");
});
