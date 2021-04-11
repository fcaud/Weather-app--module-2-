// Embedding HTML
function getTemps(ID, response) {
  let currentTemp = Math.round(response.data.main.temp);
  let cityName = response.data.name;
  let windSpeed = Math.round(response.data.wind.speed);
  let humidity = Math.round(response.data.main.humidity);
  let weatherDescription = response.data.weather[0].description;
  let currentLat = response.data.coord.lat;
  let currentLon = response.data.coord.lon;

  let cityHeader = document.querySelector(`#${ID} h2`);
  let headlineCityIcon = document.querySelector(
    `#${ID} .headline-weather-icon i`
  );
  let headerCurrentTemp = document.querySelector(`#${ID} .temp-num`);
  let windSpeedText = document.querySelector(`#${ID} .p-wind span`);
  let humidityText = document.querySelector(`#${ID} .p-humidity span`);

  cityHeader.innerHTML = cityName;
  headerCurrentTemp.innerHTML = currentTemp;
  windSpeedText.innerHTML = windSpeed;
  humidityText.innerHTML = humidity;
  changeWeatherIcon(weatherDescription, headlineCityIcon);
  temperatureConditionalFomratting(ID, currentTemp);

  forecastApiRun(currentLat, currentLon, ID);
}

function getForecastTemps(ID, response) {
  let dailyForecast = response.data.daily;

  let dayX = 0;

  dailyForecast.forEach(function (dailyForecast) {
    if (dayX < 5) {
      let dayPlaceholder = document.querySelector(`#${ID} .day-${dayX} h3`);
      let iconPlaceholder = document.querySelector(`#${ID} .day-${dayX} i`);
      let maxPlaceholder = document.querySelector(
        `#${ID} .day-${dayX} .min-temp-num`
      );
      let minPlaceholder = document.querySelector(
        `#${ID} .day-${dayX} .max-temp-num`
      );

      let newDate = new Date(dailyForecast.dt * 1000);
      let dayData = newDate.getDay();
      let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let formattedDay = days[dayData];

      dayPlaceholder.innerHTML = formattedDay;

      let maxTemp = Math.round(dailyForecast.temp.max);
      let minTemp = Math.round(dailyForecast.temp.min);
      maxPlaceholder.innerHTML = maxTemp;
      minPlaceholder.innerHTML = minTemp;

      let description = dailyForecast.weather[0].description;
      changeWeatherIcon(description, iconPlaceholder);

      dayX++;
    }
  });
}

