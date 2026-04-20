const key = "68b69f8ba844f520e5058105c74442d7";

const apiButton = document.querySelector(".api-call-button");
const apiTemperatureData = document.querySelector(".local-temperature");
const apiHumidityData = document.querySelector(".local-humidity");
const apiLocale = document.querySelector(".local-name");

const apiWeatherData = document.querySelector(".local-weather");
const apiWeatherDesc = document.querySelector(".local-weather-desc");

const cityName = "Candaba";
const countryCode = "PH";

const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${key}&units=metric`;

async function getWeather() {
    return fetch(url).then(response => {
        if(!response.ok) {
            throw new Error("City or Country Code not found!");
        }
        return response.json();
    }).then(data => {
        console.log(data);
        return {
            name: data.name,
            weather: data.weather[0].main,
            description: data.weather[0].description,
            temp: data.main.temp,
            humidity: data.main.humidity
        }
    });
}

getWeather().then(
    data => {
        apiLocale.textContent = data.name;
        apiTemperatureData.textContent = data.temp;
        apiHumidityData.textContent = data.humidity;
        apiWeatherData.textContent = data.weather;
        apiWeatherDesc.textContent = data.description;
        console.log("Successfully retrieve API Data");
    }
).catch(
    error => {
        window.alert(error.message);
        console.log("Something went wrong >> " + error.message);
    }
);

apiButton.addEventListener('click', ()=>{
    getWeather().then(
        data => {
            apiLocale.textContent = data.name;
            apiTemperatureData.textContent = data.temp;
            apiHumidityData.textContent = data.humidity;
            apiWeatherData.textContent = data.weather;
            apiWeatherDesc.textContent = data.description;
            console.log("Successfully retrieve API Data.");
        }
    ).catch(
        error => {
            window.alert(error.message);
            console.log("Something went wrong >> " + error.message);
        }
    );
    console.log("Successfully retried API Call.");
});