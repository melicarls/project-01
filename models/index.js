var mongoose = require("mongoose");
mongoose.connect( process.env.MONGOLAB_URI ||
                  process.env.MONGOHQ_URL ||
                  "mongodb://localhost/clotheme")

module.exports.User = require("./user");
module.exports.Item = require("./item");
