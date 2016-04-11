
var weatherEndpoint = "https://api.wunderground.com/api/4fefd5989e452ef5/forecast/q/CA/San_Francisco.json";
var template;
var feelsLike;
// These need to default false. They'll be changed to true by get weather success function.
var isWindy=false;
var isRainy=false;
var userId;
var user;

$(document).ready(function() {
  console.log('app.js loaded!');

  user = window.user;
  if (user === null) {
    window.location.href = "/login";
  } else {

    userId = window.user["_id"];
  $('#nameHere').append((window.user["username"]) + "!");

  $.ajax({
    method: "GET",
    url: '/api/users/' + userId,
    success: handleSuccess,
    error: handleError,
  });

  $userData = $('#wardrobeTarget');
  var topSource = $('#top-template').html();
  topTemplate = Handlebars.compile(topSource);
  var bottomSource = $('#bottom-template').html();
  bottomTemplate = Handlebars.compile(bottomSource);

  getWeather();

  $('.add-item').on('click', function(e) {
    $('#addModal').modal('show');
  });

  $('#saveItem').on('click', handleNewItemSubmit);

  $('#randomize').on('click', function(e) {
    e.preventDefault();
    var chosenTop = getRandomForToday(user.wardrobe.tops);
    if (chosenTop === undefined) {
      $('#chosenTop').html("<h2>You don't have any appropriate shirts for today's weather. Try entering more wardrobe items.</h2>");
      return;
    }
    var chosenBottom = getRandomForToday(user.wardrobe.bottoms);
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
    e.preventDefault();
    var $thisButton = $(this);
    var itemId = $thisButton.data('item-id');
    var newDesc = $('#editDescription'+itemId).val();
    if (newDesc.length === 0) {
      alert("You can't save without a description.");
      return;
    }
    var newCat = $thisButton.data('cat');
    var newColor = $('#editColor'+itemId).val();
    var newTemp = $('#editTemp'+itemId).val();
    var newInWind = false;
    if ($('#editInWind'+itemId).is(':checked')) {
      newInWind = true;
    }
    var newInRain = false;
    if ($('#editInRain'+itemId).is(':checked')) {
      newInRain = true;
    }
    $thisButton.closest(".item").html("");
    // This if statement removes the top from the array that the "Get Outfit" button references
    if ($thisButton.data('cat') === "Top") {
      user.wardrobe.tops.forEach(function (el, i, arr) {
        if (el["_id"] === itemId) {
          arr.splice(i, 1);
        }
      });
    } else if ($thisButton.data('cat') === "Bottom") {
      user.wardrobe.tops.forEach(function (el, i, arr) {
        if (el["_id"] === itemId) {
          arr.splice(i, 1);
        }
      });
    }
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
      success: handleLogout,
    });


  });

  $('#showInfo').on('click', function(e) {
    e.preventDefault();
    $('#infoModal').modal('show');
  });

  $('#wardrobeTarget').on('click', '.panel-title', function(e) {
    var item = $(this).closest($('.item'));
    setDropdowns(item);
  });

}

});

function handleLogout() {
  window.location.href = "/login";
}

function handleItemUpdate(json) {
  if (json.category === "Top") {
    renderWardrobeTops( [json] );
    user.wardrobe.tops.push(json);
  } else {
    renderWardrobeBottoms( [json] );
    user.wardrobe.bottoms.push(json);
  }
}

function handleItemDelete(json) {
  console.log("Deleted item", json);
}

function handleNewItemSubmit(e) {
  e.preventDefault();
  var newDescription = $('#itemDescription').val();
  if (newDescription.length === 0) {
    alert("You can't save without a description.");
    return;
  }
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
  if (json.category === "Top") {
    renderWardrobeTops( [json] );
    user.wardrobe.tops.push(json);
  } else {
    renderWardrobeBottoms( [json] );
    user.wardrobe.bottoms.push(json);
  }
}

function newItemError(err) {
  console.log("Post request returned this error: ", err);
}

function handleSuccess(json) {
  user = json;
  userId = user._id;
  renderWardrobeTops(json.wardrobe.tops);
  renderWardrobeBottoms(json.wardrobe.bottoms);
}

function handleError() {
  console.log("There was an error rendering the user's data");
}

function renderWardrobeTops(wardrobeArray) {
  wardrobeArray.forEach(function (el, i, arr) {
  var wardrobeHtml = $('#top-template').html();
  var wardrobeTemplate = Handlebars.compile(wardrobeHtml);
  var html = wardrobeTemplate(el);
  $('#tops').append(html);
  });
}

function renderWardrobeBottoms(wardrobeArray) {
  wardrobeArray.forEach(function (el, i, arr) {
  var wardrobeHtml = $('#bottom-template').html();
  var wardrobeTemplate = Handlebars.compile(wardrobeHtml);
  var html = wardrobeTemplate(el);
  $('#bottoms').append(html);
  });
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
  $('#weatherText').text("Uh oh, something went wrong. The weather could not be retrieved");
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

function setDropdowns(item) {
  setColor(item);
  setTemp(item);
  setWind(item);
  setRain(item);
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
