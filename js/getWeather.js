// pressure,uv level, visibility uncomment if available

let apiKey = "6d46a8768e16465aa86a2f3f7ed580ea";
let ipAddressUrl = "https://ipgeolocation.abstractapi.com/v1/?api_key=900470f4ca304fc09b194c1241f1f229";

// API Urls
let currentUrl = "";
let forecastUrl = "";
let hourlyUrl = "";
let searchUrl = "";
let searchUrl2 = "";
let searchUrl3 = "";

let lastLocation = "";

// default unit
let tempUnit = "M";
//clear search bar
document.getElementById("locationSearch").value = "";

let searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function(){
	let searchInput = document.getElementById("locationSearch").value;
	
	let index = searchInput.indexOf(",");
	searchInput = searchInput.slice(0,index);
	lastLocation = "Search";

	searchUrl = `https://api.weatherbit.io/v2.0/current?city=${searchInput}&units=${tempUnit}&key=${apiKey}`;
	searchUrl2 = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchInput}&units=${tempUnit}&days=7&key=${apiKey}`;
	searchUrl3 = `https://api.weatherbit.io/v2.0/forecast/hourly?city=${searchInput}&units=${tempUnit}&hours=25&key=${apiKey}`;
	
	getWeather(searchUrl);
	getForecast(searchUrl2);
	getHourly(searchUrl3);
	
});
/*
let currentLoc = document.getElementById("currentLoc");
currentLoc.addEventListener("click", function(){
	const data = getObject(ipAddressUrl);
	currentUrl = `https://api.weatherbit.io/v2.0/current?lat=${data.latitude}&lon=${data.longitude}&units=${tempUnit}&key=${apiKey}`;
	forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${data.latitude}&lon=${data.longitude}&units=${tempUnit}&days=7&key=${apiKey}`;

	getWeather(currentUrl);
	getForecast(forecastUrl);
	getHourly(hourlyUrl);
});
*/

let changeUnit = document.getElementById("changeUnit");
changeUnit.addEventListener("click", function(){
	if (tempUnit == "M") {
		// Fahrenheit
		tempUnit = "I";
	} else {
		// Celcius
		tempUnit = "M";
	}
	if (lastLocation === "Current") {
		getLatLon();
		getWeather(currentUrl);
		getForecast(forecastUrl);
		getHourly(hourlyUrl);
	} else if (lastLocation === "Search") {
		let searchInput = document.getElementById("locationSearch").value;
		let index = searchInput.indexOf(",");
		searchInput = searchInput.slice(0,index);
		searchUrl = `https://api.weatherbit.io/v2.0/current?city=${searchInput}&units=${tempUnit}&key=${apiKey}`;
		searchUrl2 = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchInput}&units=${tempUnit}&days=7&key=${apiKey}`;
		searchUrl3 = `https://api.weatherbit.io/v2.0/forecast/hourly?city=${searchInput}&units=${tempUnit}&hours=25&key=${apiKey}`;
		getWeather(searchUrl);
		getForecast(searchUrl2);
		getHourly(searchUrl3);
	}
});

function getLatLon() {
	const data = getObject(ipAddressUrl);
	lastLocation = "Current";
	currentUrl = `https://api.weatherbit.io/v2.0/current?lat=${data.latitude}&lon=${data.longitude}&units=${tempUnit}&key=${apiKey}`;
	forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${data.latitude}&lon=${data.longitude}&units=${tempUnit}&days=7&key=${apiKey}`;
	hourlyUrl = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${data.latitude}&lon=${data.longitude}&units=${tempUnit}&hours=25&key=${apiKey}`;
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
	document.getElementById("timeDateTitle").innerText = convertTimezone(new Date(), data.data[0].timezone).toDateString() + " " + formatTitleTime(convertTimezone(new Date(), data.data[0].timezone));
	document.getElementById("temp").innerText = Math.round(data.data[0].temp);
	document.getElementById("desc").innerText = data.data[0].weather.description;
	document.getElementById("weatherIcon").setAttribute("src", weatherSrc);
	document.getElementById("humid").innerText = Math.round(data.data[0].rh) + "%";
	document.getElementById("pressure").innerText = data.data[0].pres + " mb";
	document.getElementById("windDir").innerText = data.data[0].wind_cdir_full.charAt(0).toUpperCase();
	document.getElementById("uvLevel").innerText = Math.round(data.data[0].uv);
	document.getElementById("airQuality").innerText = data.data[0].aqi;
	if (data.data[0].uv <= 2) {
		document.getElementById("uv-desc").innerText = "There is a low danger from the sun's UV rays for the average healthy person.";
	} else if (data.data[0].uv > 2 && data.data[0].uv <= 5) {
		document.getElementById("uv-desc").innerText = "There is a moderate risk of harm from unprotected sun exposure.";
	} else if (data.data[0].uv > 5 && data.data[0].uv <= 7) {
		document.getElementById("uv-desc").innerText = "There is a high risk of harm from unprotected sun exposure.";
	} else if (data.data[0].uv > 7 && data.data[0].uv <= 10) {
		document.getElementById("uv-desc").innerText = "There is a very risk of harm from unprotected sun exposure.";
	} else if (data.data[0].uv > 10) {
		document.getElementById("uv-desc").innerText = "There is an extreme risk of harm from unprotected sun exposure.";
	}
	let probarWidth = (data.data[0].uv / 12) * 100 + "%";
	document.getElementsByClassName("pro-bar")[0].style.width = probarWidth;
	setWeatherUnit(data);
}

function setWeatherUnit(data) {
	if (tempUnit == "M") {
		for (let i = 0; i < 13; i++) {
			document.getElementsByClassName("tempUnit")[i].innerText = "C";
		}
		document.getElementById("precip").innerText = data.data[0].precip.toFixed(1) + " mm";
		document.getElementById("windSpeed").innerText = data.data[0].wind_spd.toFixed(1) + " m/s";
		document.getElementById("visibility").innerText = data.data[0].vis + " km";
	} else {
		for (let i = 0; i < 13; i++) {
			document.getElementsByClassName("tempUnit")[i].innerText = "F";
		}
		document.getElementById("precip").innerText = data.data[0].precip.toFixed(1) + " in";
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
	let j = 0;
	for (let i = 4; i <= 24; i += 4) {
		let date = new Date(data.data[i].timestamp_local);
		let day = days[date.getDay()];
		let today = days[new Date().getDay()];
		if (day === today) {
			day = "Today";
		} else {
			day = "Tomorrow"
		}
		document.getElementsByClassName("hourlyTime")[j].innerText = formatHour(date);;
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

window.onerror = function() {
	alert("Please enter a valid city name");
	return true;
}

function getObject(url){
	let HttpRequest = new XMLHttpRequest();
	HttpRequest.open("GET", url, false);
	HttpRequest.send(null);
	return JSON.parse(HttpRequest.responseText);          
}