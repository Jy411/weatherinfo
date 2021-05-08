//let apiKey = "6d46a8768e16465aa86a2f3f7ed580ea";
//let apiKey = "74d34a0c1ab44e63bb4421253aa0d519";
//let apiKey = "ea1e4961f13b437086fdbd3b558b19b4";
let apiKey = "73121a72b406470f86b3b4a67b75cd1e";

let ipAddressUrl = "https://ipgeolocation.abstractapi.com/v1/?api_key=900470f4ca304fc09b194c1241f1f229";

//openweather apikey = "132dad34815cbc5fb599965c3d03b643"
/*call url
api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}
*/

// API Urls
let currentUrl = "";
let forecastUrl = "";
let hourlyUrl = "";
let searchUrl = "";
let searchUrl2 = "";
let searchUrl3 = "";
let alertUrl = "";

let lastLocation = "";
let lat = "";
let lon = "";

// default unit
let tempUnit = "M";
//clear search bar
document.getElementById("locationSearch").value = "";

let searchInput = "";
let searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function(){
	lastLocation = "Search";
	searchInput = document.getElementById("locationSearch").value;
	let index = searchInput.indexOf(",");
	try {
		searchInput = searchInput.slice(0,index);
		searchCity();
	} catch(e) {
		searchInput = document.getElementById("locationSearch").value;
		let searchArr = searchInput.split(",");
		searchInput = searchArr[searchArr.length - 1];
		searchCity();
		console.log(`(${e.name}) ${e.message}`);
	}
	
});

function searchCity() {
	reassignUrl();
	alertUrl = `https://api.weatherapi.com/v1/forecast.json?key=52e3dbe7ba524c9ba6a92918213004&q=${searchInput}&alerts=yes`;
	tryApiKey(getWeather(searchUrl));
	tryApiKey(getForecast(searchUrl2));
	tryApiKey(getHourly(searchUrl3));
	getAlert(alertUrl);
}

function tryApiKey(execFunc) {
	try {
		reassignUrl();
		execFunc;
	} catch {
		try {
			apiKey = "6d46a8768e16465aa86a2f3f7ed580ea";
			reassignUrl();
			execFunc;
		} catch {
			try {
				apiKey = "74d34a0c1ab44e63bb4421253aa0d519";
				reassignUrl();
				execFunc;
			} catch {
				try {
					apiKey = "ea1e4961f13b437086fdbd3b558b19b4";
					reassignUrl();
					execFunc;
				} catch(e) {
					console.log(`(${e.name}) ${e.message}`);
				}
			}
		}
	}
}

/*
let currentLoc = document.getElementById("currentLoc");
currentLoc.addEventListener("click", function(){


	const data = getObject(ipAddressUrl);
	currentUrl = `https://api.weatherbit.io/v2.0/current?lat=${data.latitude}&lon=${data.longitude}&units=${tempUnit}&key=${apiKey}`;
	forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${data.latitude}&lon=${data.longitude}&units=${tempUnit}&days=7&key=${apiKey}`;

	getWeather(currentUrl);
	getForecast(forecastUrl);
	getHourly(hourlyUrl);
});*/


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
		tryApiKey(getWeather(currentUrl));
		tryApiKey(getForecast(forecastUrl));
		tryApiKey(getHourly(hourlyUrl));
	} else if (lastLocation === "Search") {
		reassignUrl();
		tryApiKey(getWeather(searchUrl));
		tryApiKey(getForecast(searchUrl2));
		tryApiKey(getHourly(searchUrl3));
	}
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

function getWeather(url) {
	const data = getObject(url);
	setWeather(data);
}
tryApiKey(getWeather(currentUrl));

function setWeather(data) {
	weatherSrc = `https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png`;
	currentTime = formatTitleTime(convertTimezone(new Date(), data.data[0].timezone));
	document.getElementById("city").innerText = data.data[0].city_name;
	document.getElementById("timeDateTitle").innerText = convertTimezone(new Date(), data.data[0].timezone).toDateString() + " " + currentTime;
	document.getElementById("temp").innerText = Math.round(data.data[0].temp);
	document.getElementById("desc").innerText = data.data[0].weather.description;
	document.getElementById("weatherIcon").setAttribute("src", weatherSrc);
	document.getElementById("humid").innerText = Math.round(data.data[0].rh) + "%";
	document.getElementById("pressure").innerText = data.data[0].pres + " mb";
	document.getElementById("windDir").innerText = data.data[0].wind_cdir_full.charAt(0).toUpperCase();

	if (data.data[0].wind_cdir_full.charAt(0).toUpperCase() === "N") {
		document.getElementById("windDirIcon").innerHTML = "test";
	} else if (data.data[0].wind_cdir_full.charAt(0).toUpperCase() === "S") {
		document.getElementById("windDirIcon").innerHTML = '<i class="fas fa-arrow-down fa-2x"></i>';
	} else if (data.data[0].wind_cdir_full.charAt(0).toUpperCase() === "E") {
		document.getElementById("windDirIcon").innerHTML = "s"
	} else if (data.data[0].wind_cdir_full.charAt(0).toUpperCase() === "W") {
		document.getElementById("windDirIcon").innerHTML = "a"
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
	} else if (data.data[0].uv > 2 && data.data[0].uv <= 5) {
		document.getElementById("uv-desc").innerText = "There is a moderate risk of harm from unprotected sun exposure.";
	} else if (data.data[0].uv > 5 && data.data[0].uv <= 7) {
		document.getElementById("uv-desc").innerText = "There is a high risk of harm from unprotected sun exposure.";
	} else if (data.data[0].uv > 7 && data.data[0].uv <= 10) {
		document.getElementById("uv-desc").innerText = "There is a very risk of harm from unprotected sun exposure.";
	} else if (data.data[0].uv > 10) {
		document.getElementById("uv-desc").innerText = "There is an extreme risk of harm from unprotected sun exposure.";
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
tryApiKey(getForecast(forecastUrl));

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
tryApiKey(getHourly(hourlyUrl));

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
/*
window.onerror = function() {
	alert("Please enter a valid city name");
	return true;
}
*/
function getAlert(url) {
	const data = getObject(url);
	if (data.alerts.alert.length === 0) {
		document.getElementById("alertSevere").innerText = "";
		document.getElementById("alertUrgent").innerText = "";
		document.getElementById("alertArea").innerText = "";
		document.getElementById("alertDesc").innerText = "";
		document.getElementById("alertInst").innerText = "";
		document.getElementById("effectiveTime").innerText = "";
		document.getElementById("expireTime").innerText = "";
		document.getElementById("alertHead").innerText = "No weather alert for current location";
		document.getElementById("weatherAlert").style.backgroundColor = null;
	}else {
		setAlert(data);
	}
}
getAlert(alertUrl);

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