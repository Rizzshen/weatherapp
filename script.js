const apiKey = "4424ae3b42b8bedc0499d6c18a35137d";
let city = "Lahan";
const weather_URL = "connection.php?q=";
const paragraph = document.querySelector("#paragraph");
const input = document.querySelector("#input")
const form = document.querySelector("#form")
form.addEventListener("submit",(event)=>{
    event.preventDefault()
    let city = input.value;
    //fetchUsers(city);
    getAndDisplayWeather(city);
    console.log("navigator.onLine:", navigator.onLine);
})
async function getAndDisplayWeather(city) {
    if(navigator.onLine){
        try{
            const response = await fetch(`${weather_URL}${city}`);
            let data = await response.json();
            displayweather(data);
            console.log(data);
            localStorage.setItem(city, JSON.stringify(data));
        }
        catch(error){
            console.log(error);
            alert("city not found:", error)
        }
     }
    else{
        data = JSON.parse(localStorage.getItem(city));
        if(data){
            data = JSON.parse(data);
            displayweather(data);
        }
        else{
            alert("no weather data available offline")
        }
     }
}
getAndDisplayWeather(city);
// async function fetchUsers(city) {
//   try {
//     const response = await fetch(`${weather_URL}${city}`);
//     const data = await response.json();
//     console.log(data);
//     displayweather(data);
//   } catch (error) {
//     console.log(error);
//     alert("city not found")    
//   }
// }
// fetchUsers(city);
function displayweather(data) {
    arr = data[0];
    let time = readable(arr.dt,arr.timezone);    
    const options = {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      };
    const optionsWeekday = {
        weekday: 'long'
    }
    let options2 = {
        timeZone: 'UTC',  
        hour: 'numeric',
        minute: 'numeric',
        hour12: true 
    };
    
    let formattedLocalTime = new Intl.DateTimeFormat('en-US', options2).format(time);     
    let date =  readable(arr.dt,arr.timezone).toLocaleDateString('en-GB',options);
    let day = time.toLocaleDateString('en-GB',optionsWeekday);
    let dirrection = getWindDirection(arr.wind_deg)
    let icon = arr.icon
    const icon_URL = `https://openweathermap.org/img/wn/${icon}@2x.png`; 
    let celsius = convertKelvinToCelsius(arr.temp)
    document.querySelector("#time").innerHTML = `<p>${formattedLocalTime}</p>`      
    document.querySelector("#title").innerHTML = `<p> <h3><i class="fa fa-map-marker-alt"></i> ${arr.city},${arr.country}<h3></p>`
    document.querySelector("#detail1").innerHTML = `<p><strong>${arr.weather_main}<strong></p>`
    document.querySelector("#detail2").innerHTML = `<span>${arr.weather_description}</span>`
    document.querySelector("#date").innerHTML = `<p>${date}</p>`
    document.querySelector("#day").innerHTML = `<p><h4>${day}<h4></p>`
    document.querySelector("#temp").innerHTML = `<h1>${celsius}°C<h1>`
    document.querySelector("#icon").innerHTML = `<img src="${icon_URL}"><img>`
    document.querySelector("#humidity").innerHTML = `<strong> ${arr.humidity}%</strong><br>`
    document.querySelector("#direction-value").innerHTML = `<strong>${dirrection}</strong>`
    document.querySelector("#pressure-value").innerHTML = `<strong> ${arr.pressure}</strong>hpa`
    document.querySelector("#wind").innerHTML = `<strong>${arr.wind_speed}</strong> m/s`
}
function readable(num1,num2){
    let date = new Date((num1)*1000);
    console.log(date);
    let localTime = new Date(date.getTime() + (num2 * 1000));    
    return localTime;
}

function getWindDirection(degree) {
    // Determine wind direction based on the degree (0 to 360)
    if (degree >= 0 && degree < 45 || degree >= 315 && degree <= 360) {
        return "North";
    } else if (degree >= 45 && degree < 135) {
        return "East";
    } else if (degree >= 135 && degree < 225) {
        return "South";
    } else if (degree >= 225 && degree < 315) {
        return "West";
    } else {
        return "Unknown";  // Just in case
    }
}
function convertKelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(0);  
  }
