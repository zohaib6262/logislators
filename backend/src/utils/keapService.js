/**
 * Shared Keap (Infusionsoft) CRM helpers.
 * Used by: userContact route (contact form), schoolSubmissions route (Add School form).
 */
import axios from "axios";

const KEAP_BASE = "https://api.infusionsoft.com/crm/rest/v1";

function getHeaders(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

/**
 * Create or update a contact in Keap by email. Idempotent.
 * @param {string} accessToken - KEAP_ACCESS_TOKEN
 * @param {object} payload - { email, given_name, family_name?, street?, city?, state?, zipcode?, phone?, company? }
 * @returns {{ contactId: number, isNewContact: boolean }}
 */
export async function createOrUpdateContact(accessToken, payload) {
  const email = (payload.email || "").toString().trim();
  if (!email) throw new Error("Keap contact payload must include email.");

  const checkResponse = await axios.get(
    `${KEAP_BASE}/contacts?email=${encodeURIComponent(email)}`,
    { headers: getHeaders(accessToken) }
  );

  const contactPayload = {
    email_addresses: [{ email, field: "EMAIL1" }],
    given_name: payload.given_name || "",
    family_name: payload.family_name || "",
    addresses: [
      {
        line1: payload.street || "",
        line2: "",
        locality: payload.city || "",
        region: payload.state || "",
        postal_code: payload.zipcode || "",
        zip_code: payload.zipcode || "",
        zip_four: "",
        country_code: "USA",
        field: "OTHER",
      },
    ],
  };
  if (payload.company != null && payload.company !== "") {
    contactPayload.company_name = String(payload.company);
  }
  if (payload.phone != null && String(payload.phone).trim() !== "") {
    contactPayload.phone_numbers = [
      { number: String(payload.phone).trim(), field: "PHONE1" },
    ];
  }

  if (checkResponse.data.contacts?.length > 0) {
    const contactId = checkResponse.data.contacts[0].id;
    await axios.patch(
      `${KEAP_BASE}/contacts/${contactId}`,
      contactPayload,
      { headers: getHeaders(accessToken) }
    );
    return { contactId, isNewContact: false };
  }

  const createResponse = await axios.post(
    `${KEAP_BASE}/contacts`,
    contactPayload,
    { headers: getHeaders(accessToken) }
  );
  return { contactId: createResponse.data.id, isNewContact: true };
}

/**
 * Ensure a tag exists in Keap (search by name, create if missing). Returns tag object with id.
 */
export async function ensureTagExists(accessToken, tagName) {
  const searchResponse = await axios.get(
    `${KEAP_BASE}/tags?name=${encodeURIComponent(tagName)}`,
    { headers: getHeaders(accessToken) }
  );

  if (searchResponse.data.tags?.length > 0) {
    return searchResponse.data.tags[0];
  }

  const createResponse = await axios.post(
    `${KEAP_BASE}/tags`,
    {
      name: tagName,
      description: `Tag for ${tagName}`,
      category: null,
    },
    { headers: getHeaders(accessToken) }
  );
  return createResponse.data;
}

/**
 * Apply a tag to a contact. Skips if already applied. Idempotent.
 */
export async function applyTagToContact(accessToken, contactId, tagId) {
  const existingTags = await axios.get(
    `${KEAP_BASE}/contacts/${contactId}/tags`,
    { headers: getHeaders(accessToken) }
  );

  if (existingTags.data.tags?.some((t) => t.id === tagId)) {
    return { success: true, alreadyApplied: true };
  }

  await axios.post(
    `${KEAP_BASE}/contacts/${contactId}/tags`,
    { tagIds: [tagId] },
    { headers: getHeaders(accessToken) }
  );
  return { success: true, alreadyApplied: false };
}
