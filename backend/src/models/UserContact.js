import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  street: String,
  city: String,
  state: String,
  zipcode: String,
  createdAt: { type: Date, default: Date.now },
});

const UserContact = mongoose.model("UserContact", userSchema);
export default UserContact;
