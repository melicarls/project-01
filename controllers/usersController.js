var db = require('../models');
var bodyParser = require('body-parser');

function create(req, res) {
  var newUser = new db.User(req.body);
  newUser.save(function (err, savedUser){
    if (err) {
      return console.log("Error ", err);
    }
    res.json(savedUser);
  });
}

function show(req, res) {
  var userId = req.params.user_id;
  db.User.findById(userId)
    .exec(function(err, foundUser) {
      if (err) {
        res.status(404).json(err.message);
      }
      res.json(foundUser);
    });
}

module.exports = {
  create: create,
  show: show,
};
