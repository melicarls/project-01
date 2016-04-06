var weatherEndpoint = "http://api.wunderground.com/api/4fefd5989e452ef5/forecast/q/CA/San_Francisco.json";
var template;


$(document).ready(function() {
  console.log('app.js loaded!');

  $userData = $('#userTarget');

  var source = $('#user-template').html();
  template = Handlebars.compile(source);

  $.ajax({
    method: 'GET',
    url: '/api/:user_id/',
    success: handleSuccess,
    error: handleError,
  });

});

function handleSuccess() {

}

function handleError() {
  console.log("There was an error rendering the user's data");
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
