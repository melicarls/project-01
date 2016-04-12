var express = require('express');
    app = express();
    bodyParser = require('body-parser');
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

    controllers = require('./controllers');
    var db = require('./models'),
      Item = db.Item,
      User = db.User;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'unicorns',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'hbs');

//AUTH Routes
app.get('/', function (req, res) {
  res.render('index', {user: JSON.stringify(req.user ) + "|| null"});
});

app.get('/signup', function (req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('signup');
});

app.get('/login', function (req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('login');
});

app.post('/signup', function (req, res) {
  console.log("Reached signup route and here's the request ", req);
  console.log("Here's the response", res);
  var new_user = new User({ username: req.body.username });
  User.register(new_user, req.body.password,
    function (err, newUser) {
      passport.authenticate('local')(req, res, function() {
        console.log("Signup success!");
        res.redirect('/');
      });
    }
  );
});

app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login'}));

//Logs out users
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

//JSON API Endpoints
//API
app.get('/api', controllers.api.index);
//Show user data
app.get('/api/users/:user_id', controllers.users.show);
//CRUD wardrobe
app.post('/api/users/:user_id/items', controllers.items.create);
app.delete('/api/users/:user_id/items/:item_id', controllers.items.destroy);
app.get('/api/users/:user_id/items/:item_id', controllers.items.show);
app.put('/api/users/:user_id/items/:item_id', controllers.items.update);

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
