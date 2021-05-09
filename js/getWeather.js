let apiKey = "6d46a8768e16465aa86a2f3f7ed580ea";
//let apiKey = "74d34a0c1ab44e63bb4421253aa0d519";
//let apiKey = "ea1e4961f13b437086fdbd3b558b19b4";
//let apiKey = "73121a72b406470f86b3b4a67b75cd1e";

let ipAddressUrl = "https://ipgeolocation.abstractapi.com/v1/?api_key=900470f4ca304fc09b194c1241f1f229";

//openweather apikey = "132dad34815cbc5fb599965c3d03b643"
/*call url
api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}
*/
$('#loaderModal').modal('show');

let currentUrl = "";
let forecastUrl = "";
let hourlyUrl = "";
let searchUrl = "";
let searchUrl2 = "";
let searchUrl3 = "";
let alertUrl = "";
let nearbyClick = false;
let lastLocation = "";
let lat = "";
let lon = "";
let tempUnit = "M";
let filterCountry = [];
let filterCity = [];

function countryToArray() {
	for (let i = 0; i < cities.length; i++) {
		if (!(filterCountry.includes(cities[i].country_full))) {
			filterCountry.push(cities[i].country_full);
		}
	}
	filterCountry.sort();
	filterCountry.shift();
}
countryToArray();

function loadCountrySelect() {
	let countrySelect = document.getElementById("countrySelect");
	for (let i = 0; i < filterCountry.length; i++) {
		let a = document.createElement("a");
		a.innerText = filterCountry[i];
		a.setAttribute("class","aCountry");
		a.addEventListener("click", function(){
			dropBtn.innerText = a.innerText;
			dropBtn.style.backgroundColor = "#2E8B57";
			dropBtn.click();
			displayCities();
			dropBtn2.innerText = "Select City";
			dropBtn2.style.backgroundColor = "#808080";
			dropBtn2.disabled = false;
			searchBtn.disabled = true;
		})
		countrySelect.append(a);
	}
}
loadCountrySelect();

let dropBtn = document.getElementById("dropBtn");
dropBtn.addEventListener("click", function(){
	toggleList("countrySelect");
});

let dropBtn2 = document.getElementById("dropBtn2");
dropBtn2.addEventListener("click", function(){
	toggleList("citySelect");
});
dropBtn2.disabled = true;

function toggleList(dropdown) {
	document.getElementById(dropdown).classList.toggle("show");
}

let countryInput = document.getElementById("countryInput");
countryInput.addEventListener("keyup", function(){
	filterFunction("countryInput", "countrySelect", "aCountry");
});

function filterFunction(cInput, cSelect, aa) {
	let input, filter, ul, li, a, i;
	input = document.getElementById(cInput);
	filter = input.value.toUpperCase();
	div = document.getElementById(cSelect);
	a = div.getElementsByClassName(aa);
	for (i = 0; i < a.length; i++) {
		txtValue = a[i].textContent || a[i].innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			a[i].style.display = "";
		} else {
			a[i].style.display = "none";
		}
	}
}

function displayCities() {
	filterCity = [];
	for (let i = 0; i < cities.length; i++) {
		if (cities[i].country_full === dropBtn.innerText) {
			filterCity.push(cities[i].city_name);
		}
	}
	filterCity.sort();
	let citySelect = document.getElementById("citySelect");
	citySelect.innerHTML = "";
	let createInput = document.createElement("input");
	createInput.setAttribute("type", "text");
	createInput.setAttribute("placeholder", "Search..");
	createInput.setAttribute("id", "cityInput");
	createInput.addEventListener("keyup", function(){
		filterFunction("cityInput", "citySelect", "aCity");
	});
	citySelect.append(createInput);
	for (let i = 0; i < filterCity.length; i++) {
		let a = document.createElement("a");
		a.innerText = filterCity[i];
		a.setAttribute("class","aCity");
		a.addEventListener("click", function(){
			dropBtn2.innerText = a.innerText;
			dropBtn2.style.backgroundColor = "#2E8B57";
			dropBtn2.click();
			searchBtn.disabled = false;
		})
		citySelect.append(a);
	}
}

