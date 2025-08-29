import UserContact from "../models/UserContact.js";
import express from "express";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
const router = express.Router();

// Tag Configuration
const ASSEMBLY_DISTRICT_TAG_PREFIX = "Assembly District-";
const SENATE_DISTRICT_TAG_PREFIX = "State District-";

router.post("/", async (req, res) => {
  try {
    const userData = req.body;
    console.log("Received user data:", userData);

    // Check if email exists in MongoDB
    const existingUser = await UserContact.findOne({ email: userData.email });
    if (existingUser) {
      console.log("User exists, updating record");
      await UserContact.updateOne({ email: userData.email }, userData);
      const keapResult = await addToKeapCRM(userData);
      return res.status(200).json({
        success: true,
        message: "User data updated successfully",
        user: userData,
        keapResult,
      });
    }

    // Save new user to MongoDB
    console.log("Creating new user");
    const newUser = new UserContact(userData);
    await newUser.save();

    // Add to Keap CRM
    const keapResult = await addToKeapCRM(userData);

    res.status(201).json({
      success: true,
      message: "User data saved successfully",
      user: newUser,
      keapResult,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({
      success: false,
      message: "Error saving user data",
      error: error.message,
    });
  }
});

// Enhanced Keap CRM Integration
async function addToKeapCRM(userData) {
  try {
    const accessToken = process.env.KEAP_ACCESS_TOKEN;
    const DEFAULT_TAG_ID = process.env.KEAP_DEFAULT_TAG_ID;
    console.log("Processing user in Keap:", userData.email);

    // 1. Check if contact exists
    const checkResponse = await axios.get(
      `https://api.infusionsoft.com/crm/rest/v1/contacts?email=${userData.email}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    let contactId;
    let isNewContact = false;

    // Prepare contact data
    const contactPayload = {
      email_addresses: [{ email: userData.email, field: "EMAIL1" }],
      given_name: userData.firstName,
      family_name: userData.lastName,
      addresses: [
        {
          line1: userData && userData.street ? userData.street : "",
          line2: "",
          locality: userData?.city || "",
          region: userData?.state || "",
          postal_code: userData?.zipcode || "",
          zip_code: userData?.zipcode || "",
          zip_four: "",
          country_code: "USA",
          field: "OTHER",
        },
      ],
    };

    if (checkResponse.data.contacts?.length > 0) {
      // Update existing contact
      contactId = checkResponse.data.contacts[0].id;
      console.log("Updating existing contact:", contactId);
      await axios.patch(
        `https://api.infusionsoft.com/crm/rest/v1/contacts/${contactId}`,
        contactPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      // Create new contact
      console.log("Creating new contact");
      const createResponse = await axios.post(
        "https://api.infusionsoft.com/crm/rest/v1/contacts",
        contactPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      contactId = createResponse.data.id;
      isNewContact = true;
    }

    // Handle Tags
    console.log("Processing tags for contact:", contactId);
    const tagResults = await handleContactTags(
      accessToken,
      contactId,
      userData,
      DEFAULT_TAG_ID
    );
    console.log("Tag Results:", tagResults);

    // Get complete contact data with tags
    const contactResponse = await axios.get(
      `https://api.infusionsoft.com/crm/rest/v1/contacts/${contactId}?optional_properties=tag_ids`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Additional verification of applied tags
    const tagVerification = await axios.get(
      `https://api.infusionsoft.com/crm/rest/v1/contacts/${contactId}/tags`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      contact: contactResponse.data,
      tagsApplied: tagResults,
      tagsVerified: tagVerification.data,
      isNewContact,
    };
  } catch (error) {
    console.error("Keap CRM error:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

// Improved Tag Management
async function handleContactTags(
  accessToken,
  contactId,
  userData,
  defaultTagId
) {
  const results = {
    assemblyTag: null,
    senateTag: null,
    scorecardTag: null,

    appliedTags: [],
    errors: [],
  };

  try {
    // Get current tags first
    const currentTagsResponse = await axios.get(
      `https://api.infusionsoft.com/crm/rest/v1/contacts/${contactId}/tags`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const currentTagIds = currentTagsResponse.data.tags.map((tag) => tag.id);
    console.log("Current tag IDs:", currentTagIds);
    try {
      const scorecardTag = await ensureTagExists(
        accessToken,
        "2025 legislative scorecard"
      );
      console.log("Scorecard tag:", scorecardTag);
      results.scorecardTag = scorecardTag;
      console.log("Scorecard tag:", scorecardTag);

      if (!currentTagIds.includes(scorecardTag.id)) {
        const applyResult = await applyTagToContact(
          accessToken,
          contactId,
          scorecardTag.id
        );
        results.appliedTags.push({
          tagId: scorecardTag.id,
          tagName: "2025 legislative scorecard",
          result: applyResult,
        });
      } else {
        results.appliedTags.push({
          tagId: scorecardTag.id,
          tagName: "2025 legislative scorecard",
          result: "already_applied",
        });
      }
    } catch (tagError) {
      console.error("Failed to apply scorecard tag:", tagError);
      results.errors.push({
        tagType: "scorecard",
        error: tagError.message,
      });
    }

    if (userData.assemblyDistrict) {
      const assemblyTagName = `${ASSEMBLY_DISTRICT_TAG_PREFIX}${userData.assemblyDistrict}`;
      console.log("Processing assembly tag:", assemblyTagName);

      try {
        results.assemblyTag = await ensureTagExists(
          accessToken,
          assemblyTagName
        );

        if (!currentTagIds.includes(results.assemblyTag.id)) {
          const applyResult = await applyTagToContact(
            accessToken,
            contactId,
            results.assemblyTag.id
          );
          results.appliedTags.push({
            tagId: results.assemblyTag.id,
            tagName: assemblyTagName,
            result: applyResult,
          });
        } else {
          results.appliedTags.push({
            tagId: results.assemblyTag.id,
            tagName: assemblyTagName,
            result: "already_applied",
          });
        }
      } catch (tagError) {
        console.error("Failed to process assembly tag:", tagError);
        results.errors.push({
          tagType: "assembly",
          error: tagError.message,
        });
      }
    }

    if (userData.stateDistrict) {
      const senateTagName = `${SENATE_DISTRICT_TAG_PREFIX}${userData.stateDistrict}`;
      console.log("Processing senate tag:", senateTagName);

      try {
        results.senateTag = await ensureTagExists(accessToken, senateTagName);

        if (!currentTagIds.includes(results.senateTag.id)) {
          const applyResult = await applyTagToContact(
            accessToken,
            contactId,
            results.senateTag.id
          );
          results.appliedTags.push({
            tagId: results.senateTag.id,
            tagName: senateTagName,
            result: applyResult,
          });
        } else {
          results.appliedTags.push({
            tagId: results.senateTag.id,
            tagName: senateTagName,
            result: "already_applied",
          });
        }
      } catch (tagError) {
        console.error("Failed to process senate tag:", tagError);
        results.errors.push({
          tagType: "state",
          error: tagError.message,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Tag handling error:", error);
    results.errors.push({
      tagType: "general",
      error: error.message,
    });
    return results;
  }
}

// Tag Creation and Management
async function ensureTagExists(accessToken, tagName) {
  try {
    // Search for existing tag
    const searchResponse = await axios.get(
      `https://api.infusionsoft.com/crm/rest/v1/tags?name=${encodeURIComponent(
        tagName
      )}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return existing tag if found
    if (searchResponse.data.tags?.length > 0) {
      console.log("Found existing tag:", tagName);
      return searchResponse.data.tags[0];
    }

    // Create new tag
    console.log("Creating new tag:", tagName);
    const createResponse = await axios.post(
      "https://api.infusionsoft.com/crm/rest/v1/tags",
      {
        name: tagName,
        description: `Tag for ${tagName}`,
        category: null,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return createResponse.data;
  } catch (error) {
    console.error(`Error ensuring tag exists (${tagName}):`, {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    throw error;
  }
}

// Enhanced Tag Application
async function applyTagToContact(accessToken, contactId, tagId) {
  try {
    console.log(`Applying tag ${tagId} to contact ${contactId}`);

    // First check if tag is already applied
    const existingTags = await axios.get(
      `https://api.infusionsoft.com/crm/rest/v1/contacts/${contactId}/tags`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if tag already exists
    const tagExists = existingTags.data.tags.some((tag) => tag.id === tagId);
    if (tagExists) {
      console.log(`Tag ${tagId} already exists on contact ${contactId}`);
      return {
        success: true,
        alreadyApplied: true,
      };
    }

    // Apply the tag using the correct endpoint and method
    const response = await axios.post(
      `https://api.infusionsoft.com/crm/rest/v1/contacts/${contactId}/tags`,
      { tagIds: [tagId] },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Verify the tag was applied
    const verification = await axios.get(
      `https://api.infusionsoft.com/crm/rest/v1/contacts/${contactId}/tags`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      status: response.status,
      data: response.data,
      verifiedTags: verification.data.tags.map((t) => t.id),
    };
  } catch (error) {
    console.error(`Error applying tag ${tagId}:`, {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    throw {
      tagId,
      contactId,
      error: error.message,
      response: error.response?.data,
    };
  }
}

export default router;
