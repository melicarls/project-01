var weatherEndpoint = "http://api.wunderground.com/api/4fefd5989e452ef5/forecast/q/CA/San_Francisco.json";

$(document).ready(function() {
  console.log('app.js loaded!');

  getWeather();

});


  function getWeather() {$.ajax({
    method: "GET",
    url: weatherEndpoint,
    success: onSuccess,
    error: onError,
    });
  }

function onSuccess(json) {
  console.log("onSuccess was called because we got weather from WU");
  console.log(json);
  $('#weatherText').text(json.forecast.txt_forecast.forecastday[0].fcttext);
}

function onError() {
  alert("Something went wrong. The weather could not be found");
}
