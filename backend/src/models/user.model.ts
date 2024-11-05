import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: string; // Optional property
  createdAt?: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required."],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required."],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// hashing password

UserSchema.pre("save", async function (this: IUser, next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// comparing password

// Create and export the User model
const UserModel = model<IUser>("User", UserSchema);
export default UserModel;
