// Sample Data
//===================
// var tango = {
//     newnan: { 
//         state: 'ga', 
//         count: 1
//     },
//     Atlanta: {
//         state: 'ga', 
//         count: 2
//     },
//     statesboro: {
//         state: 'ga',
//         count: 3
//     }
// }

/*
*cities array example: 
*=========================
* cities: [
*   {
*       city:,
*       state:,
*       count:,
*   }
* ]
*/
app = {
    cities: {},
    newCityBtn: document.getElementById('new_city')
};
const $here = document.getElementById('here'),
	  $form = document.getElementById('form');
const getForecast = function thar(city, state, mod_num) {
    var statement = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${ city }, ${ state }")`
    let url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + statement;
    // TODO add cache logic here
    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          var results = response.query.results.channel;
          var title = results.item.title;
					console.log(results.item.condition);
          return updateWeather(results.item.condition, mod_num, city);
        }
      } else if (request.readyState === XMLHttpRequest.LOADING) {
      		console.log('loading');
      }
    };
    request.open('GET', url);
    request.send();
  };
  const updateWeather = function weatherFunc( weatherObj, module_number, cityQ ) {
		let curr_module = document.querySelector(`[data-count="${module_number}"]`);
		let title = curr_module.children[0];
		let module_arr = curr_module.children[1].children;

		title.textContent = `Weather for: ${cityQ}`;
		module_arr.date.textContent = weatherObj.date;
		module_arr.weather.textContent = weatherObj.text;
		module_arr.temp.textContent = weatherObj.temp;
};

const getCitiesFromStorage = function() {
    return app.cities = JSON.parse(localStorage.getItem('cities'));
};
const updateCityStorage = function( obj ){
    return localStorage.setItem(JSON.stringify(obj));
};
window.onload = function() {
    getCitiesFromStorage();
    console.log(app.cities);
	Object.entries(app.cities).forEach((el) => {
		let newModule = $here.children[0].cloneNode(true);
		newModule.dataset.count = el[1].count;
		newModule.hidden = false;
		$here.appendChild(newModule)
	});
	Object.entries(app.cities).forEach((el) => {
		getForecast(el[0], el[1].state, el[1].count);
	})
};
$form.addEventListener('submit', function(e){
	let city = document.getElementById('citySearch').value;
	let state = document.getElementById('stateSearch').value;
	let new_module_number = Object.entries(app.cities).length + 1;
	let newModule = $here.children[0].cloneNode(true);
	newModule.dataset.count = new_module_number;
	newModule.hidden = false;
	$here.appendChild(newModule);
	e.preventDefault();
	document.getElementById('citySearch').value = '';
	document.getElementById('stateSearch').value = '';
	//update app.cities
	app.cities[city] = {
		state: state,
		count: new_module_number
	}

	getForecast(city, state, new_module_number);
});

//el[0] = city
//el[1].state = state
//el[1].count = module number
