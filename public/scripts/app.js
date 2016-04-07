var weatherEndpoint = "http://api.wunderground.com/api/4fefd5989e452ef5/forecast/q/CA/San_Francisco.json";
var template;
var todayTemp;
var isWindy;
var isRainy;
var userId = "5706a2259d5786e10095ff0f";

$(document).ready(function() {
  console.log('app.js loaded!');

  $userData = $('#wardrobeTarget');

  var source = $('#wardrobe-template').html();
  template = Handlebars.compile(source);

  // getWeather();

  $.ajax({
    method: "GET",
    url: '/api/users/' + userId,
    success: handleSuccess,
    error: handleError,
  });

  $('.add-item').on('click', function(e) {
    console.log("clicked add item");
    $('#addModal').modal('show');
  });

  $('#saveItem').on('click', handleNewItemSubmit);

});

function handleNewItemSubmit(e) {
  console.log("New item submit triggered");
  e.preventDefault();
  //Manually set variables for all new item values
  var newDescription = $('#itemDescription').val();
  var newCategory = $('#itemCategory').val();
  var newColor = $('#itemColor').val();
  var newTemp = $('#itemTemp').val();
  if ($('#inRain').is(':checked')) {
    newRain = true;
  } else {
    newRain = false;
  }
  if ($('#inWind').is(':checked')) {
    newWind = true;
  } else {
    newWind = false;
  }
  thisUrl = '/api/users/' + userId + '/items';
  $.ajax ({
    method: 'POST',
    url: thisUrl,
    data: {
      description: newDescription,
      category: newCategory,
      color: newColor,
      temp: newTemp,
      inWind: newWind,
      inRain: newRain,
    },
    success: newItemSuccess,
    error: newItemError,
  });
}

function newItemSuccess(json) {
  console.log("Got this data from POST route", json);
  $('#itemDescription').val('');
  $('#itemCategory').val('');
  $('#itemColor').val('');
  $('#itemTemp').val('');
  $('#addModal').modal('hide');
}

function newItemError(err) {
  console.log("Post request returned this error: ", err);
}

function handleSuccess(json) {
  console.log(json);
  renderWardrobe(json.wardrobe);
}

function handleError() {
  console.log("There was an error rendering the user's data");
}

function renderWardrobe(wardrobeArray) {
  console.log("Adding clothes");
  var wardrobeHtml = $('#wardrobe-template').html();
  var wardrobeTemplate = Handlebars.compile(wardrobeHtml);
  var html = wardrobeTemplate(wardrobeArray);
  $('#wardrobeTarget').prepend(html);
}

function getWeather() {$.ajax({
  method: "GET",
  url: weatherEndpoint,
  success: onWeatherSuccess,
  error: onWeatherError,
  });
}

function onWeatherSuccess(json) {
  console.log("onSuccess was called because we got weather from WU");
  $('#weatherText').text(json.forecast.txt_forecast.forecastday[0].fcttext);
  $('#weatherIcon').html('<img src=' + json.forecast.txt_forecast.forecastday[0].icon_url + '>');
  todayTemp = parseInt(json.forecast.simpleforecast.forecastday[0].high.fahrenheit);
  var todayWind = json.forecast.simpleforecast.forecastday[0].avewind.mph;
  if (todayWind > 12) {
    isWindy = true;
  }
  var todayRain = json.forecast.simpleforecast.forecastday[0].pop;
  if (todayRain > 30) {
    isRainy = true;
  }
  console.log("Today temp", todayTemp);
  console.log("Today wind", todayWind);
  console.log("Today rain", todayRain);
}

function onWeatherError() {
  console.log("Something went wrong. The weather could not be retrieved");
}
