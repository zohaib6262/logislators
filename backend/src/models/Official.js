// import mongoose from "mongoose";

// const votingRecordSchema = new mongoose.Schema({
//   area: String,
//   bills: String,
//   score: String,
// });

// const extraPointsSchema = new mongoose.Schema({
//   bills: [String],
//   description: String,
//   points: Number,
// });

// const officialSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   party: { type: String, required: true },
//   photoUrl: String,
//   phones: [String],
//   emails: [String],
//   urls: [String],
//   office: {
//     name: String,
//     divisionId: String,
//   },
//   address: [
//     {
//       line1: String,
//       line2: String,
//       city: String,
//       state: String,
//       zip: String,
//     },
//   ],
//   rating: String,
//   votingRecord: [votingRecordSchema],
//   extraPoints: [extraPointsSchema],
//   highlights: [String],
//   lastUpdated: { type: Date, default: Date.now },
// });

// const Official = mongoose.model("Official", officialSchema);

// export default Official;
import mongoose from "mongoose";

const OfficialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: String,
  photoUrl: String,
  office: {
    name: String,
    divisionId: String,
  },
  district: String,
  county: String,
  phones: [String],
  urls: [String],
  enhanced: {
    rating: Number,
    customDescription: String,
    sessionReport: String,
    district: String,
    county: String,
  },
  keapContactId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

export default mongoose.model("Official", OfficialSchema);
