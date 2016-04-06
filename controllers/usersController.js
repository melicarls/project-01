var db = require('..models');
var bodyParser = require('body-parser');

function create(req, res) {
  console.log("Reached create user route");
  console.log("Params", req.params);
  console.log("Body", req.body);
  var newUser = new db.User(req.body);
  newUser.save(function (err, savedUser){
    if (err) {
      return console.log("Error ", err);
    }
    res.json(savedUser);
  });
}
