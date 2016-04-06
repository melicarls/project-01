$(document).ready(function() {
  console.log('app.js loaded!');

});


  function getWeather() {$.ajax({
    method: "GET",
    url: weatherendpoint,
    success: onSuccess,
    error: onError,
    });
  }
