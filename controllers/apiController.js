function index(req, res) {
  res.json({
    message: "Welcome to my first project!",
    documentation_url: "https://github.com/melicarls/project-01/README.md",
    base_url: "TBD",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints for this project"},
      {method: "GET", path: "/api/users/:user_id", description: "Shows all data associated with a specific user"},
      {method: "GET", path: "/api/users/:user_id/items/:item_id", description: "Gets one specific wardrobe item"},
      {method: "PUT", path: "/api/users/:user_id/items/:item_id", description: "Edits (by overwriting) an existing item in a specific user's wardrobe"},
      {method: "POST", path: "/api/users/:user_id/items", description: "Adds a new item to a specific user's wardrobe"},
      {method: "DELETE", path: "/api/users/:user_id/items/:item_id", description: "Finds an item in a specific user's wardrobe and deletes it"},
    ]
  });
}

module.exports.index = index;