document.getElementById("countryInput").value = "";

let searchInput = "";
let searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function(){
	lastLocation = "Search";
	nearbyClick = false;
	searchInput = document.getElementById("dropBtn2").innerText;
	$('#loaderModal').modal('show');
	searchCity();
	redoChart();
	dropBtn.innerText = "Select Country"
	dropBtn2.innerText = "Select City";
	dropBtn.style.backgroundColor = "#808080";
	dropBtn2.style.backgroundColor = "#D3D3D3";
	dropBtn2.disabled = true;
	searchBtn.disabled = true;
	$('#loaderModal').modal('toggle');
});
searchBtn.disabled = true;

function searchCity() {
	reassignUrl();
	alertUrl = `https://api.weatherapi.com/v1/forecast.json?key=52e3dbe7ba524c9ba6a92918213004&q=${searchInput}&alerts=yes`;
	getWeather(searchUrl);
	getForecast(searchUrl2);
	getHourly(searchUrl3);
	getAlert(alertUrl);
}

let changeUnit = document.getElementById("changeUnit");
changeUnit.addEventListener("click", function(){
	if (tempUnit == "M") {
		// Fahrenheit
		tempUnit = "I";
		changeUnit.innerHTML = "&deg;C";
	} else {
		// Celcius
		tempUnit = "M";
		changeUnit.innerHTML = "&deg;F";
	}

	if (lastLocation === "Current") {
		reassignUrl();
		getWeather(currentUrl);
		getForecast(forecastUrl);
		getHourly(hourlyUrl);
	} else if (lastLocation === "Search") {
		reassignUrl();
		getWeather(searchUrl);
		getForecast(searchUrl2);
		getHourly(searchUrl3);
	}
	nearbyClick = false;
	redoChart();
});

function getLatLon() {
	const data = getObject(ipAddressUrl);
	lastLocation = "Current";
	lat = data.latitude;
	lon = data.longitude;
	reassignUrl();
	alertUrl = `https://api.weatherapi.com/v1/forecast.json?key=52e3dbe7ba524c9ba6a92918213004&q=${lat},${lon}&alerts=yes`;
}
getLatLon();

