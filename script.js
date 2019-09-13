// 	list of classes from HTML

let DOMstrings = {
	container: document.querySelector('.container'),
	generalInfo: document.querySelector('.general-info'),
	dailyResults: document.querySelector('.daily-results'),
	searchBox: document.querySelector('.search'),
	eachDay: document.querySelectorAll('.each-day')
}

// function to get data

async function getData (city) {
	try {
		if (city !== "") {
		const result = await fetch(`https://www.metaweather.com/api/location/search/?query=${city}`);
		//console.log(city);
		//console.log(result);
		const data = await result.json();
		//console.log(data);
		const woeid = data[0].woeid;
		
		const results = await fetch(`https://www.metaweather.com/api/location/${woeid}`);
		const cityResult = await results.json();
		return cityResult;
		} else {
			alert('Something went wrong');
		}
	} catch (error) {
		alert('Something went wrong');
		clearfields();
	}
	
}

// function to get user input

const input = function() {
	
	let userInput = DOMstrings.searchBox.value;
	
	return userInput;
}

// function to remove user input once the search has been completed

function clearfields () {
	DOMstrings.searchBox.value = '';
	DOMstrings.searchBox.focus();
}

// function to display the loader while the results are being returned

function renderLoader (parent) {
	const loader = `
	<div class = "loader">
		<span></span>
		<span></span>
		<span></span>
	</div>
`;
	parent.insertAdjacentHTML('afterbegin', loader);
}

function clearLoader () {
	const loader = document.querySelector('.loader');
	if (loader) loader.parentElement.removeChild(loader);
}

// class to create an object with data retrieved from API

class Day {
		constructor(id, humidity, day, temp, icon, weather, maxTemp, minTemp, windDeg, windSpeed, windDirection) {
			this.id = id;
			this.humidity = humidity;
			this.day = day;
			this.temp = temp;
			this.icon = icon;
			this.weather = weather;
			this.maxTemp = maxTemp;
			this.minTemp = minTemp;
			this.windDeg = windDeg;
			this.windSpeed = windSpeed;
			this.windDirection = windDirection;
		}
};

// function to push data into array and assign a unique ID

function createArr (arr) {	
	
	let ID, newDay, day, temp, icon, weather, maxTemp, minTemp, humidity, windDeg, windSpeed, windDirection, week;
	
	week = [];
	
	for (let i = 0; i < arr.length; i++) {
		ID = i;
		day = splitDate(arr[ID].applicable_date);
		temp = arr[ID].the_temp;
		icon = arr[ID].weather_state_abbr;
		weather = arr[ID].weather_state_name;
		maxTemp = arr[ID].max_temp;
		minTemp = arr[ID].min_temp;
		humidity = arr[ID].humidity;
		windDeg = arr[ID].wind_direction;
		windSpeed = arr[ID].wind_speed;
		windDirection = arr[ID].wind_direction_compass;
		newDay = new Day(ID, humidity, day, temp, icon, weather, maxTemp, minTemp, windDeg, windSpeed, windDirection);
		
		week.push(newDay);

	}
	return week;
	
};

// function to convert american time format

function splitDate (day) {
	let split = day.split('-');
	
		let temp;
		temp = split[0];
		split[0] = split[2];
		split[2] = temp;
		
		let date = `${split[0]}-${split[1]}-${split[2]}`;
		return date;
}



// function to display the values in the UI

