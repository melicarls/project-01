function index(req, res) {
  res.json({
    message: "Welcome to my first project!",
    documentation_url: "https://github.com/melicarls/project-01/README.md",
    base_url: "TBD",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints for this project"}
    ]
  });
}

module.exports.index = index;
