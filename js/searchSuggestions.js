function initSearch() {
  const input = document.getElementById("locationSearch");
  const searchBtn = document.getElementById("searchBtn");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.setOptions({
    types: ["cities"],
  })
  input.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      searchBtn.click();
    }
  })
}

