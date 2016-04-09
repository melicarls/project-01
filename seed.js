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
        temp: "Mild",
        inWind: true,
        inRain: false,
    },
    {
        description: "Red t-shirt",
        category: "Top",
        color: "Red",
        type: "Short sleeve shirt",
        url: String,
        temp: "Mild",
        inWind: true,
        inRain: false,
    },
    {
        description: "Orange t-shirt",
        category: "Top",
        color: "Orange",
        type: "Short sleeve shirt",
        url: String,
        temp: "Mild",
        inWind: true,
        inRain: false,
    },
    {
        description: "Yellow t-shirt",
        category: "Top",
        color: "Yellow",
        type: "Short sleeve shirt",
        url: String,
        temp: "Mild",
        inWind: true,
        inRain: false,
    },
    {
        description: "Black long sleeve",
        category: "Top",
        color: "Black",
        type: "Long sleeve shirt",
        url: String,
        temp: "Cold",
        inWind: true,
        inRain: true,
    },
    {
        description: "Loose waterproof shirt",
        category: "Top",
        color: "Yellow",
        type: "Long sleeve shirt",
        url: String,
        temp: "Cold",
        inWind: false,
        inRain: true,
    },
    {
        description: "Tank top",
        category: "Top",
        color: "Red",
        type: "Sleeveless shirt",
        url: String,
        temp: "Hot",
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
        temp: "Hot",
        inWind: false,
        inRain: false,
    },
    {
        description: "Favorite jeans",
        category: "Bottom",
        color: "Blue",
        type: "Jeans",
        url: String,
        temp: "Cold",
        inWind: true,
        inRain: true,
    },
    {
        description: "Lighter jeans",
        category: "Bottom",
        color: "Blue",
        type: "Jeans",
        url: String,
        temp: "Mild",
        inWind: true,
        inRain: true,
    },
    {
        description: "Jean capris",
        category: "Bottom",
        color: "Blue",
        type: "Jeans",
        url: String,
        temp: "Mild",
        inWind: true,
        inRain: true,
    },
    {
        description: "Long skirt",
        category: "Bottom",
        color: "Grey",
        type: "Long skirt",
        url: String,
        temp: "Mild",
        inWind: true,
        inRain: false,
    },
    {
        description: "Short skirt",
        category: "Bottom",
        color: "Purple",
        type: "Short skirt",
        url: String,
        temp: "Hot",
        inWind: false,
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
