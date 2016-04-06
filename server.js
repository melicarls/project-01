var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// var controllers = require('./controllers');

//HTML Endpoint
app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

//JSON API Endpoints

//API
app.get('/api', controller.api.index);

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
