
var weatherEndpoint = "https://api.wunderground.com/api/4fefd5989e452ef5/forecast/q/CA/San_Francisco.json";
var template;
var feelsLike = "Mild";
// These need to default false. They'll be changed to true by get weather success function.
var isWindy=false;
var isRainy=false;
var userId="570ad3a1b7fe0edf610662a9";
var userWardrobe;
var user;

$(document).ready(function() {
  console.log('app.js loaded!');
  $userData = $('#wardrobeTarget');
  var source = $('#wardrobe-template').html();
  template = Handlebars.compile(source);

  getWeather();

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

  $('#randomize').on('click', function(e) {
    e.preventDefault();
    console.log("Clicked get random outfit");
    var chosenTop = getRandomForToday(userWardrobe.tops);
    if (chosenTop === undefined) {
      $('#chosenTop').html("<h2>You don't have any appropriate shirts for today's weather. Try entering more wardrobe items.</h2>");
      return;
    }
    var chosenBottom = getRandomForToday(userWardrobe.bottoms);
    if (chosenBottom === undefined) {
      $('#chosenBottom').html("<h2>You don't have any appropriate bottoms for today's weather. Try entering more wardrobe items.</h2>");
      return;
    }
    $('#chosenTop').html('<h2>' + chosenTop.description + '</h2>');
    $('#chosenBottom').html('<h2>' + chosenBottom.description + '</h2>');
    $('#comment').html("<p> This would be a good outfit since it's so " + feelsLike.toLowerCase() + " out.");
  });

  //Delete item
  $('#wardrobeTarget').on('click', '.deleteButton', function(e) {
    e.preventDefault();
    var $thisButton = $(this);
    var itemId = $thisButton.data('item-id');
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
    var $thisButton = $(this);
    var itemId = $thisButton.data('item-id');
    var newDesc = $('#editDescription'+itemId).val();
    var newCat = $thisButton.data('cat');
    var newColor = $('#editColor'+itemId).val();
    var newTemp = $('#editTemp'+itemId).val();
    var newInWind = $('#editInWind'+itemId).val();
    var newInRain = $('#editInRain'+itemId).val();
    $thisButton.closest(".item").html("");
    var sendThis = {
      description: newDesc,
      category: newCat,
      color: newColor,
      temp: newTemp,
      inWind: newInWind,
      inRain: newInRain
    };
    var putUrl = '/api/users/' + userId + '/items/' + itemId;
    $.ajax ({
      method: 'PUT',
      url: putUrl,
      data: sendThis,
      success: handleItemUpdate
    });
  });

  //Log out and redirect to login page
  $('.logOut').on('click', function(e) {
    e.preventDefault();
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

  $('#wardrobeTarget').on('click', '.panel-title', function(e) {
    var item = $(this).closest($('.item'));
    setColor(item);
    setTemp(item);
    setWind(item);
    setRain(item);
  });


});


function handleLogout() {
  window.location.href = "/login";
}

function handleItemUpdate(json) {
  var toAdd = addHtmlFirst + json.description + addHtmlSecond + json._id + addHtmlThird + json._id + addHtmlFourth;
  if (json.category === "Top") {
    $('#newTop').append(toAdd);
  } else if (json.category === "Bottom") {
    $('#newBottom').append(toAdd);
  }
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
  $('#itemDescription').val('');
  $('#itemCategory').val('');
  $('#itemColor').val('');
  $('#itemTemp').val('');
  $('#addModal').modal('hide');
  var toAdd = addHtmlFirst + json.description + addHtmlSecond + json._id + addHtmlThird + json._id + addHtmlFourth;
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
  user = json;
  name = json.username;
  $('#nameHere').append(name + "!");
  userWardrobe = json.wardrobe;
  renderWardrobe(userWardrobe);
}

function handleError() {
  console.log("There was an error rendering the user's data");
}

function renderWardrobe(wardrobeObject) {
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
  $('#weatherText').text(json.forecast.txt_forecast.forecastday[0].fcttext);
  $('#dateText').prepend(json.forecast.txt_forecast.forecastday[0].title);
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
  $('#firstTitle').text(json.forecast.txt_forecast.forecastday[1].title);
  $('#firstForecast').text(json.forecast.txt_forecast.forecastday[1].fcttext);
  $('#secondTitle').text(json.forecast.txt_forecast.forecastday[2].title);
  $('#secondForecast').text(json.forecast.txt_forecast.forecastday[2].fcttext);
  $('#thirdTitle').text(json.forecast.txt_forecast.forecastday[3].title);
  $('#thirdForecast').text(json.forecast.txt_forecast.forecastday[3].fcttext);
  $('#fourthTitle').text(json.forecast.txt_forecast.forecastday[4].title);
  $('#fourthForecast').text(json.forecast.txt_forecast.forecastday[4].fcttext);
  $('#fifthTitle').text(json.forecast.txt_forecast.forecastday[5].title);
  $('#fifthForecast').text(json.forecast.txt_forecast.forecastday[5].fcttext);
  changeBackground(feelsLike, isRainy);
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

function setColor(item) {
  var itemId = item.data('item-id');
  if (item.data('item-color') === "Red") {
  item.find($('option.Red')).prop('selected', true);
  } else if (item.data('item-color') === "Orange") {
    item.find($('option.Orange')).prop('selected', true);
  } else if (item.data('item-color') === "Yellow") {
    item.find($('option.Yellow')).prop('selected', true);
  } else if (item.data('item-color') === "Green") {
    item.find($('option.Green')).prop('selected', true);
  } else if (item.data('item-color') === "Blue") {
    item.find($('option.Blue')).prop('selected', true);
  } else if (item.data('item-color') === "Purple") {
    item.find($('option.Purple')).prop('selected', true);
  } else if (item.data('item-color') === "White") {
    item.find($('option.White')).prop('selected', true);
  } else if (item.data('item-color') === "Grey") {
    item.find($('option.Grey')).prop('selected', true);
  } else if (item.data('item-color') === "Black") {
    item.find($('option.Black')).prop('selected', true);
  }
}

function setTemp(item) {
  if (item.data('item-temp') === "Cold") {
    item.find($('option.Cold')).prop('selected', true);
  } else if (item.data('item-temp') === "Mild") {
    item.find($('option.Mild')).prop('selected', true);
  } else if (item.data('item-temp') === "Hot") {
    item.find($('option.Hot')).prop('selected', true);
  }
}

function setWind(item) {
  if (item.data('item-inwind') === true) {
    item.find($('input.inwind')).prop('checked', true);
  } else if (item.data('item-inwind') === false) {
    item.find($('input.inwind')).prop('checked', false);
  }
}

function setRain(item) {
  if (item.data('item-inrain') === true) {
    item.find($('input.inrain')).prop('checked', true);
  } else if (item.data('item-inrain') === false) {
    item.find($('input.inrain')).prop('checked', false);
  }
}

var addHtmlFirst='<div class="item"><div id="accordion" role="tablist" aria-multiselectable="true"><div class="panel panel-default"><div class="panel-heading" role="tab" id="heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse" aria-expanded="false" aria-controls="collapse">';
var addHtmlSecond='</a></h4></div><div id="collapse" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading"><div class="form-group"><label class="control-label" for="editDescription">New description:</label><div><input id="editDescription" name="editDescription" type="text" class="form-control input-md" required></div></div><div class="form-group"><label class="control-label" for="editColor">Item color:</labelselect class="form-control" id="editColor">  <option value="Red">Red</option>  <option value="Orange">Orange</option><option value="Yellow">Yellow</option><option value="Green">Green</option><option value="Blue">Blue</option><option value="Purple">Purple</option></div><div class="form-group"><label class="control-label" for="editTemp">Temperature:</label><select class="form-control" id="editTemp"><option>Hot</option><option>Mild</option><option>Cold</option></select></div><div class="checkbox"><label class="control-label" for="editInWind"><input id="editInWind" name="editInWind" type="checkbox" class="form-control">Wearable in wind?</label></div><div class="checkbox"><label class="control-label" for="editInRain"><input id="editInRain" name="editInRain" type="checkbox" class="form-control">Wearable in rain?</label><div><div class="text-right"><button type="button" class="btn btn-info editButton" data-item-id="';
var addHtmlThird='"><i class="fa fa-pencil"></i></button><button type="button" class="btn btn-danger deleteButton" data-item-id="';
var addHtmlFourth='"><i class="fa fa-ban"></i></button></div></div></div></div></div>;';