let nearbyBtn = document.getElementById("nearbyCities");
nearbyBtn.addEventListener("click", function(){
	if (nearbyClick === false) {
		const data = getObject(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=8&appid=e4780dd703dbf2f6374acd7236063a8b`);
		let nearbyDiv = document.getElementById("nearbyDisplay");
		nearbyDiv.innerHTML = "";
		let previousAppend = [];
		nearbyClick = true;
		$('#loaderModal').modal('show');
		for (let i = 0; i < data.list.length; i++) {
			appendNearby(data, i, nearbyDiv, previousAppend);
		}
		$('#loaderModal').modal('toggle');
	}
})

function appendNearby(data, i, div, previousAppend) {
	let bitData = getObject(`https://api.weatherbit.io/v2.0/current?lat=${data.list[i].coord.lat}&lon=${data.list[i].coord.lon}&units=${tempUnit}&key=${apiKey}`);
	if (!(previousAppend.includes(bitData.data[0].city_name))) {
		if (!(bitData.data[0].city_name === document.getElementById("city").innerText)) {
			let row = document.createElement("div");
			let leftCol = document.createElement("div");
			let rightCol = document.createElement("div");
			let paraCity = document.createElement("h2");
			let paraDesc = document.createElement("p");
			let imgIcon = document.createElement("img");
			let paraTemp = document.createElement("h2");
			let line = document.createElement("hr");
			row.setAttribute("class","row");
			leftCol.setAttribute("class","col-sm-6 text-left");
			rightCol.setAttribute("class","col-sm-6 text-right");
			paraCity.setAttribute("class","font-weight-bold");
			paraCity.innerText = `${bitData.data[0].city_name}, ${bitData.data[0].country_code}`;
			paraDesc.setAttribute("class", "text-muted");
			paraDesc.innerText = bitData.data[0].weather.description;
			imgIcon.style.height = "50px";
			imgIcon.setAttribute("src",`https://www.weatherbit.io/static/img/icons/${bitData.data[0].weather.icon}.png`);
			if (tempUnit == "M") {
				paraTemp.innerHTML = Math.round(bitData.data[0].temp) + "&deg;C";
			} else if (tempUnit == "I") {
				paraTemp.innerHTML = Math.round(bitData.data[0].temp) + "&deg;F";
			}
			leftCol.append(paraCity);
			leftCol.append(paraDesc);
			rightCol.append(imgIcon);
			rightCol.append(paraTemp);
			row.append(leftCol);
			row.append(rightCol);
			div.append(row);
			div.append(line);
			previousAppend.push(bitData.data[0].city_name);
		}
	}
}

function reassignUrl() {
	if (lastLocation === "Current") {
		currentUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&units=${tempUnit}&key=${apiKey}`;
		forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&units=${tempUnit}&days=7&key=${apiKey}`;
		hourlyUrl = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${lat}&lon=${lon}&units=${tempUnit}&hours=25&key=${apiKey}`;
	} else if (lastLocation === "Search") {
		searchUrl = `https://api.weatherbit.io/v2.0/current?city=${searchInput}&units=${tempUnit}&key=${apiKey}`;
		searchUrl2 = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchInput}&units=${tempUnit}&days=7&key=${apiKey}`;
		searchUrl3 = `https://api.weatherbit.io/v2.0/forecast/hourly?city=${searchInput}&units=${tempUnit}&hours=25&key=${apiKey}`;
	}
}

let weatherSrc = "";
let currentTime = "";
let unformatTime = "";

function getWeather(url) {
	const data = getObject(url);
	lat = data.data[0].lat;
	lon = data.data[0].lon;
	setWeather(data);
}
getWeather(currentUrl);

function setWeather(data) {
	weatherSrc = `https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png`;
	currentTime = formatTitleTime(convertTimezone(new Date(), data.data[0].timezone));
	unformatTime = convertTimezone(new Date(), data.data[0].timezone);
	document.getElementById("city").innerText = data.data[0].city_name;
	document.getElementById("timeDateTitle").innerText = convertTimezone(new Date(), data.data[0].timezone).toDateString() + " " + currentTime;
	document.getElementById("temp").innerText = Math.round(data.data[0].temp);
	document.getElementById("desc").innerText = data.data[0].weather.description;
	document.getElementById("weatherIcon").setAttribute("src", weatherSrc);
	document.getElementById("humid").innerText = Math.round(data.data[0].rh) + "%";
	document.getElementById("windDir").innerText = data.data[0].wind_cdir;

	if (data.data[0].wind_cdir === "N") {
		document.getElementById("windDirIcon").innerHTML = "&#129047;";
	} else if (data.data[0].wind_cdir === "NNE") {
		document.getElementById("windDirIcon").innerHTML = '&#11019;';
	} else if (data.data[0].wind_cdir === "NE") {
		document.getElementById("windDirIcon").innerHTML = "&#11019;"
	} else if (data.data[0].wind_cdir === "NNW") {
		document.getElementById("windDirIcon").innerHTML = "&#11018;"
	} else if (data.data[0].wind_cdir === "NW") {
		document.getElementById("windDirIcon").innerHTML = "&#11018;" // End of NORTH
	} else if (data.data[0].wind_cdir === "E") {
		document.getElementById("windDirIcon").innerHTML = "&#129044;"
	} else if (data.data[0].wind_cdir === "ENE") {
		document.getElementById("windDirIcon").innerHTML = "&#11019;"
	} else if (data.data[0].wind_cdir === "ESE") {
		document.getElementById("windDirIcon").innerHTML = "&#11017;" // End of East
	} else if (data.data[0].wind_cdir === "S") {
		document.getElementById("windDirIcon").innerHTML = "&#129045;"
	} else if (data.data[0].wind_cdir === "SSE") {
		document.getElementById("windDirIcon").innerHTML = "&#11017;" 
	} else if (data.data[0].wind_cdir === "SE") {
		document.getElementById("windDirIcon").innerHTML = "&#11017;"
	} else if (data.data[0].wind_cdir === "SSW") {
		document.getElementById("windDirIcon").innerHTML = "&#11016;;"
	} else if (data.data[0].wind_cdir === "SW") {
		document.getElementById("windDirIcon").innerHTML = "&#11016;" // End of SOUTH
	} else if (data.data[0].wind_cdir === "W") {
		document.getElementById("windDirIcon").innerHTML = "&#129046;"
	} else if (data.data[0].wind_cdir === "WNW") {
		document.getElementById("windDirIcon").innerHTML = "&#11018;"
	} else if (data.data[0].wind_cdir === "WSW") {
		document.getElementById("windDirIcon").innerHTML = "&#11016;" // End of WEST
	} 

	document.getElementById("uvLevel").innerText = Math.round(data.data[0].uv);
	//document.getElementById("airQuality").innerText = data.data[0].aqi;
	//console.log(data.data[0].weather.code);

	if (data.data[0].aqi <= 50) {
		document.getElementById("airQuality").innerText = data.data[0].aqi;
		//document.getElementById("airQuality").style.color = "green";
		document.getElementById("pollBody").style.backgroundColor = "green"
		document.getElementById("airQualityCond").innerText = "Air quality is satisfactory, and air pollution poses little or no risk.";
	} else if (data.data[0].aqi > 51 && data.data[0].aqi <= 100) {
		document.getElementById("airQuality").innerText = data.data[0].aqi;
		//document.getElementById("airQuality").style.color = "rgb(201, 204, 0)";
		document.getElementById("pollBody").style.backgroundColor = "rgb(201, 204, 0)"
		document.getElementById("airQualityCond").innerText = "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.";
	} else if (data.data[0].aqi > 101 && data.data[0].aqi <= 150) {
		document.getElementById("airQuality").innerText = data.data[0].aqi;
		//document.getElementById("airQuality").style.color = "orange";
		document.getElementById("pollBody").style.backgroundColor = "orange"
		document.getElementById("airQualityCond").innerText = "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
	} else if (data.data[0].aqi > 151 && data.data[0].aqi <= 200) {
		document.getElementById("airQuality").innerText = data.data[0].aqi;
		//document.getElementById("airQuality").style.color = "red";
		document.getElementById("pollBody").style.backgroundColor = "red"
		document.getElementById("airQualityCond").innerText = "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.";
	} else if (data.data[0].aqi > 201 && data.data[0].aqi <= 300) {
		document.getElementById("airQuality").innerText = data.data[0].aqi;
		//document.getElementById("airQuality").style.color = "purple";
		document.getElementById("pollBody").style.backgroundColor = "purple"
		document.getElementById("airQualityCond").innerText = "Health alert: The risk of health effects is increased for everyone.";
	} else if (data.data[0].aqi > 301) {
		document.getElementById("airQuality").innerText = data.data[0].aqi;
		//document.getElementById("airQuality").style.color = "maroon";
		document.getElementById("pollBody").style.backgroundColor = "maroon"
		document.getElementById("airQualityCond").innerText = "Health warning of emergency conditions: everyone is more likely to be affected.";
	}

	if (data.data[0].uv <= 2) {
		document.getElementById("uv-desc").innerText = "There is a low danger from the sun's UV rays for the average healthy person.";
		document.getElementById("uv-adv").innerText = "No protection needed. You can safely stay outside using minimal sun protection.";
	} else if (data.data[0].uv > 2 && data.data[0].uv <= 5) {
		document.getElementById("uv-desc").innerText = "There is a moderate risk of harm from unprotected sun exposure.";
		document.getElementById("uv-adv").innerText = "Protection needed. Seek shade during late morning through mid-afternoon. When outside, generously apply broad-spectrum SPF-15 or higher sunscreen on exposed skin, and wear protective clothing, a wide-brimmed hat, and sunglasses.";
	} else if (data.data[0].uv > 5 && data.data[0].uv <= 7) {
		document.getElementById("uv-desc").innerText = "There is a high risk of harm from unprotected sun exposure.";
		document.getElementById("uv-adv").innerText = "Protection needed. Seek shade during late morning through mid-afternoon. When outside, generously apply broad-spectrum SPF-15 or higher sunscreen on exposed skin, and wear protective clothing, a wide-brimmed hat, and sunglasses.";
	} else if (data.data[0].uv > 7 && data.data[0].uv <= 10) {
		document.getElementById("uv-desc").innerText = "There is a very high risk of harm from unprotected sun exposure.";
		document.getElementById("uv-adv").innerText = "Extra protection needed. Be careful outside, especially during late morning through mid-afternoon. If your shadow is shorter than you, seek shade and wear protective clothing, a wide-brimmed hat, and sunglasses, and generously apply a minimum of  SPF-15, broad-spectrum sunscreen on exposed skin.";
	} else if (data.data[0].uv > 10) {
		document.getElementById("uv-desc").innerText = "There is an extreme risk of harm from unprotected sun exposure.";
		document.getElementById("uv-adv").innerText = "Extra protection needed. Be careful outside, especially during late morning through mid-afternoon. If your shadow is shorter than you, seek shade and wear protective clothing, a wide-brimmed hat, and sunglasses, and generously apply a minimum of  SPF-15, broad-spectrum sunscreen on exposed skin.";
	}
	//let probarWidth = (data.data[0].uv / 12) * 100 + "%";
	//document.getElementsByClassName("pro-bar")[0].style.width = probarWidth;
	setWeatherUnit(data);
}

function setWeatherUnit(data) {
	if (tempUnit == "M") {
		for (let i = 0; i < 13; i++) {
			document.getElementsByClassName("tempUnit")[i].innerText = "C";
		}
		document.getElementById("precipTitle").innerText = "Precipitation (mm)";
		document.getElementById("windSpeed").innerText = data.data[0].wind_spd.toFixed(1) + " m/s";
		document.getElementById("visibility").innerText = data.data[0].vis + " km";
	} else {
		for (let i = 0; i < 13; i++) {
			document.getElementsByClassName("tempUnit")[i].innerText = "F";
		}
		document.getElementById("precipTitle").innerText = "Precipitation (in)";
		document.getElementById("windSpeed").innerText = data.data[0].wind_spd.toFixed(1) + " mph";
		document.getElementById("visibility").innerText = data.data[0].vis + " m";
	}
}


function convertTimezone(date, timezone) {
	return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: timezone}));   
}

