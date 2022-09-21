let userInput = document.querySelector(".input");
let searchForm = document.querySelector("#search-form");
let cityName = document.querySelector('#city-name');
let weatherStats = document.querySelector('.weather-stats');
let city = userInput.value
let cityArr = localStorage.getItem('cityArr')===null? []:JSON.parse(localStorage.getItem('cityArr'))

//design for the input button
let inputButton = document.querySelector('#input-button');
inputButton.classList.add('button', 'btn-primary', 'rounded')

//design for clear search history button
let clearSearch = document.querySelector('#clear-search');
clearSearch.classList.add('button', 'btn-primary', 'rounded')

let searchHistory = document.querySelector('#history')


//for loop to iterate over anything in local storage and add it to the page
for(i=0; i < cityArr.length; i++) {
    const cityName = cityArr[i] 
    let historyEl = document.createElement('p')
    historyEl.textContent = cityName
    historyEl.classList.add('buttonEl', 'btn-primary', 'rounded', 'btn-lg')

    searchHistory.appendChild(historyEl)
   
};



//get Lat and Lon for the current weather api call
let getLatLon = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=35364985ed49d890b2571e2cb173bbb0`)
    .then(response => {
        return response.json()
    })
   .then(data => {
        getCurrentWeather(data);
    })
}



//current weather api call 
let getCurrentWeather = (data) => {
    let cityLat = data.city.coord.lat
    let cityLon = data.city.coord.lon

    //fetch statement for current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=35364985ed49d890b2571e2cb173bbb0`)
    .then(response => {
        if (response.ok) {
        return response.json()
    } else {
        alert("City Not Found")
    }
})
    .then(data => {
        console.log(data)
        cityName.textContent = data.name
        cityName.classList.add('h1', 'strong',)

        //Populate the data to the li in the index.HTML
        let dateTime = document.querySelector('#date-time')
        dateTime.setAttribute('class', 'date-time')
        dateTime.textContent = moment().format("MMM Do YYYY");

        let weather = document.querySelector('.description')
        weather.textContent = ('Conditions: ' +  data.weather[0].description)

        let temp = document.querySelector('.temp')
        temp.textContent = ('Temperature: ' + data.main.temp + ' Degrees')
        
        let windSpeed = document.querySelector(".wind-speed")
        windSpeed.textContent = ('Wind Speed: ' + data.wind.speed + ' mph');

        let humidity = document.querySelector('.humidity')
        humidity.textContent = ('Humidity: ' + data.main.humidity + ' %');


        let icon = document.querySelector('.icon')
        icon.innerHTML = '';
        let weatherIcon = document.createElement('img')
        weatherIcon.setAttribute('src', "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        icon.appendChild(weatherIcon)
        


        fiveDayForecast(cityLat, cityLon);
        
})
    .catch((error) => console.error("Fetch Error" , error))
}    

//function to get the data for five day forcast as well as populating the data to cards
//and putting it on the page.
let fiveDayForecast = (cityLat, cityLon) => {
     fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=35364985ed49d890b2571e2cb173bbb0`)
     .then(response => {
         if (response.ok) {
         return response.json()
     } else {
         alert("City Not Found")
     }
 })
     .then(data => {
         console.log(data)

         let card = document.querySelector('.five-day-container');
         card.innerHTML = '';
          
        
         for(i=0;i<5;i++) {
            let cardInfo = document.createElement('div')
            cardInfo.classList.add('card', 'bg-primary', 'text-white', 'rounded', 'mr-2', 'flex-fill');

           
            let iconEl = document.createElement('img')
            iconEl.classList.add('w-50')
            let fiveDayDate = document.createElement('p')
            fiveDayDate.classList.add('h4', 'strong')
            let tempEl = document.createElement('p')
            let humidityEl = document.createElement('p')
            let windEl = document.createElement('p')
            
            
            let startDate = moment().add(1, 'day').add(i, 'day').format('MMM Do YYYY')
            
            let cardTemp = (data.list[i].main.temp + ' degrees')
            let cardHumidity = (data.list[i].main.humidity + ' % humidity')
            let cardWind = (data.list[i].wind.speed + ' mph wind speed')
            
            iconEl.setAttribute('src', "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            
        
            
            fiveDayDate.textContent = startDate
            tempEl.textContent = cardTemp
            humidityEl.textContent = cardHumidity
            windEl.textContent = cardWind
            
            cardInfo.appendChild(iconEl)
            card.appendChild(cardInfo)
            cardInfo.appendChild(fiveDayDate)
            cardInfo.appendChild(tempEl)
            cardInfo.appendChild(humidityEl)
            cardInfo.appendChild(windEl)
            
           
        } 
    })
     .catch((error) => console.error("Fetch Error" , error))
}




//function for setting and getting local storage
let setCity = () => {
    if(cityArr.indexOf(userInput.value.toUpperCase()) == -1) {
        cityArr.push(userInput.value.toUpperCase())
        let historyEl = document.createElement('p')
        historyEl.textContent = userInput.value.toUpperCase()
        historyEl.classList.add('buttonEl', "btn-primary", 'rounded', 'btn-lg')
        searchHistory.appendChild(historyEl)
        console.log(historyEl)
    }

    

    if(cityArr.length > 5) {
        cityArr.shift();
    }
    localStorage.setItem('cityArr', JSON.stringify(cityArr));
};

//function to handle the search click event
clickEventHandler = (e) => {
    e.preventDefault(); 
    let city = userInput.value.trim();
        getLatLon(city);
        setCity(city);
}

//function to handle click event for searching a previous city 
searchHistoryHandler = (e) => {
    let city = e.target.innerHTML
    getLatLon(city)
}

//function to handle click event for clearing local storage and search history
clearSearchHandler = (e)  => {
    cityArr = [];
    searchHistory.innerHTML = '';
    localStorage.clear();
}

//event listeners for user input
searchForm.addEventListener('submit', clickEventHandler);

//event listener for previous searched cities
searchHistory.addEventListener('click', searchHistoryHandler);

//event listener for clearing local storage
clearSearch.addEventListener('click', clearSearchHandler);