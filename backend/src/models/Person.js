import mongoose from "mongoose";
const CurrentRoleSchema = new mongoose.Schema(
  {
    title: String,
    org_classification: String,
    district: String,
    division_id: String,
  },
  { _id: false }
);

const JurisdictionSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    classification: String,
  },
  { _id: false }
);

const PersonSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // e.g., "ocd-person/..."
  name: String,
  party: String,
  current_role: CurrentRoleSchema,
  jurisdiction: JurisdictionSchema,
  given_name: String,
  family_name: String,
  image: String,
  email: String,
  gender: String,
  birth_date: String, // Keep as string unless you plan to use Date objects
  death_date: String,
  extras: { type: mongoose.Schema.Types.Mixed, default: {} },
  created_at: Date,
  updated_at: Date,
  openstates_url: String,
});

const Person = mongoose.model("Person", PersonSchema);

export default Representative;
