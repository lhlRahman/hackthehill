// ./models/user.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  friends: {
    type: Array,
    default: [],
  },
});

const User = model("User", UserSchema);
export default User;
