var db = require('../models');
var bodyParser = require('body-parser');

function create(req, res) {
  db.User.findById(req.params.user_id, function(err, foundUser) {
    if (err) {
      res.status(404).json({error: err.message});
    }
    var newItem = new db.Item(req.body);
    if (newItem.category === "Top") {
      foundUser.wardrobe.tops.push(newItem);
    } else if (newItem.category === "Bottom") {
      foundUser.wardrobe.bottoms.push(newItem);
    }
    foundUser.save(function(err, savedItem){
      if (err) {
        return console.log("Save error:", err);
      }
      res.json(newItem);
    });
  });
}

function destroy(req, res) {
  db.User.findById(req.params.user_id, function(err, foundUser) {
    foundUser.wardrobe.tops.forEach(function (el, i, arr) {
      console.log("Element", el._id);
      console.log("Params", req.params.item_id);
      if (el._id == req.params.item_id) {
        console.log("Got one!");
        el.remove();
        foundUser.save(function(err, saved) {
          if (err) {
            console.log("Save error ", err);
          } else {
            res.json(foundUser.wardrobe);
          }
        });
      }
    });
    foundUser.wardrobe.bottoms.forEach(function (el, i, arr) {
      if (el._id == req.params.item_id) {
        el.remove();
        foundUser.save(function(err, saved) {
          if (err) {
            console.log("Save error ", err);
          } else {
            res.json(foundUser.wardrobe);
          }
        });
      }
    });
  });
}

function update(req, res) {
  console.log("Reached update route");
  db.User.findById(req.params.user_id, function(err, foundUser) {
    console.log("Request", req);
    console.log("User", foundUser);
    foundUser.wardrobe.tops.forEach(function (el, i, arr) {
      console.log("Element", el._id);
      console.log("Params", req.params.item_id);
      if (el._id == req.params.item_id) {
        console.log("Found the item to update!");
        el.description = req.body.description;
        el.category = req.body.category;
        el.color = req.body.color;
        el.temp = req.body.temp;
        el.inWind = req.body.inWind;
        el.inRain = req.body.inRain;
        foundUser.save(function(err, saved) {
          if (err) {
            console.log("Save error ", err);
          } else {
            res.json(el);
          }
        });
      }
    });
    foundUser.wardrobe.bottoms.forEach(function (el, i, arr) {
      if (el._id == req.params.item_id) {
        console.log("Found the item to update!");
        el.description = req.body.description;
        el.category = req.body.category;
        el.color = req.body.color;
        el.temp = req.body.temp;
        el.inWind = req.body.inWind;
        el.inRain = req.body.inRain;
        foundUser.save(function(err, saved) {
          if (err) {
            console.log("Save error ", err);
          } else {
            res.json(el);
          }
        });
      }
    });
  });
}

//Public exports go here
module.exports = {
  create: create,
  destroy: destroy,
  update: update,
};