let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function getForecast(url) {
	const data = getObject(url);
	for (let i = 0; i < 6; i++) {
		let date = new Date(data.data[i+1].datetime);
		let dd = date.getDate();
		let mm = date.getMonth() + 1;
		let day = days[date.getDay()];
		document.getElementsByClassName("date")[i].innerText = dd + '/' + mm;
		document.getElementsByClassName("dayTitle")[i].innerText = day;
		document.getElementsByClassName("imgFc")[i].setAttribute("src", `https://www.weatherbit.io/static/img/icons/${data.data[i+1].weather.icon}.png`);
		document.getElementsByClassName("tempForecast")[i].innerText = Math.round(data.data[i+1].temp);
	}
}
getForecast(forecastUrl);

function getHourly(url) {
	const data = getObject(url);
	let j = 1;
	document.getElementsByClassName("hourlyTime")[0].innerText = "Now";
	document.getElementsByClassName("hourDayTitle")[0].innerText = currentTime;
	document.getElementsByClassName("imgHr")[0].setAttribute("src", weatherSrc);
	document.getElementsByClassName("tempHour")[0].innerText = document.getElementById("temp").innerText;
	for (let i = 4; i <= 20; i += 4) {
		let date = new Date(data.data[i].timestamp_local);
		let day = days[date.getDay()];
		let today = days[new Date().getDay()];
		if (day === today) {
			day = "Today";
		} else {
			day = "Tomorrow"
		}
		document.getElementsByClassName("hourlyTime")[j].innerText = formatHour(date);
		document.getElementsByClassName("hourDayTitle")[j].innerText = day;
		document.getElementsByClassName("imgHr")[j].setAttribute("src", `https://www.weatherbit.io/static/img/icons/${data.data[i].weather.icon}.png`);
		document.getElementsByClassName("tempHour")[j].innerText = Math.round(data.data[i].temp);
		j++;
	}
}
getHourly(hourlyUrl);

