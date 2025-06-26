// import mongoose from "mongoose";

// // Voting record sub-schema
// const votingRecordSchema = new mongoose.Schema({
//   area: String,
//   notableBills: String,
//   score: String,
// });

// // Extra Points schema
// const extraPointsSchema = new mongoose.Schema({
//   bills: String,
//   points: Number,
//   description: String,
// });

// // Highlights schema
// const highlightSchema = new mongoose.Schema({
//   title: String,
//   session: String,
// });

// // Contact Information sub-schema
// const contactInfoSchema = new mongoose.Schema({
//   phone: String,
//   email: String,
//   website: String,
//   address: String,
// });

// // Main Representative schema
// const representativeSchema = new mongoose.Schema({
//   photoUrl: String,
//   name: { type: String, required: true },
//   party: String,
//   position: String,
//   district: String,
//   county: String,
//   rating: Number,
//   attendance: String,

//   biography: String,

//   contactInfo: contactInfoSchema,
//   achievements: [String],
//   votingRecord: [votingRecordSchema],
//   extraPoints: extraPointsSchema,
//   highlights: highlightSchema,
// });

// // Export model
// const Representative = mongoose.model("Representative", representativeSchema);
// export default Representative;
import mongoose from "mongoose";

const votingRecordSchema = new mongoose.Schema(
  {
    area: String,
    notableBills: String,
    score: String,
  },
  { _id: true }
);

// Extra Points schema
const extraPointsSchema = new mongoose.Schema(
  {
    bills: { type: String, default: "" },
    points: { type: Number, default: "" },
    description: { type: String, default: "" },
  },
  { _id: true }
);

// Highlights schema
const highlightSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    session: { type: String, default: "" },
    badgeNum: { type: Number },
  },
  { _id: true }
);

// Role and Jurisdiction schemas
const CurrentRoleSchema = new mongoose.Schema(
  {
    title: String,
    org_classification: String,
    district: String,
    division_id: String,
  },
  { _id: true }
);

const JurisdictionSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: String,
    classification: String,
  },
  { _id: true }
);

// Main Person schema with merged Representative fields
const RepresentativeSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  party: String,
  current_role: CurrentRoleSchema,
  jurisdiction: JurisdictionSchema,
  given_name: String,
  family_name: String,
  image: String,
  email: String,
  gender: String,
  birth_date: String,
  death_date: String,
  extras: {
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    grade: { type: Number, default: 0 },
    county: { type: String, default: "" },
    biography: { type: String, default: "" },
    votingRecord: { type: [votingRecordSchema], default: [] },
    extraPoints: { type: extraPointsSchema, default: {} },
    highlights: { type: highlightSchema, default: {} },
    // default: {},
  },
  created_at: Date,
  updated_at: Date,
  openstates_url: String,
});

const Representative = mongoose.model("Representative", RepresentativeSchema);
export default Representative;
