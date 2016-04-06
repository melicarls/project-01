var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/clotheme");

module.exports.User = require("./user.js");
module.exports.Song = require("./user.js");
