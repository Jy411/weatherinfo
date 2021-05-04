function initSearch() {
  const input = document.getElementById("locationSearch");
  const searchBtn = document.getElementById("searchBtn");
  const options = {
    types: ["(cities)"]
  };
  const autocomplete = new google.maps.places.Autocomplete(input, options);
  input.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      searchBtn.click();
    }
  })
}