function formatTitleTime(date) {
	let hour = date.getHours();
	let minutes = date.getMinutes();
	let amPm = hour >= 12 ? 'pm' : 'am';
	hour = hour % 12;
	hour = hour ? hour : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	let time = hour + ':' + minutes + ' ' + amPm;
	return time;
}

function formatHour(date) {
	let hour = date.getHours();
	let amPm = hour >= 12 ? 'pm' : 'am';
	hour = hour % 12;
	hour = hour ? hour : 12; // the hour '0' should be '12'
	let time = hour + " " + amPm;
	return time;
}

document.addEventListener("DOMContentLoaded", function(){
    $('#loaderModal').modal('toggle')
});

function getAlert(url) {
	try {
		const data = getObject(url);
		if (data.alerts.alert.length === 0) {
			clearAlert();
		}else {
			setAlert(data);
		}
	} catch(e) {
		clearAlert();
		console.log(`${e.name}, ${e.message}`);
	}
	
}
getAlert(alertUrl);

function clearAlert() {
	document.getElementById("alertSevere").innerText = "";
	document.getElementById("alertUrgent").innerText = "";
	document.getElementById("alertArea").innerText = "";
	document.getElementById("alertDesc").innerText = "";
	document.getElementById("alertInst").innerText = "";
	document.getElementById("effectiveTime").innerText = "";
	document.getElementById("expireTime").innerText = "";
	document.getElementById("alertHead").innerText = "No weather alert for current location";
	document.getElementById("weatherAlert").style.backgroundColor = null;
}

