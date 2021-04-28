// pressure,uv level, visibility uncomment if available

let apiKey = "6d46a8768e16465aa86a2f3f7ed580ea";
let ipAddressUrl = "https://ipgeolocation.abstractapi.com/v1/?api_key=900470f4ca304fc09b194c1241f1f229";

let currentUrl = "";
let forecastUrl = "";

// default unit
let tempUnit = "M";

// clear search value
document.getElementById("searchInput").value = "";

let searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function(){
	let searchInput = document.getElementById("searchInput").value;

	let searchUrl = `https://api.weatherbit.io/v2.0/current?city=${searchInput}&units=${tempUnit}&key=${apiKey}`;
	let searchUrl2 = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchInput}&units=${tempUnit}&days=7&key=${apiKey}`;
	
	getWeather(searchUrl);
	getForecast(searchUrl2);
});

let currentLoc = document.getElementById("currentLoc");
currentLoc.addEventListener("click", function(){
	const data = getObject(ipAddressUrl);
	currentUrl = `https://api.weatherbit.io/v2.0/current?lat=${data.latitude}&lon=${data.longitude}&units=${tempUnit}&key=${apiKey}`;
	forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${data.latitude}&lon=${data.longitude}&units=${tempUnit}&days=7&key=${apiKey}`;

	getWeather(currentUrl);
	getForecast(forecastUrl);
});

let changeUnit = document.getElementById("changeUnit");
changeUnit.addEventListener("click", function(){
	if (tempUnit == "M") {
		// Fahrenheit
		tempUnit = "I";
		changeUnit.innerText = "Change to Metric";
	} else {
		// Celcius
		tempUnit = "M";
		changeUnit.innerText = "Change to Fahrenheit";
	}
});

function getLatLon() {
	const data = getObject(ipAddressUrl);
	currentUrl = `https://api.weatherbit.io/v2.0/current?lat=${data.latitude}&lon=${data.longitude}&units=${tempUnit}&key=${apiKey}`;
	forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${data.latitude}&lon=${data.longitude}&units=${tempUnit}&days=7&key=${apiKey}`;
}
getLatLon();

function getWeather(url) {
	const data = getObject(url);
	setWeather(data);
}
getWeather(currentUrl);

function setWeather(data) {
	let weatherSrc = `https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png`;
	document.getElementById("city").innerText = data.data[0].city_name;
	document.getElementById("temp").innerText = Math.round(data.data[0].temp);
	document.getElementById("desc").innerText = data.data[0].weather.description;
	document.getElementById("weatherIcon").setAttribute("src", weatherSrc);
	document.getElementById("humid").innerText = Math.round(data.data[0].rh) + "%";
	//document.getElementById("pressure").innerText = data.data[0].pres + " mb";
	document.getElementById("windDir").innerText = data.data[0].wind_cdir_full.charAt(0).toUpperCase();
	//document.getElementById("uvLevel").innerText = Math.round(data.data[0].uv);
	document.getElementById("airQuality").innerText = data.data[0].aqi;
	setWeatherUnit(data);
}

function setWeatherUnit(data) {
	if (tempUnit == "M") {
		for (let i = 0; i < 7; i++) {
			document.getElementsByClassName("tempUnit")[i].innerText = "C";
		}
		document.getElementById("precip").innerText = data.data[0].precip.toFixed(1) + " mm";
		document.getElementById("windSpeed").innerText = data.data[0].wind_spd.toFixed(1) + " m/s";
		//document.getElementById("visibility").innerText = data.data[0].vis + " km";
	} else {
		for (let i = 0; i < 7; i++) {
			document.getElementsByClassName("tempUnit")[i].innerText = "F";
		}
		document.getElementById("precip").innerText = data.data[0].precip.toFixed(1) + " in";
		document.getElementById("windSpeed").innerText = data.data[0].wind_spd.toFixed(1) + " mph";
		//document.getElementById("visibility").innerText = data.data[0].vis + " m";
	}
}

function getForecast(url) {
	const data = getObject(url);
	let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
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

function getObject(url){
	let HttpRequest = new XMLHttpRequest();
	HttpRequest.open("GET", url, false);
	HttpRequest.send(null);
	return JSON.parse(HttpRequest.responseText);          
}