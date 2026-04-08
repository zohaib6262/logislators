import axios from "axios";
import { mockRepresentatives } from "../data/mokeData";

// In a real application, you would use the actual Google Civic Information API
// For demo purposes, we're using mock data

export const searchRepresentativesByAddress = async (address) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock data for demo
  return mockRepresentatives;

  // In a real application, you would uncomment the code below:
  /*
  try {
    const response = await axios.get('https://www.googleapis.com/civicinfo/v2/representatives', {
      params: {
        address,
        key: 'YOUR_API_KEY'
      }
    });
    
    // Transform API response to Representative objects
    return transformCivicApiResponse(response.data);
  } catch (error) {
    console.error('Error fetching representatives:', error);
    throw error;
  }
  */
};

export const getRepresentativeById = async (id) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Find representative in mock data
  const representative = mockRepresentatives.find((rep) => rep.id === id);

  if (!representative) {
    throw new Error("Representative not found");
  }

  return representative;
};

export const updateRepresentative = async (representative) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, you would make an API call to update the representative

  return representative;
};

// Helper function to transform Civic API response to our Representative model
// This would be implemented in a real application
const transformCivicApiResponse = (data) => {
  // Implementation would map the API response to our model
  return [];
};
