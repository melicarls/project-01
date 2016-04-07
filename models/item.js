var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ItemSchema = new Schema ({
  description: String,
  category: String,
  color: String,
  type: String,
  url: String,
  temp: String,
  inWind: Boolean,
  inRain: Boolean,
});

var Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