function embedSectionContent(ID) {
  let placeholderCityText = document.querySelector(`#${ID} .placeholder-text`);
  let placeholderForecastText = document.querySelector(`#${ID} .blank`);
  placeholderCityText.classList = "city-summary";
  placeholderCityText.innerHTML = `<h2 class="city-header">-</h2>
          <div class="headline-weather-icon icon">
            <i class="fas fa-cloud-rain"></i>
          </div>
          <div class="headline-temperature">
            <span class="temp-num">-</span>°C
          </div>
          <div class="row extra-stats">
            <div class="col"></div>
            <div class="col">
              <p class="p-wind">Wind speed:<br /><span>-</span>kmh</p>
            </div>
            <div class="col">
              <p class="p-humidity">Humidity:<br /><span>-</span>%</p>
            </div>
            <div class="col"></div>
          </div>
          <hr />`;
  placeholderForecastText.classList = `day-forecast`;
  let forecastDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  let forecastHTML = `<div class="row">`;

  let dayX = 0;

  forecastDays.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col day-${dayX}">
        <h3>${day}</h3>
              <div class="day-weather-icon icon">
                <i class="fas fa-cloud-rain"></i>
              </div>
              <p class="day-temperature">
                <span class="min-temp-num">-</span>°C /
                <strong><span class="max-temp-num">-</span>°C</strong>
              </p>
        </div>`;
    dayX++;
  });

  forecastHTML = forecastHTML + `</div>`;
  placeholderForecastText.innerHTML = forecastHTML;
}

let moduleX = 1;

function addSection() {
  moduleX++;
  let newSection = document.createElement("section");
  newSection.setAttribute("class", "weather-module");
  newSection.setAttribute("id", `module-${moduleX}`);

  newSection.innerHTML = `<form class="search-bar" autocomplete="off">
          <input
            type="search"
            name="city-search"
            placeholder="Please enter city..."
            class="city-search-bar"
          />
          <input type="submit" value="Search" class="city-search-button" />
        </form>

        <div>
          <button class="location-button">
            <i class="fas fa-location-arrow"></i>
          </button>
        </div>

        <div class="form-check form-switch unit-switch">
          <input
            class="form-check-input unit-toggle"
            type="checkbox"
            id="flexSwitchCheckDefault"
          />
          <label class="form-check-label" for="flexSwitchCheckDefault"
            >°C / °F
          </label>
        </div>

        <div class="placeholder-text">
          <h2 class="city-header">Search city...</h2>
        </div>
        <div class="blank"></div>`;
  let addModuleSection = document.getElementById("add-module-section");
  addModuleSection.parentNode.insertBefore(newSection, addModuleSection);

  buttonClickEventsNewModules(moduleX);
}

function changeWeatherIcon(description, targetIcon) {
  if (description === "clear sky") {
    targetIcon.classList = "fas fa-sun";
  } else if (description === "few clouds") {
    targetIcon.classList = "fas fa-cloud-sun";
  } else if (description === "scattered clouds") {
    targetIcon.classList = "fas fa-cloud";
  } else if (description === "broken clouds") {
    targetIcon.classList = "fas fa-cloud";
  } else if (description === "shower rain") {
    targetIcon.classList = "fas fa-cloud-rain";
  } else if (description === "rain") {
    targetIcon.classList = "fas fa-cloud-showers-heavy";
  } else if (description === "thunderstorm") {
    targetIcon.classList = "fas fa-bolt";
  } else if (description === "snow") {
    targetIcon.classList = "fas fa-snowflake";
  } else if (description === "mist") {
    targetIcon.classList = "fas fa-stream";
  }
}

// ---------------------------------------------------------------------------
// Running APIs
function forecastApiRun(lat, lon, ID) {
  let weatherApiKey = `a853abb2375faaf0d512fcc19dee1229`;
  let forecastUnit = "metric";

  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${forecastUnit}&appid=${weatherApiKey}`;

  axios.get(forecastApiUrl).then(function (response) {
    getForecastTemps(ID, response);
  });
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

  let headTemp = document.querySelector(`#${sectionID} .headline-temperature`);

  if (citySearched) {
    if (!headTemp) {
      embedSectionContent(sectionID);
    }

    axios
      .get(weatherApiUrl)
      .then((response) => {
        getTemps(sectionID, response);
      })
      .catch((error) => {
        alert("City not recognised");
      });
  }
}

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

  if (!headTemp) {
    embedSectionContent(sectionID);
  }

  axios.get(weatherCoordsApiUrl).then(function (response) {
    getTemps(sectionID, response);
  });
}

// ------------------------------------------------------------
// Get location
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(function (position) {
    searchCurrentLocation(position, event);
  });
}

// -------------------------------------------------------------
// Formatting
function temperatureConditionalFomratting(ID, temp) {
  let findSection = document.querySelector(`section#${ID}`);
  if (temp >= 15) {
    findSection.classList = "weather-module weather-hot";
  } else {
    findSection.classList = "weather-module weather-cold";
  }
}

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
  dateStamp.innerHTML = `${day} ${date} ${month} ${time}`;
}
formatDateStamp();

// --------------------------------------------------------------------------
// Unit toggle calculation
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

// ------------------------------------------------------------
// event listeners
let searchCity = document.querySelectorAll(".search-bar");
searchCity.forEach(function (item) {
  item.addEventListener("submit", citySearch);
});

let currentLocationButton = document.querySelectorAll(".location-button");
currentLocationButton.forEach(function (item) {
  item.addEventListener("click", getCurrentLocation);
});

let toggleUnitSwitch = document.querySelectorAll(".unit-toggle");
toggleUnitSwitch.forEach(function (item) {
  item.addEventListener("click", toggleUnits);
});

function buttonClickEventsNewModules(ID) {
  let newSearchButton = document.querySelector(
    `#module-${ID} .city-search-button`
  );
  let newLocationButton = document.querySelector(
    `#module-${ID} .location-button`
  );
  let newToggleUnitSwitch = document.querySelector(
    `#module-${ID} .unit-toggle`
  );
  newSearchButton.addEventListener("click", citySearch);
  newLocationButton.addEventListener("click", getCurrentLocation);
  newToggleUnitSwitch.addEventListener("click", toggleUnits);
}

let addSectionButton = document.querySelector(`.add-module button`);
addSectionButton.addEventListener("click", addSection);
