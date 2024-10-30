import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
  var signin: () => Promise<{
    cookie: string[];
    accountNumber: string;
    identityNumber: string;
  }>;
}

let mongo: any;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection is not established");
  }
  const collections = await db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async (): Promise<{
  cookie: string[];
  accountNumber: string;
  identityNumber: string;
}> => {
  const userName = "test";
  const emailAddress = "test@test.com";
  const password = "Password123@@";

  const response = await request(app)
    .post("/api/v1/users/signup")
    .send({ userName, emailAddress, password })
    .expect(201);

  const cookie = response.get("Set-Cookie") || [];
  const { accountNumber, identityNumber } = response.body.data;
  return { cookie, accountNumber, identityNumber };
};
