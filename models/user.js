var mongoose = require('mongoose');
var Schema = mongoose.Schema;
passportLocalMongoose = require('passport-local-mongoose');

var Item = require('./item.js');

var UserSchema = new Schema ({
  username: String,
  password: String,
  name: String,
  wardrobe: {
    tops: [ Item.schema ],
    bottoms: [ Item.schema ],
  }
});

UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', UserSchema);
module.exports = User;
