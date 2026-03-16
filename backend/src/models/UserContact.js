import mongoose from "mongoose";

// School Finder uses isolated sf_ collections; users remains shared.
const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    street: String,
    city: String,
    state: String,
    zipcode: String,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "sf_usercontacts" }
);

const UserContact = mongoose.model("UserContact", userSchema);
export default UserContact;
