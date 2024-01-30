// api response integration to html

function formatDay(time) {
  let date = new Date(time * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[date.getDay()];
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast-day-list");

  let forecastHtml = "";
  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `  <li class="daily-forecast">
      <p class="forecast-day">${formatDay(day.time)}</p>
      <div class="min-max">
      <img
      src="${day.condition.icon_url}"
      alt=""
      />
      <p class="min">${Math.round(day.temperature.minimum)}</p>
        <p class="max">${Math.round(day.temperature.maximum)}</p>
          </div>
          </li>`;
    }
  });
  document.querySelector(".weather-forecast").classList.add("appear");
  forecastElement.innerHTML = forecastHtml;
}
//fetch forecast
function getForecast(city) {
  let apiKey = "b4b16ao0bed60a37cdt0a5dcdf865c3b";
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.get(forecastUrl).then(displayForecast);
}

//daily weather api integration
function cityInfo(response) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  /*let temperature = document.querySelector(".temperature");
  let description = document.querySelector(".description");
  let humidity = document.querySelector(".humidity");
  let wind = document.querySelector(".wind");
  let icon = document.querySelector(".icon");
  let currentDay = document.querySelector(".current-day");
  let time = document.querySelector(".time");
   */
  let iconCode = response.data.weather[0].icon;
  let date = new Date(response.data.dt * 1000);
  let hours = date.getHours();
  let mins = date.getMinutes();
  if (mins < 10) {
    mins = `0${mins}`;
  }
  let day = date.getDay();

  // if api returns error
  let cityForecast = document.querySelector(".weather-forecast");
  let weatherBox = document.querySelector(".weather-box");

  let time = `${hours}:${mins}`;
  let currentDay = days[day];
  let iconSrc = `https://openweathermap.org/img/w/${iconCode}.png`;
  let wind = response.data.wind.speed;
  let humidity = response.data.main.humidity;
  let description = response.data.weather[0].description;
  let temperature = Math.round(response.data.main.temp);

  if (response.ok) {
    weatherBox.innerHTML = ` <div class="not-found">
                <div class="box">
                  <p>
                    <i class="bx bx-message-alt-error"></i>
<br>
                    Oops! Location not found. Please try your nearest city.
                  </p>
                </div>
              </div>`;

    cityForecast.style.display = "none";
  } else {
    weatherBox.innerHTML = `  <div class="weather-box">
              <div class="box-1">
                <div class="info-weather">
                  <h1 class="city">${response.data.name}</h1>
                  <div>
                    <span class="current-day">${currentDay},</span>
                    <span class="time">${time}</span>
                  </div>
                  <span
                    ><img
                      class="icon"
                      src="${iconSrc}"
                      alt=""
                  /></span>
                  <div>
                    <span class="temperature">${temperature}</span>
                    <span class="units">°C</span>
                  </div>
                  <span class="description">${description}</span>
                </div>
              </div>

              <div class="extras">
                <p>
                  <i class="bx bx-water"></i> <br />
                  Humidity: <span class="humidity">${humidity}</span>%
                </p>
                <p>
                  <i class="bx bx-wind"></i> <br />
                  Wind speed:
                  <span class="wind">${wind}</span> km/h
                </p>
              </div>
             
            </div>`;
            
    document.querySelector(".extras").classList.add("appear");
    document.querySelector(".box-1").classList.add("appear");
    cityForecast.style.display = "block";
    getForecast(response.data.name);
  }
}

function handleError() {
  let cityForecast = document.querySelector(".weather-forecast");
  let weatherBox = document.querySelector(".weather-box");

  weatherBox.innerHTML = ` <div class="not-found">
                  <div class="box">
                    <p>
                      <i class="bx bx-message-alt-error"></i>
  <br>
                      Oops! Location not found. Please try your nearest city.
                    </p>
                  </div>
                </div>`;

  let forecastElement = document.querySelector("#forecast-day-list");
  forecastElement.innerHTML = "";
  cityForecast.style.display = "none";
  document.querySelector(".not-found").classList.add("appear");
}
function searchCity(city) {
  let key = "fea2efcd3e02d8f02338366e2c372f87";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;

  axios
    .get(apiUrl)
    .then(cityInfo)
    .catch((err) => handleError());
}

//handle submition
function handleSubmit(event) {
  event.preventDefault();
  let input = document.querySelector(".search-box");
  let h1 = document.querySelector("h1");
  h1 = input.value;
  let city = input.value;
  searchCity(city);
}
//forecast loop
//form submit event listener
let formSubmit = document.querySelector("#submit");
formSubmit.addEventListener("click", handleSubmit);