function setAlert(data) {
	document.getElementById("alertHead").innerText = data.alerts.alert[0].headline;
	document.getElementById("alertSevere").innerText = "Severity: " + data.alerts.alert[0].severity;
	document.getElementById("alertUrgent").innerText = "Urgency: " + data.alerts.alert[0].urgency;
	document.getElementById("alertArea").innerText = "Affected Area: " + data.alerts.alert[0].areas;
	document.getElementById("alertDesc").innerText = data.alerts.alert[0].desc;
	document.getElementById("alertInst").innerText = data.alerts.alert[0].instruction;
	document.getElementById("effectiveTime").innerText = "Effective Time: " + data.alerts.alert[0].effective;
	document.getElementById("expireTime").innerText = "Expire Time: " + data.alerts.alert[0].expires;
	document.getElementById("weatherAlert").style.backgroundColor = "#F0E68C";
}

function getObject(url){
	let HttpRequest = new XMLHttpRequest();
	HttpRequest.open("GET", url, false);
	HttpRequest.send(null);
	return JSON.parse(HttpRequest.responseText);          
}


/*
function backgroundColorChange(weather_code){
	if(weather_code >= 200 && weather_code <= 233){//thunder

	} else if(weather_code >= 300 && weather_code <= 302){//drizzle

	} else if (weather_code >= 500 && weather_code <= 522) {//rain

	} else if(weather_code >= 700 & weather_code <= 751){ // fog/smoke/haze

	}
}*/