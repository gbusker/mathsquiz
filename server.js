const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

require('./app/models/db')
require('./app/models/team')
const Team = mongoose.model('Team')

// Set up the pug view engine
app.set('views', './app/views');
app.set('view engine', 'pug');

// Parser
app.use(bodyParser.urlencoded({ extended: true }))

// Start server on port 3000
app.listen(3000, function() {
  console.log("Server started.");
});

// Serve static assets from "public"
app.use(express.static('public'));

// Serve templates
app.get('/', function(req, res) {
  res.render('index', {});
});

app.get('/admin', function(req, res) {
  Team.find().exec(function(err, teams){
    res.render('admin', { teams: teams, team: '' });
  })
});

app.post('/admin', function(req, res) {
  const team = new Team({name: req.body.team.name})
  team.save(function (err) {
    if (err) {
      console.log('save error: ' + err);
    }
  })
  return res.redirect('/admin')
})
