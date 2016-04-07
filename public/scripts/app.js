var weatherEndpoint = "http://api.wunderground.com/api/4fefd5989e452ef5/forecast/q/CA/San_Francisco.json";
var template;


$(document).ready(function() {
  console.log('app.js loaded!');

  $userData = $('#wardrobeTarget');

  var source = $('#wardrobe-template').html();
  template = Handlebars.compile(source);

  // getWeather(); Commented out so I don't overuse my key

  var userId = "5705a6e8d67720f477b4d3cc";

  $.ajax({
    method: "GET",
    url: '/api/users/' + userId,
    success: handleSuccess,
    error: handleError,
  });

});

function handleSuccess(json) {
  console.log(json);
  renderWardrobe(json.wardrobe);
}

function handleError() {
  console.log("There was an error rendering the user's data");
}

function renderWardrobe(wardrobeArray) {
  console.log("Adding clothes");
  //Add clothing to wardrobe section of page
  //Display them using for each
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
  console.log(json);
  $('#weatherText').text(json.forecast.txt_forecast.forecastday[0].fcttext);
}

function onWeatherError() {
  console.log("Something went wrong. The weather could not be retrieved");
}
