var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/clotheme");

module.exports.User = require("./user.js");
module.exports.Item = require("./item.js");
