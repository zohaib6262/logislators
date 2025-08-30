import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import representativesRoutes from "./src/routes/representatives.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Keap API Configuration
const keapConfig = {
  clientId: process.env.KEAP_CLIENT_ID,
  clientSecret: process.env.KEAP_SECRET,
  redirectUri: process.env.KEAP_REDIRECT_URI,
  accessToken: process.env.KEAP_ACCESS_TOKEN,
  refreshToken: process.env.KEAP_REFRESH_TOKEN,
};

// Routes
import userContact from "./src/routes/userConatct.js";
import feature from "./src/routes/feature.js";
import votingSection from "./src/routes/votingSection.js";
import homePage from "./src/routes/homePage.js";
import aboutPage from "./src/routes/aboutPage.js";
import resourcePage from "./src/routes/manageResourcePage.js";
import category from "./src/routes/category.js";
import officialsRoutes from "./src/routes/officials.js";
import votingRecordsRoutes from "./src/routes/votingRecord.js";
import userRoutes from "./src/routes/userRoutes.js";
import resources from "./src/routes/resources.js";
import siteSettings from "./src/routes/siteSettings.js";
import primaryColor from "./src/routes/primaryColor.js";

app.use("/api/primary", primaryColor);
app.use("/api/userContact", userContact);
app.use("/api/features", feature);
app.use("/api/voting-section", votingSection);
app.use("/api/home", homePage);
app.use("/api/about", aboutPage);
app.use("/api/resource", resourcePage);
app.use("/api/categories", category);
app.use("/api/representatives", representativesRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/resources", resources);
app.use("/api/settings", siteSettings);
app.use("/api/officials", officialsRoutes);
app.use("/api/voting-records", votingRecordsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
