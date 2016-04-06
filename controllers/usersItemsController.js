var db = require('..models');
var bodyParser = require('body-parser');

function create(req, res) {
  console.log("Reached create item route.");
  console.log("Params", req.params);
  console.log("Body", req.body);
  db.User.findById(req.params.user_id, function(err, foundUser) {
    if (err) {
      res.status(404).json({error: err.message});
    }
    var newItem = new db.Item(req.body);
    foundUser.wardrobe.push(newItem);
    foundUser.save(function(err, savedItem){
      if (err) {
        return console.log("Save error:", err);
      }
      res.json(savedUser);
    });
  });
}


//Public exports go here
module.exports = {
  create: create,
}
