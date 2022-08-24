
let userInput = document.querySelector(".input");
let searchForm = document.querySelector("#search-form");
let mainWeather = document.querySelector('.main-weather');
let weatherStats = document.querySelector('.weather-stats')


//get Lat and Lon for the current weather api call
let getLatLon = (city) => {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=35364985ed49d890b2571e2cb173bbb0`)
    .then(response => {
        return response.json()
    })
   .then(data => {
        //let lat = data.city.coord.lat
        //let lon = data.city.coord.lon
        //console.log(lat, lon)
    
        getCurrentWeather(data);
    })
}



//current weather api call 
let getCurrentWeather = (response) => {
    let cityLat = response.city.coord.lat
    let cityLon = response.city.coord.lon
  
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=35364985ed49d890b2571e2cb173bbb0`)
    .then(response => {
        if (response.ok) {
        return response.json()
    } else {
        alert("City Not Found")
    }
})
    .then(data => {
        console.log(data)
    })
    .catch((error) => console.error("Fetch Error" , error))

    mainWeather.innerHTML = response.city.name 
    + response.city.timezone
    
    
    console.log(mainWeather)
    
}




//save search history to local storage
/*window.localStorage.setItem('userInput')

//load the anything in local storage to the page
window.localStorage.getItem('userInput')*/


//function to handle the click event
clickEventHandler = (e) => {
    e.preventDefault();
    let city = userInput.value.trim();
    getLatLon(city);
};



//event listeners for user input
searchForm.addEventListener('submit', clickEventHandler);