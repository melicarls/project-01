var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Item = require('./item.js');

var UserSchema = new Schema ({
  username: String,
  password: String,
  name: String,
  wardrobe: {
    tops: [ Item.schema ],
    bottoms: [ Item.schema ],
    fullBody: [Item.schema]
  }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
