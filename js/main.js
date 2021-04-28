// fetch auto suggested locations
const locationSearchInputEl = document.getElementById("locationSearch");

const API_KEY = "AIzaSyBJpM_WCkXC5L-2X1xBA6D4wpaHvJVS1fw";
const GOOGLE_API_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?" + API_KEY;
const getLocationSuggestions = (locationInput) => {
  fetch(GOOGLE_API_URL + "&location=" + locationInput, {
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  })
      .then(response => response.json())
      .then(data => console.log(data));
}

locationSearchInputEl.oninput = (data) => getLocationSuggestions(data.target.value);
