import request from "supertest";
import { app } from "../../app";

it("updates the user's username successfully", async () => {
  const { cookie } = await signin();

  const newUserName = "updatedUserName";

  const response = await request(app)
    .put("/api/v1/users/me")
    .set("Cookie", cookie)
    .send({ userName: newUserName })
    .expect(200);

  expect(response.body.data.userName).toEqual(newUserName);
});

it("updates the user's email address successfully", async () => {
  const { cookie } = await signin();

  const newEmailAddress = "newemail@test.com";

  const response = await request(app)
    .put("/api/v1/users/me")
    .set("Cookie", cookie)
    .send({ emailAddress: newEmailAddress })
    .expect(200);

  expect(response.body.data.emailAddress).toEqual(newEmailAddress);
});

it("allows updating multiple fields at once", async () => {
  const { cookie } = await signin();

  const newUserName = "updatedUserName";
  const newEmailAddress = "updatedemail@test.com";

  const response = await request(app)
    .put("/api/v1/users/me")
    .set("Cookie", cookie)
    .send({ userName: newUserName, emailAddress: newEmailAddress })
    .expect(200);

  expect(response.body.data.userName).toEqual(newUserName);
  expect(response.body.data.emailAddress).toEqual(newEmailAddress);
});

it("returns an error if not authenticated", async () => {
  await request(app)
    .put("/api/v1/users/me")
    .send({ userName: "unauthorizedUser" })
    .expect(401);
});
