const $show_sb = document.getElementById('show_sb'),
      $close_sb = document.getElementById('close_sb'),
      $del_store = document.getElementById('del_store'),
      $form = document.getElementById('form');
const app = {
		cnt: document.getElementsByClassName('cnt')[0],
		sb: document.getElementsByClassName('sb')[0],
		// city_count: Object.entries(JSON.parse(localStorage.getItem('cities'))).length
};


const injectModuleWithWeather = function(city, weather_obj, target) {
    let title = target.children[0];
    let module_arr = target.children[1].children;

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
    console.log('mod_template: ', );
    document.getElementById('weather_mods').appendChild(newModule);
    //getWeatherAndStore() and store locally
    return getForecast(city, state, document.querySelector(`[data-count="${data_count}"]`));
  };
  const removeModules = function() {
      localStorage.removeItem('cities');
      document.getElementById('weather_mods').innerHTML = '';
  };
  // $show_sb.addEventListener('touchstart', function() {
  //   if(app.sb.classList.length > 1) {
  //     app.sb.setAttribute('class','sb');
  //     app.cnt.setAttribute('class','cnt');
  //   } else {
  //     app.sb.setAttribute('class','sb sb-active');
  //     app.cnt.setAttribute('class','cnt cnt-active');
  //   }
  // }, true);

  // $close_sb.addEventListener('click', function() {
  //   if(app.sb.classList.length > 1) {
  //     app.sb.setAttribute('class','sb');
  //     app.cnt.setAttribute('class','cnt');
  //   } else {
  //     app.sb.setAttribute('class','sb sb-active');
  //     app.cnt.setAttribute('class','cnt cnt-active');
  //   }
  // });
  // $close_sb.addEventListener('touchstart', function() {
  //   if(app.sb.classList.length > 1) {
  //     app.sb.setAttribute('class','sb');
  //     app.cnt.setAttribute('class','cnt');
  //   } else {
  //     app.sb.setAttribute('class','sb sb-active');
  //     app.cnt.setAttribute('class','cnt cnt-active');
  //   }
  // });
  // $show_sb.addEventListener('click', function() {
  //   console.log('click event');
  //   if(app.sb.classList.length > 1) {
  //     app.sb.setAttribute('class','sb');
  //     app.cnt.setAttribute('class','cnt');
  //   } else {
  //     app.sb.setAttribute('class','sb sb-active');
  //     app.cnt.setAttribute('class','cnt cnt-active');
  //   }
  // }, false);
  // $show_sb.addEventListener('touchstart', function() {
  //   if(app.sb.classList.length > 1) {
  //     app.sb.setAttribute('class','sb');
  //     app.cnt.setAttribute('class','cnt');
  //   } else {
  //     app.sb.setAttribute('class','sb sb-active');
  //     app.cnt.setAttribute('class','cnt cnt-active');
  //   }
  // });
  $(document).on('pointerdown', '#show_sb', function(event) {
      // if(event.handled === false) return
      //   event.stopPropagation();
      //   event.preventDefault();
      //   event.handled = true;
      
      
      if(app.sb.classList.length > 1) {
        app.sb.setAttribute('class','sb');
        app.cnt.setAttribute('class','cnt');
      } else {
        app.sb.setAttribute('class','sb sb-active');
        app.cnt.setAttribute('class','cnt cnt-active');
      }
  });
  $(document).on('pointerdown', '#close_sb', function(event) {
      // if(event.handled === false) return
      //   event.stopPropagation();
      //   event.preventDefault();
      //   event.handled = true;

      if(app.sb.classList.length > 1) {
        app.sb.setAttribute('class','sb');
        app.cnt.setAttribute('class','cnt');
      } else {
        app.sb.setAttribute('class','sb sb-active');
        app.cnt.setAttribute('class','cnt cnt-active');
      }
  });
  // $del_store.addEventListener('click', removeModules);
  $(document).on('click touchstart', '#del_store', removeModules);

  $(document).on('submit touchstart', '#form', function(event){
    if(event.handled === false) return
        event.stopPropagation();
        event.preventDefault();
        event.handled = true;

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
  // $form.addEventListener('submit', function(e){
  //   e.preventDefault();
  //   let city = document.getElementById('citySearch').value;
  //   let state = document.getElementById('stateSearch').value;

  //   //set the input values equal to nothing
  //   document.getElementById('citySearch').value = '';
  //   document.getElementById('stateSearch').value = '';

  //   //if there are items in store account for them else set the new mod number equal to the first
  //   let new_module_number;
  //   if(localStorage.getItem('cities')) {
  //     new_module_number = Object.entries(JSON.parse(localStorage.getItem('cities'))).length + 1;
  //   } else {
  //     new_module_number = 1;
  //   }

  //   //create new city and store locally with values
  //   createNewCityAddAndStore(city, state, new_module_number);
  //   app.sb.setAttribute('class','sb');
  //   app.cnt.setAttribute('class','cnt');
  // });

  window.onload = function() {
      let new_obj = JSON.parse(localStorage.getItem('cities')) || {};
      window.newObj = new_obj;
      console.log('new_obj: ', Object.entries(new_obj));
      if(Object.entries(new_obj).length > 0) {
         Object.entries(new_obj).forEach((el, i) => { 
            createNewCityAddAndStore(el[0], el[1].state, i + 1);
        });
      } else {
          //continue
          // localStorage.setItem('cities', '{}');
      }
  }
  
