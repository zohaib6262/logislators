const fetchCoordinates = async (address) => {
  const apiKey = "c6a8704abd7a4e4ba77e763465ed3cfe";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();
  if (!data.results.length) throw new Error("Address not found");

  return {
    lat: data.results[0].geometry.lat,
    lng: data.results[0].geometry.lng,
  };
};
export default fetchCoordinates;
