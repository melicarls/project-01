App Name


**Short explanation of the project**

This application stores a user's wardrobe with information on the type of weather conditions that each item can be worn in. Through a connection to the Weather Underground API, the app generates a randomly selected outfit for the day that would be appropriate given the forecasted conditions.


**Link to project hosted on Heroku**

https://quiet-garden-76572.herokuapp.com/


**Technologies Used**

- HTML5 & CSS
- Node Server
- Express
- Mongo Database
- Handlebars (front end & back end)
- Mongoose
- Body Parser
- Cookie Parser
- Passport
- Controllers
- Models


**Existing Features**

- Connection to Weather Underground API
- Classification of weather:
  - Cold temp: under 50°F
  - Mild temp: 51°F - 79°F
  - Hot temp: over 80°F
  - Windy: over 12mph
  - Rainy: over 30% chance
- Create new user profile or log in to existing account
- Demo account that can be populated using node seed.js
- Fully CRUDable wardrobe for each user that accepts the following information for each item: description, ideal temperature, color, and whether it can be worn in rain or wind
- Get random outfit button that displays a weather appropriate outfit based on reported conditions from Weather Underground
- Daily forecast as well as weather information for the next 2 days and nights, pulled and rendered from Weather Underground
- Edit dropdown menu is auto-populated with the properties of each wardrobe item
- Page background changes based on temperature (cold, hot, mild) or forecasted rain
- Bootstrap styling (including modals, buttons, accordions, forms, and checkboxes)


**Planned Features**

- Image icons for each wardrobe item
- Display wardrobe items on an avatar when chosen by the GetOutfit algorithm
- Show full information associated with each wardrobe item on hover
- Accept city input, get weather for that city
- Allow user to set their own weather thresholds (what constitutes cold, mild or hot weather, when it is considered rainy, when it is considered windy)
- Set outfit rules: ex. certain colors that can't be worn together


**Screenshot(s)**
