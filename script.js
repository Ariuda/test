// 	list of classes from HTML

let res = document.querySelector('.res');
let container = document.querySelector('.container');
let topScreen = document.querySelector('.top');
let results = document.querySelector('.results');

let name = document.querySelector('.city');
let maxTemp = document.querySelector('.maxtemp-result');
let minTemp = document.querySelector('.mintemp-result');
let humidity = document.querySelector('.humidity-result');
let windSpeed = document.querySelector('.wind-speed-result');
let windDirection = document.querySelector('.wind-direction-result');
let date = document.querySelector('.date');
let time = document.querySelector('.time');
let daysHTML = document.querySelectorAll('.day');
let iconHTML = document.querySelectorAll('.icon');
let temperatureHTML = document.querySelectorAll('.temperature');
let searchBox = document.querySelector('.search');
let eachDay = document.querySelectorAll('.each-day');

let circleWeather = document.querySelector('.weather-result');
let circleIcon = document.querySelector('.big-icon');
let circleTemp = document.querySelector('.big-temp');

let windIcon = document.querySelector('.wind-icon');


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

// function to get data

async function getData (city) {
	try {
		if (city !== "") {
			const result = await fetch(`https://www.metaweather.com/api/location/search/?query=${city}`);
			console.log(city);
			console.log(result);
			const data = await result.json();
			console.log(data);
			const woeid = data[0].woeid;

			const results = await fetch(`https://www.metaweather.com/api/location/${woeid}`);
			const cityResult = await results.json();
			return cityResult;
		} else {
			alert('Something went wrong');
		}

	} catch (error) {
		console.log(woeid);
		alert(error);
	}
	
}

// function to get user input

const input = function() {
	
	let userInput = searchBox.value;
	
		return userInput;
}

// function to remove user input once the search has been completed

function clearfields () {
	searchBox.value = '';
	searchBox.focus();
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
	console.log(week);
	return week;
	
};

function loopOverResults (arr) {
	arr.map(item => item);
}

// function to display the loader while the results are being returned

function renderLoader (parent) {
	container.style.opacity = '0';
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


// function to display the values in the UI

function displayValues(arr) {
	
	let consWeather = arr.consolidated_weather;
	
	
	// retrieving the array where the data was passed
	let week = createArr(consWeather);
	
	// filling the fields at the top of the screen, with some information about each day

	name.innerHTML = `This week in ${arr.title}:`;
	
	daysHTML.forEach((d, i) => d.innerHTML = week[i].day);
	iconHTML.forEach((icon, i) => icon.src = `https://www.metaweather.com/static/img/weather/${week[i].icon}.svg`);
	temperatureHTML.forEach((t, i) => t.innerHTML = `${Math.floor(week[i].temp)}°`);
		
	eachDay.forEach((d, i) => {
		
		// assigning an ID to each of the wrapping DIVS from the HTML
		d.setAttribute('id', week[i].id);
		
		// filling the first day as a default option
		fillCenter(0, week);
		
		// function to change selected day and change the central data accordingly
		d.addEventListener('click', function(e) {
			
			let id = e.target.parentNode.id;
			
			eachDay.forEach(d => { 
				d.classList.remove('selected');		 
			 });
			
			d.classList += ' selected';
			
			fillCenter(id, week);
			
		});
	});
	container.style.opacity = '1';
};

// function to fill DIVS to see data from each day in detail

function fillCenter (id, week) {
	
	circleWeather.innerHTML = week[id].weather;
	circleIcon.src = `https://www.metaweather.com/static/img/weather/${week[id].icon}.svg`;
	circleTemp.innerHTML = `${Math.floor(week[id].temp)}°`;
	maxTemp.innerHTML = `${Math.floor(week[id].maxTemp)}°`;
	minTemp.innerHTML = `${Math.floor(week[id].minTemp)}°`;
	humidity.innerHTML = `${week[id].humidity}%`;
	windDirection.innerHTML = week[id].windDirection;
	rotateWindIcon(week[id].windDeg, windIcon);
	windSpeed.innerHTML = `${Math.floor(week[id].windSpeed)}mph`;
}; 

// function to rotate the wind arrows as per degrees 

function rotateWindIcon (direction, ic) {

	ic.style.transform = `rotate(${direction}deg)`;
	
};

// central controller where all functions are activated once the user has introduced the search and pressed enter

document.addEventListener('keypress', function(e) {
	
	if (e.keyCode === 13 || e.which === 13) {
		
		renderLoader(res);

		let data;
		getData(input()).then (cityRes => {
		// pushing the input received from the async function into an obj
		data = cityRes;
		console.log(data);
			
		// removing the input from the search bar and resetting the focus on it
		
		clearfields();
			
		//  displaying the results in UI
		clearLoader();
		displayValues(data);
		
		

		});	
	}
});

































