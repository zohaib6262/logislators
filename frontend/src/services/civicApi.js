// import { Official } from "../components/OfficialCard";
// import { Office } from "../components/RepresentativeList";

// For demo/mock purposes - in a real application, this would:
// 1. Make an API call to your backend service
// 2. Your backend would call Google Civic API using your API key
// 3. Response would be returned to the frontend

// Mock data for demonstration
const MOCK_DATA = {
  offices: [
    {
      name: "U.S. Senator",
      divisionId: "ocd-division/country:us/state:nv",
      officialIndices: [0, 1],
    },
    {
      name: "U.S. Representative",
      divisionId: "ocd-division/country:us/state:nv/cd:3",
      officialIndices: [2],
    },
    {
      name: "Governor",
      divisionId: "ocd-division/country:us/state:nv",
      officialIndices: [3],
    },
    {
      name: "State Senator",
      divisionId: "ocd-division/country:us/state:nv/sldu:6",
      officialIndices: [4],
    },
  ],
  officials: [
    {
      name: "Catherine Cortez Masto",
      party: "Democratic Party",
      phones: ["(202) 224-3542"],
      urls: ["https://www.cortezmasto.senate.gov/"],
      photoUrl:
        "https://images.pexels.com/photos/6147369/pexels-photo-6147369.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      enhanced: {
        rating: 4.2,
        customDescription:
          "Catherine Cortez Masto has served as a U.S. Senator from Nevada since 2017. Prior to her Senate service, she was Nevada's Attorney General from 2007 to 2015.",
        resources: [
          { title: "Latest Newsletter", url: "#" },
          { title: "Voting Record", url: "#" },
        ],
      },
    },
    {
      name: "Jacky Rosen",
      party: "Democratic Party",
      phones: ["(202) 224-6244"],
      urls: ["https://www.rosen.senate.gov/"],
      photoUrl:
        "https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      enhanced: {
        rating: 3.8,
        customDescription:
          "Jacky Rosen has served as a U.S. Senator from Nevada since 2019. She previously represented Nevada's 3rd congressional district in the U.S. House of Representatives from 2017 to 2019.",
        resources: [
          { title: "Legislation Sponsored", url: "#" },
          { title: "Town Hall Schedule", url: "#" },
        ],
      },
    },
    {
      name: "Susie Lee",
      party: "Democratic Party",
      phones: ["(202) 225-3252"],
      urls: ["https://susielee.house.gov/"],
      photoUrl:
        "https://images.pexels.com/photos/5721869/pexels-photo-5721869.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    },
    {
      name: "Joe Lombardo",
      party: "Republican Party",
      phones: ["(775) 684-5670"],
      urls: ["https://gov.nv.gov/"],
      photoUrl:
        "https://images.pexels.com/photos/6274712/pexels-photo-6274712.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      enhanced: {
        rating: 3.5,
        customDescription:
          "Joe Lombardo is the 31st Governor of Nevada, taking office in January 2023. Prior to becoming governor, he served as the Sheriff of Clark County, Nevada.",
        resources: [
          { title: "Executive Orders", url: "#" },
          { title: "State Budget Proposal", url: "#" },
        ],
      },
    },
    {
      name: "Nicole Cannizzaro",
      party: "Democratic Party",
      phones: ["(775) 684-1475"],
      urls: ["https://www.leg.state.nv.us/"],
      photoUrl:
        "https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    },
  ],
};

// In a real application, this would call your backend API
export const searchRepresentatives = async (address) => {
  // Simulate API call
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // For demo purposes, we're using mock data
      // In production, this would make a real API call with the address
      resolve(MOCK_DATA);
    }, 1500);
  });
};

// For admin dashboard - would fetch enhanced data from your database
export const getEnhancedData = async (officialId) => {
  // Simulate API call to your database
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock enhanced data
      resolve({
        rating: 4.2,
        customDescription: "Custom description would be fetched from database",
        resources: [
          { title: "Resource 1", url: "#" },
          { title: "Resource 2", url: "#" },
        ],
      });
    }, 800);
  });
};

// For admin dashboard - would save enhanced data to your database
export const saveEnhancedData = async (officialId, data) => {
  // Simulate API call to save to your database
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saved enhanced data for official:", officialId, data);
      resolve();
    }, 800);
  });
};
