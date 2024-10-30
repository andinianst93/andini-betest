import mongoose, { Schema, Document, Model } from "mongoose";
import { Password } from "../services/Password";

// An interface that describes the properties required to create a new User
interface UserAttrs {
  emailAddress: string;
  userName: string;
  password: string;
  accountNumber: string;
  identityNumber: string;
}

// An interface that describes the properties a User Document has
interface UserDocument extends Document {
  emailAddress: string;
  userName: string;
  password: string;
  accountNumber: string;
  identityNumber: string;
}

// An interface that describes the properties a User Model has
interface UserModel extends Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

const userSchema = new Schema(
  {
    emailAddress: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    identityNumber: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Hash the password if it has been modified before saving
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    try {
      const hashed = await Password.toHash(this.get("password"));
      this.set("password", hashed);
    } catch (err) {
      done(err as Error);
      return;
    }
  }
  done();
});

// Add a custom build method to enforce type checking
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
