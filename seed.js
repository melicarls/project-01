var db = require("./models");

var testUsers = [];

testUsers.push({
  username: "Guest",
  password: "123",
  name: "Guest User",
  wardrobe: {
    tops: [
      {
          description: "Blue t-shirt",
          category: "Top",
          color: "Blue",
          temp: "Mild",
          inWind: true,
          inRain: false,
      },
      {
          description: "Blue sweater",
          category: "Top",
          color: "Blue",
          temp: "Cold",
          inWind: true,
          inRain: true,
      },
      {
          description: "Purple shirt",
          category: "Top",
          color: "Purple",
          temp: "Cold",
          inWind: true,
          inRain: true,
      },
      {
          description: "Red t-shirt",
          category: "Top",
          color: "Red",
          temp: "Mild",
          inWind: true,
          inRain: false,
      },
      {
          description: "Orange t-shirt",
          category: "Top",
          color: "Orange",
          temp: "Mild",
          inWind: true,
          inRain: false,
      },
      {
          description: "Yellow t-shirt",
          category: "Top",
          color: "Yellow",
          temp: "Mild",
          inWind: true,
          inRain: false,
      },
      {
          description: "Black long sleeve",
          category: "Top",
          color: "Black",
          temp: "Cold",
          inWind: true,
          inRain: true,
      },
      {
          description: "Waterproof shirt",
          category: "Top",
          color: "Yellow",
          temp: "Cold",
          inWind: false,
          inRain: true,
      },
      {
          description: "Tank top",
          category: "Top",
          color: "Red",
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
          temp: "Hot",
          inWind: false,
          inRain: false,
      },
      {
          description: "Favorite jeans",
          category: "Bottom",
          color: "Blue",
          temp: "Cold",
          inWind: true,
          inRain: true,
      },
      {
          description: "Lighter jeans",
          category: "Bottom",
          color: "Blue",
          temp: "Mild",
          inWind: true,
          inRain: true,
      },
      {
          description: "Jean capris",
          category: "Bottom",
          color: "Blue",
          temp: "Mild",
          inWind: true,
          inRain: true,
      },
      {
          description: "Long skirt",
          category: "Bottom",
          color: "Grey",
          temp: "Mild",
          inWind: true,
          inRain: false,
      },
      {
          description: "Short skirt",
          category: "Bottom",
          color: "Purple",
          temp: "Hot",
          inWind: false,
          inRain: true,
      },
      {
          description: "Wool skirt",
          category: "Bottom",
          color: "Grey",
          temp: "Cold",
          inWind: true,
          inRain: true,
      },
    ],
  }
});

db.User.remove({}, function(err, users){
  var new_user = testUsers[0];
  db.User.register(new_user, new_user.password,
    function (err, newUser) {
      if (err) {return console.log("Seed user error", err);}
      console.log("All users:", users);
      process.exit();
    }
  );
});
