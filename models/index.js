var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/clotheme");

module.exports.User = require("./user");
module.exports.Item = require("./item");
