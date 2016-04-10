var weatherEndpoint = "http://api.wunderground.com/api/4fefd5989e452ef5/forecast/q/CA/San_Francisco.json";
var template;
var feelsLike = "Cold";
var isWindy=false;
var isRainy=true;
var userId="5709310e720ecb35422b76a5";
var userWardrobe;

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

  changeBackground(feelsLike, isRainy);

  $('.add-item').on('click', function(e) {
    console.log("clicked add item");
    $('#addModal').modal('show');
  });

  $('#saveItem').on('click', handleNewItemSubmit);

  $('#randomize').on('click', function(e) {
    e.preventDefault();
    var chosenTop = getRandomForToday(userWardrobe.tops);
    console.log("Chosen top", chosenTop);
    var chosenBottom = getRandomForToday(userWardrobe.bottoms);
    console.log("Chosen bottom", chosenBottom);
    $('#chosenTop').html('<h2>' + chosenTop.description + '</h2>');
    $('#chosenBottom').html('<h2>' + chosenBottom.description + '</h2>');
    $('#comment').html("<p> This would be a good outfit since it's so " + feelsLike.toLowerCase() + " out.")
  });

  //Delete item
  $('#wardrobeTarget').on('click', '.deleteButton', function(e) {
    console.log("clicked a delete icon");
    e.preventDefault();
    var $thisButton = $(this);
    var itemId = $thisButton.data('item-id');
    console.log("Deleting this thing:", itemId);
    var deleteUrl = '/api/users/' + userId + '/items/' + itemId;
    $thisButton.closest(".item").html("");
    $.ajax ({
      method: 'DELETE',
      url: deleteUrl,
      success: handleItemDelete
    });
  });

  //Edit item
  $('#wardrobeTarget').on('click', '.editButton', function(e) {
    console.log("clicked an edit icon");
    e.preventDefault();
    var formData = $(this).serialize();
    var $thisButton = $(this);
    var itemId = $thisButton.data('item-id');
    console.log("Updating this thing:", itemId);
    var putUrl = '/api/users/' + userId + '/items/' + itemId;
    $.ajax ({
      method: 'PUT',
      url: putUrl,
      success: handleItemUpdate
    });
  });

  //Log out and redirect to login page
  $('.logOut').on('click', function(e) {
    e.preventDefault();
    console.log("Clicked log out");
    $.ajax ({
      method: 'GET',
      url: "/logout",
      success: handleLogout(),
    });
  });

$('#showInfo').on('click', function(e) {
  e.preventDefault();
  $('#infoModal').modal('show');
});


});

function handleLogout() {
  window.location.href = "/login";
}

function handleItemUpdate(json) {
  console.log("Successfully got a response to update this item", json);
}

function handleItemDelete(json) {
  console.log("Deleted item", json);
}

function handleNewItemSubmit(e) {
  e.preventDefault();
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
  var toAdd = addHtmlFront + json.description + addHtmlBack;
  if (json.category === "Top") {
    $('#newTop').append(toAdd);
  } else if (json.category === "Bottom") {
    $('#newBottom').append(toAdd);
  }
}

function newItemError(err) {
  console.log("Post request returned this error: ", err);
}

function handleSuccess(json) {
  console.log("Page load got this data:", json);
  userWardrobe = json.wardrobe;
  console.log("Here's the wardrobe", userWardrobe);
  renderWardrobe(userWardrobe);
}

function handleError() {
  console.log("There was an error rendering the user's data");
}

function renderWardrobe(wardrobeObject) {
  console.log("Adding clothes");
  var wardrobeHtml = $('#wardrobe-template').html();
  var wardrobeTemplate = Handlebars.compile(wardrobeHtml);
  var html = wardrobeTemplate(wardrobeObject);
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
  $('#dateText').text(json.forecast.txt_forecast.forecastday[0].title);
  $('#weatherIcon').html('<img src=' + json.forecast.txt_forecast.forecastday[0].icon_url + '>');
  todayTemp = parseInt(json.forecast.simpleforecast.forecastday[0].high.fahrenheit);
  if (todayTemp < 50) {
    feelsLike = "Cold";
  } else if (todayTemp > 80) {
    feelsLike = "Hot";
  } else {
    feelsLike = "Mild";
  }
  var todayWind = json.forecast.simpleforecast.forecastday[0].avewind.mph;
  if (todayWind > 12) {
    isWindy = true;
  }
  var todayRain = json.forecast.simpleforecast.forecastday[0].pop;
  if (todayRain > 30) {
    isRainy = true;
  }
}

