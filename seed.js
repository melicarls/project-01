var db = require("./models");

var testUsers = [];

testUsers.push({
  username: "test",
  password: "123",
  name: "Tester",
  wardrobe: {},
});

var sampleWardrobe = {
  tops: [
    {
        description: "Blue t-shirt",
        category: "Top",
        color: "Blue",
        type: "Short sleeve shirt",
        url: String,
        minTemp: 70,
        maxTemp: 90,
        inWind: true,
        inRain: false,
    },
    {
        description: "Black long sleeve",
        category: "Top",
        color: "Black",
        type: "Long sleeve shirt",
        url: String,
        minTemp: 30,
        maxTemp: 60,
        inWind: true,
        inRain: true,
    },
    {
        description: "Loose waterproof shirt",
        category: "Top",
        color: "Yellow",
        type: "Long sleeve shirt",
        url: String,
        minTemp: 50,
        maxTemp: 80,
        inWind: false,
        inRain: true,
    },
    {
        description: "Tank top",
        category: "Top",
        color: "Red",
        type: "Sleeveless shirt",
        url: String,
        minTemp: 70,
        maxTemp: 120,
        inWind: false,
        inRain: false,
    },
  ],
  bottoms: [
    {
        description: "Summer shorts",
        category: "Bottom",
        color: "Orange",
        type: "Shorts",
        url: String,
        minTemp: 60,
        maxTemp: 120,
        inWind: false,
        inRain: false,
    },
    {
        description: "Favorite jeans",
        category: "Bottom",
        color: "Blue",
        type: "Jeans",
        url: String,
        minTemp: 20,
        maxTemp: 90,
        inWind: true,
        inRain: true,
    },
    {
        description: "Long skirt with thick fabric",
        category: "Bottom",
        color: "Grey",
        type: "Long skirt",
        url: String,
        minTemp: 40,
        maxTemp: 120,
        inWind: true,
        inRain: false,
    },
    {
        description: "Short flowy skirt",
        category: "Bottom",
        color: "Purple",
        type: "Short skirt",
        url: String,
        minTemp: 40,
        maxTemp: 120,
        inWind: false,
        inRain: true,
    },
  ],
  fullBody: [
    {
        description: "Sparkly cocktail dress",
        category: "Full Body",
        color: "Red",
        type: "Short dress",
        url: String,
        minTemp: 60,
        maxTemp: 90,
        inWind: true,
        inRain: true,
    },
  ],
};

testUsers.forEach(function(user) {
  user.wardrobe = sampleWardrobe;
});


db.User.remove({}, function(err, users){

  db.User.create(testUsers, function(err, users){
    if (err) {return console.log("Seed user error", err);}
    console.log("All users:", users);
    console.log("Created", users.length, "users");
    process.exit();

  });

});
