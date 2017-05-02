const $show_sb = document.getElementById('show_sb'),
      $close_sb = document.getElementById('close_sb'),
      $del_store = document.getElementById('del_store'),
      $form = document.getElementById('form');
const app = {
		cnt: document.getElementsByClassName('cnt')[0],
		sb: document.getElementsByClassName('sb')[0]
};


const injectModuleWithWeather = function(city, weather_obj, target) {
    let title = target.children[0];
    let module_arr = target.children[1].children;
    let delete_mod = target.children[2];
    
    //add delete button event handler
    delete_mod.onclick = function(e) {
        let funct_city = city;
        e.preventDefault();
        deleteCityFromStore(city);
    };

		title.textContent = `Weather for: ${city}`;
		module_arr.date.textContent = weather_obj.date;
		module_arr.weather.textContent = weather_obj.text;
		module_arr.temp.textContent = weather_obj.temp;
}; 

const getForecast = function thar(city, state, $target_module) {
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
          console.log(`returning - city: ${city}, target_module: ${$target_module.dataset.count} `);
          //return and send along the city and weather obj and module doc object
          return injectModuleWithWeather(city, results.item.condition, $target_module);
        }
      } else if (request.readyState === XMLHttpRequest.LOADING) {
      		console.log('loading');
      }
    };
    
    //event ready request is sent
    request.open('GET', url);
    request.send();
  };

  const createNewCityAddAndStore = function(city, state, data_count) {
    //getItems from store
    let new_obj = JSON.parse(localStorage.getItem('cities')) || {};
    if(new_obj[city]){
      console.log('yes dup')
    }
    //TODO make a check so that if length is the same before and after, no new module is placed
    //set the new city and state
    new_obj[city] = {
        state: state,
        count: data_count
    };
    
    //store locally
    localStorage.setItem('cities', JSON.stringify(new_obj));

    //make new empty model and place (do this for loading ui)
    let newModule = document.getElementById('hidden').children[0].cloneNode(true);
    newModule.dataset.count = new_obj[city].count;
    newModule.hidden = false;
    console.log('appending mod: ', newModule);
    document.getElementById('weather_mods').appendChild(newModule);
    //getWeatherAndStore() and store locally
    return getForecast(city, state, document.querySelector(`[data-count="${data_count}"]`));
  };
  const removeModules = function() {
      localStorage.removeItem('cities');
      document.getElementById('weather_mods').innerHTML = '';
  };
  const deleteCityFromStore = function(city) {
      let old_obj_arr = Object.entries(JSON.parse(localStorage.getItem('cities')));
      let new_obj_arr = [];
      
      console.log('old object store arr: ', old_obj_arr);
      old_obj_arr.forEach((el) => {
        if(el[0] === city) {
          //do nothing
        } else {
          new_obj_arr.push(el);
        }
      });
      console.log('new arr: ', new_obj_arr);
      //reset module area
      document.getElementById('weather_mods').innerHTML = '';
      //if value make obj and set local store, if no value return out
      if(new_obj_arr.length > 0 ) {
        let new_obj = {};
        new_obj_arr.forEach((el, i) => {
          
          new_obj[el[0]] = {
              state: el[1].state,
              count: i + 1
          };

          createNewCityAddAndStore(el[0], el[1].state, i + 1);
        });
        // return and store locally
        console.log('new obj: ', new_obj);
        return localStorage.setItem('cities', JSON.stringify(new_obj));
      } else {
        return localStorage.removeItem('cities');
      }
  };


  $close_sb.addEventListener('click', function() {
    console.log('close_sb: click');
    if(app.sb.classList.length > 1) {
      app.sb.setAttribute('class','sb');
      app.cnt.setAttribute('class','cnt');
    } else {
      app.sb.setAttribute('class','sb sb-active');
      app.cnt.setAttribute('class','cnt cnt-active');
    }
  });
 
  $show_sb.addEventListener('click', function() {
     console.log('show_sb: click');
    if(app.sb.classList.length > 1) {
      app.sb.setAttribute('class','sb');
      app.cnt.setAttribute('class','cnt');
    } else {
      app.sb.setAttribute('class','sb sb-active');
      app.cnt.setAttribute('class','cnt cnt-active');
    }
  });

  
  $del_store.addEventListener('click', removeModules);

  $form.addEventListener('submit', function(e){
    e.preventDefault();
    let city = document.getElementById('citySearch').value;
    let state = document.getElementById('stateSearch').value;

    //set the input values equal to nothing
    document.getElementById('citySearch').value = '';
    document.getElementById('stateSearch').value = '';

    //if there are items in store account for them else set the new mod number equal to the first
    let new_module_number;
    if(localStorage.getItem('cities')) {
      new_module_number = Object.entries(JSON.parse(localStorage.getItem('cities'))).length + 1;
    } else {
      new_module_number = 1;
    }

    //create new city and store locally with values
    createNewCityAddAndStore(city, state, new_module_number);
    app.sb.setAttribute('class','sb');
    app.cnt.setAttribute('class','cnt');
  });

  window.onload = function() {
      let new_obj = JSON.parse(localStorage.getItem('cities')) || {};
     
      if(Object.entries(new_obj).length > 0) {
         Object.entries(new_obj).forEach((el, i) => { 
            createNewCityAddAndStore(el[0], el[1].state, i + 1);
        });
      } else {
          //continue
          // localStorage.setItem('cities', '{}');
      }
  }
  