function onWeatherError() {
  console.log("Something went wrong. The weather could not be retrieved");
}

function getRandomForToday(clothesArr) {
  var todayOptions = [];
  if ((isWindy === true) && (isRainy === true)) {
    clothesArr.forEach(function (el, i, arr) {
      if ((el["temp"] === feelsLike) && (el["inWind"] === true) && (el["inRain"] === true)) {
        todayOptions.push(el);
      }
    });
  } else if ((isWindy === true) && (isRainy === false)) {
    clothesArr.forEach(function (el, i, arr) {
      if ((el["temp"] === feelsLike) && (el["inWind"] === true)) {
        todayOptions.push(el);
      }
    });
  } else if ((isWindy === false) && (isRainy === true)) {
    clothesArr.forEach(function (el, i, arr) {
      if ((el["temp"] === feelsLike) && (el["inRain"] === true)) {
        todayOptions.push(el);
      }
    });
  } else if ((isWindy === false) && (isRainy === false)) {
    clothesArr.forEach(function (el, i, arr) {
      if (el["temp"] === feelsLike) {
        todayOptions.push(el);
      }
    });
  }
  var randomIndex = (parseInt(Math.random() * todayOptions.length));
  var chosenItem = todayOptions[randomIndex];
  return chosenItem;
}

function changeBackground(currentWeather, currentRain) {
  if (currentRain === true) {
    document.body.style.backgroundImage = 'url(./images/rainy-background.jpg)';
    return;
  } else if (currentWeather === "Cold") {
    document.body.style.backgroundImage = 'url(./images/cold-background.jpg)';
  } else if (currentWeather === "Mild") {
    document.body.style.backgroundImage = 'url(./images/mild-background.jpg)';
  } else if (currentWeather === "Hot") {
    document.body.style.backgroundImage = 'url(./images/hot-background.jpg)';
  }
}

var addHtmlFront='<div class="item"><div id="accordion" role="tablist" aria-multiselectable="true"><div class="panel panel-default"><div class="panel-heading" role="tab" id="heading{{_id}}"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse{{_id}}" aria-expanded="false" aria-controls="collapse{{_id}}">';
var addHtmlBack='</a></h4></div><div id="collapse{{_id}}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading{{_id}}"><div class="form-group"><label class="control-label" for="editDescription">New description:</label><div><input id="editDescription" name="editDescription" type="text" class="form-control input-md" value="{{description}}" required></div></div><div class="form-group"><label class="control-label" for="editColor">Item color:</labelselect class="form-control" id="editColor" value="{{color}}">  <option value="Red">Red</option>  <option value="Orange">Orange</option>  <option value="Yellow">Yellow</option>  <option value="Green">Green</option>  <option value="Blue">Blue</option><option value="Purple">Purple</option></div><div class="form-group"><label class="control-label" for="editTemp">Temperature:</label><select class="form-control" id="editTemp" value={{temp}}><option>Hot</option><option>Mild</option><option>Cold</option></select></div><div class="checkbox"><label class="control-label" for="editInWind"><input id="editInWind" name="editInWind" type="checkbox" class="form-control" value={{inWind}}>Wearable in wind?</label></div><div class="checkbox"><label class="control-label" for="editInRain"><input id="editInRain" name="editInRain" type="checkbox" class="form-control" value={{inRain}}>  Wearable in rain?</label><div><div class="text-right"><button type="button" class="btn btn-info editButton" data-item-id="{{_id}}"><i class="fa fa-pencil"></i></button><button type="button" class="btn btn-danger deleteButton" data-item-id="{{_id}}"><i class="fa fa-ban"></i></button></div></div></div></div></div>';
