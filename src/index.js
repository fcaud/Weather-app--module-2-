// pull the units from the API as opposed to manual conversion in the code  -get rounding diff between manual and api
// coniditonal formatting based on temp or weather
// change logo
// extra stats data
// forecast data
// set-up the placeholder module to change to content on search
// set-up add module

function getTemps(ID, response) {
  let currentTemp = Math.round(response.data.main.temp);
  let cityName = response.data.name;
  let windSpeed = Math.round(response.data.wind.speed);
  let humidity = Math.round(response.data.main.humidity);
  let weatherDescription = response.data.weather[0].main;

  let cityHeader = document.querySelector(`#${ID} h2`);
  let headerCurrentTemp = document.querySelector(`#${ID} .temp-num`);
  let windSpeedText = document.querySelector(`#${ID} .p-wind span`);
  let humidityText = document.querySelector(`#${ID} .p-humidity span`);

  cityHeader.innerHTML = cityName;
  headerCurrentTemp.innerHTML = currentTemp;
  windSpeedText.innerHTML = windSpeed;
  humidityText.innerHTML = humidity;
}

function citySearch(event) {
  event.preventDefault();
  let targetCityButton = event.target;
  let section = targetCityButton.closest("section");
  let sectionID = section.id;

  let citySearched = document
    .querySelector(`#${sectionID} .city-search-bar`)
    .value.trim()
    .toLowerCase();

  let unitToggle = document.querySelector(`#${sectionID} .unit-toggle`);

  let weatherApiKey = `a853abb2375faaf0d512fcc19dee1229`;

  let unit = `metric`;

  if (unitToggle.checked) {
    unit = `imperial`;
  } else {
    unit = `metric`;
  }
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearched}&appid=${weatherApiKey}&units=${unit}`;

  if (citySearched) {
    axios.get(weatherApiUrl).then(function (response) {
      getTemps(sectionID, response);
    });
  }
}

let searchCity = document.querySelectorAll(".search-bar");
searchCity.forEach(function (item) {
  item.addEventListener("submit", citySearch);
});

function searchCurrentLocation(position, clickEvent) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  clickEvent.preventDefault();
  let targetLocationButton = clickEvent.target;
  let section = targetLocationButton.closest("section");
  let sectionID = section.id;

  let unitToggle = document.querySelector(`#${sectionID} .unit-toggle`);

  let weatherApiKey = `a853abb2375faaf0d512fcc19dee1229`;

  let unit = `metric`;

  if (unitToggle.checked) {
    unit = `imperial`;
  } else {
    unit = `metric`;
  }

  let weatherCoordsApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=${unit}`;

  let headTemp = document.querySelector(`#${sectionID} .headline-temperature`);

  if (headTemp) {
    axios.get(weatherCoordsApiUrl).then(function (response) {
      getTemps(sectionID, response);
    });
  }
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(function (position) {
    searchCurrentLocation(position, event);
  });
}

let currentLocationButton = document.querySelectorAll(".location-button");
currentLocationButton.forEach(function (item) {
  item.addEventListener("click", getCurrentLocation);
});

function formatDateStamp() {
  let now = new Date();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getDay()];
  let date = now.getDate();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  let time = now.toLocaleString(undefined, {
    minute: "2-digit",
    hour: "2-digit",
  });

  let dateStamp = document.querySelector("#date-stamp");
  dateStamp.innerHTML = `As at: ${day} ${date} ${month} ${time}`;
}
formatDateStamp();

function toggleUnits(event) {
  let targetUnitToggle = event.target;
  let section = targetUnitToggle.closest("section");
  let sectionID = section.id;

  let temps = document.querySelectorAll(`#${sectionID} .temp-num`);
  let unitLetterDays = document.querySelectorAll(
    `#${sectionID} .day-temperature`
  );
  let unitLetterHead = document.querySelector(
    `#${sectionID} .headline-temperature`
  );

  if (temps.length) {
    if (targetUnitToggle.checked) {
      temps.forEach(function (item) {
        item.innerHTML = Math.round((item.innerHTML * 9) / 5 + 32);
      });
      unitLetterDays.forEach(function (item) {
        item.innerHTML = item.innerHTML.replaceAll(`C`, `F`);
      });
      unitLetterHead.innerHTML = unitLetterHead.innerHTML.replace(`C`, `F`);
    } else {
      temps.forEach(function (item) {
        item.innerHTML = Math.round(((item.innerHTML - 32) / 9) * 5);
      });
      unitLetterDays.forEach(function (item) {
        item.innerHTML = item.innerHTML.replaceAll(`F`, `C`);
      });
      unitLetterHead.innerHTML = unitLetterHead.innerHTML.replace(`F`, `C`);
    }
  }
}

let toggleUnitSwitch = document.querySelectorAll(".unit-toggle");
toggleUnitSwitch.forEach(function (item) {
  item.addEventListener("click", toggleUnits);
});
