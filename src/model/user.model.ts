import mongoose, { Schema, Document } from "mongoose"; // 👈

// Interface only give type safety (to schemas)
export interface Message extends Document {
  // _id: string;
  content: string; // typescript datatypes are lowercase
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  // 👈
  content: { type: String, required: true }, // mongoose datatypes start from uppercase.
  createdAt: { type: Date, required: true, default: Date.now },
});

export interface User extends Document {
  // 👈
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  isVerified: boolean;
  messages: Message[];
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required. "],
    trim: true,
    lowercase: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required. "],
    lowercase: true,
    unique: true,
    match: [/.+@.+\..+/, "Please use a valid email address. "], // 👈
  },
  password: {
    type: String,
    required: [true, "Password is required. "],
  },
  verifyCode: { type: String, required: [true, "Verify code is required. "] },
  isAcceptingMessage: { type: Boolean, default: false },
  messages: [messageSchema], // 👈
  verifyCodeExpiry: { type: Date, required: true, default: Date.now },
  isVerified: { type: Boolean, default: false },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema); // 👈

export default UserModel;
