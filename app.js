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

let cnt = document.getElementsByClassName('cnt')[0];
	let sb = document.getElementsByClassName('sb')[0];
app = {
	cnt: document.getElementsByClassName('cnt')[0],
	sb: document.getElementsByClassName('sb')[0]
};
const $weather_mods = document.getElementById('weather_mods'),
	  $show_sb = document.getElementById('show_sb'),
	  $close_sb = document.getElementById('close_sb'),
	  $form = document.getElementById('form');
const getForecast = function thar(city, state, mod_num) {
    let statement = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${ city }, ${ state }")`
    let url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + statement;
    // TODO add cache logic here
    // Fetch the latest data.
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          let response = JSON.parse(request.response);
          let results = response.query.results.channel;
          let title = results.item.title;
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
//middleware soon!
const removeCitiesFromStorage = function() {
	return localStorage.removeItem('cities');
};
const getCitiesFromStorage = function() {
    return app.cities = JSON.parse(localStorage.getItem('cities')) || {};
};
const updateCityStorage = function( obj ){
    return localStorage.setItem('cities', JSON.stringify(obj));
};
window.onload = function() {
    getCitiesFromStorage();
    console.log(app.cities);
	Object.entries(app.cities).forEach((el) => {
		let newModule = $weather_mods.children[0].cloneNode(true);
		newModule.dataset.count = el[1].count;
		newModule.hidden = false;
		$weather_mods.appendChild(newModule)
	});
	Object.entries(app.cities).forEach((el) => {
		getForecast(el[0], el[1].state, el[1].count);
	})
};

$close_sb.addEventListener('click', function() {
	if(sb.classList.length > 1) {
		app.sb.setAttribute('class','sb');
		app.cnt.setAttribute('class','cnt');
	} else {
		app.sb.setAttribute('class','sb sb-active');
		app.cnt.setAttribute('class','cnt cnt-active');
	}
});
$close_sb.addEventListener('touchstart', function() {
	if(sb.classList.length > 1) {
		app.sb.setAttribute('class','sb');
		app.cnt.setAttribute('class','cnt');
	} else {
		app.sb.setAttribute('class','sb sb-active');
		app.cnt.setAttribute('class','cnt cnt-active');
	}
});
$show_sb.addEventListener('click', function() {
	if(sb.classList.length > 1) {
		app.sb.setAttribute('class','sb');
		app.cnt.setAttribute('class','cnt');
	} else {
		app.sb.setAttribute('class','sb sb-active');
		app.cnt.setAttribute('class','cnt cnt-active');
	}
});
// $show_sb.addEventListener('touchstart', function() {
// 	if(sb.classList.length > 1) {
// 		app.sb.setAttribute('class','sb');
// 		cnt.setAttribute('class','cnt');
// 	} else {
// 		app.sb.setAttribute('class','sb sb-active');
// 		cnt.setAttribute('class','cnt cnt-active');
// 	}
// });
$form.addEventListener('submit', function(e){
	e.preventDefault();
	let city = document.getElementById('citySearch').value;
	let state = document.getElementById('stateSearch').value;
	let new_module_number = Object.entries(app.cities).length + 1;
	let newModule = $weather_mods.children[0].cloneNode(true);
	newModule.dataset.count = new_module_number;
	newModule.hidden = false;
	$weather_mods.appendChild(newModule);
	document.getElementById('citySearch').value = '';
	document.getElementById('stateSearch').value = '';
	//update app.cities
	app.cities[city] = {
		state: state,
		count: new_module_number
	};
	updateCityStorage(app.cities);
	getForecast(city, state, new_module_number);
	app.sb.setAttribute('class','sb');
	app.cnt.setAttribute('class','cnt');
});

//el[0] = city
//el[1].state = state
//el[1].count = module number