function displayValues(arr) {
	
	let consWeather = arr.consolidated_weather;
	
	
	// retrieving the array where the data was passed
	let week = createArr(consWeather);
	console.log(week);

	//let cityName = arr.title;
	
	let hour = new Date().getHours();
	let minutes = new Date().getMinutes();
	//time.innerHTML = `${hour}: ${minutes}`;
	
	
	let fillRes = day =>
		`
			<div class="each-day" id="${day.id}">
				<div class="day">${day.day}</div>
				<img class="icon" src="https://www.metaweather.com/static/img/weather/${day.icon}.svg">
				<div class="temperature">${Math.floor(day.temp)}&#8451</div>
			</div>
		`;
	
	let fillCenter = (w, id) => {
	
		let center= `
		<div class="card">
			<div class="center-left">
							<div class="weather-result result">${w[id].weather}</div>
							<div class="big-img">
								<img class="big-icon" src="https://www.metaweather.com/static/img/weather/${w[id].icon}.svg">
							</div>
							<div class="temp"> 
								<img class="ic" alt="thermometer" src="styles/thermometer-icon.svg">
								<div class="big-temp">${Math.floor(w[id].temp)}&#8451</div>
							</div>
						</div>	

					<div class="center-right">
						<div class="min-max">
								<div class="max-temp">
									<img class="ic" alt="thermometer-high" src="styles/thermometer-icon-high.svg">
									<div class="maxtemp-result result">${Math.floor(w[id].maxTemp)}&#8451</div>
								</div>
								<div class="min-temp">
									<img class="ic" alt="thermometer-low" src="styles/thermometer-low-icon.svg">
									<div class="mintemp-result result">${Math.floor(w[id].minTemp)}&#8451</div>
								</div>
						</div>
						<div class="humidity">
							<img class="ic" alt="humidity-icon" src="styles/drop-icon.svg">
							<div class="humidity-result result">${Math.floor(w[id].humidity)}%</div>
						</div>
						<div class="wind-speed">
							<img class="wind-icon" alt="wind-arrow" src="styles/wind-icon.svg">
							<div class="wind-direction-result result">${w[id].windDirection}</div>
							<div class="wind-speed-result result">${Math.floor(w[id].windSpeed)} mph</div>
						</div>
					</div>
				</div>
`;
		console.log(w, id);
		DOMstrings.dailyResults.insertAdjacentHTML('afterbegin', center);
}
	let results = 
		`	<div class="top">
				<div class="top-left">
						<div class="city">${arr.title}</div>
						<div data-day="0" class="date"></div>
				</div>
				<div class="top-right">
						<div class="time">${hour}: ${minutes}</div>
				</div>
			</div>
			<div class="results">
				${week.map(day => fillRes(day)).join('')}
			</div>
`;
	
	// filling the fields at the top of the screen, with some information about each day and setting the first day as a default
	
	DOMstrings.generalInfo.insertAdjacentHTML('afterbegin', results);
	
	fillCenter(week ,0);
	
	let resultsArr = Array.from(document.querySelectorAll('.each-day'));
	resultsArr[0].classList += ' selected';

	// function to change the central values each time that the user clicks on a different date
	
	function returnID(event) {
	
			id = event.target.parentNode.id;
			
			resultsArr.forEach(d => d.classList.remove('selected'));
		
			if (id) {
				console.log(id);
				//remove any previous results
				clearDailyResults();
				// add results to the centre of the screen 
				fillCenter(week, id);
				document.querySelector(`div[id="${id}"]`).classList +=' selected';
			}
		};

	
	
	DOMstrings.container.addEventListener('click', returnID);
	
	// function to clear the results at the centre any time that the user clicks on a different day
	
	function clearDailyResults () {
		DOMstrings.dailyResults.innerHTML = '';
	}

};


// central controller where all functions are activated once the user has introduced the search and pressed enter

document.addEventListener('keypress', function(e) {
	
	if (e.keyCode === 13 || e.which === 13) {
		
		// removing any results from any previous search 
		
		DOMstrings.generalInfo.innerHTML = '';
		DOMstrings.dailyResults.innerHTML = '';
		renderLoader(DOMstrings.generalInfo);

		let data;
		getData(input()).then (cityRes => {
		// pushing the input received from the async function into an obj
		data = cityRes;
			
		//  displaying the results in UI
		clearLoader();
		displayValues(data);
		
		// removing the input from the search bar and resetting the focus on it
		
		clearfields();

		});	
	}
});
