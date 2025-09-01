import BASE_URL, { API_KEY_COOR } from "@/lib/utils";
import { useState } from "react";

const useLegislators = () => {
  const [coords, setCoords] = useState(null);
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoordinates = async (address) => {
    const apiKey = "c6a8704abd7a4e4ba77e763465ed3cfe";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      address
    )}&key=${API_KEY_COOR}`;

    const response = await fetch(url);
    const data = await response.json();
    if (!data.results.length) setError("Address not found!");

    return {
      lat: data.results[0].geometry.lat,
      lng: data.results[0].geometry.lng,
    };
  };

  const fetchPeoplePage = async (lat, lng, page = 1, per_page = 10) => {
    const url = `https://v3.openstates.org/people.geo?lat=${lat}&lng=${lng}&apikey=39137ffb-f88f-4430-9854-f1c682821d87&page=${page}&per_page=${per_page}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const fetchAllPeople = async (lat, lng) => {
    const per_page = 10;
    let page = 1;
    let allPeople = [];
    let max_page = 1;

    do {
      const data = await fetchPeoplePage(lat, lng, page, per_page);
      allPeople = allPeople.concat(data.results || []);
      max_page = data.pagination?.max_page || 1;
      page++;
    } while (page <= max_page);

    return allPeople;
  };

  const searchByAddress = async (address) => {
    setIsLoading(true);
    setError(null);
    setPeople([]);

    try {
      const { lat, lng } = await fetchCoordinates(address);
      setCoords({ lat, lng });

      const fetchedPeople = await fetchAllPeople(lat, lng);

      // Save only new reps to DB
      if (fetchedPeople) {
        const response = await fetch(`${BASE_URL}/representatives`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fetchedPeople),
        });
      }

      const fetchedIds = fetchedPeople.map((p) => p.id);

      // Fetch only those saved/matched reps by their IDs
      const response = await fetch(`${BASE_URL}/representatives/by-ids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: fetchedIds }),
      });

      const savedPeople = await response.json();
      setPeople(savedPeople);
    } catch (err) {
      setError({
        statusCode: 500 || err.response?.status,
        message: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    coords,
    people,
    isLoading,
    setIsLoading,
    error,
    searchByAddress,
    refetch: searchByAddress,
  };
};

export default useLegislators;
