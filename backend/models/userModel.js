import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  nicOrPassport: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  insuranceType: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("userModel", userSchema);
export default User;
