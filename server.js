const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const fs = require('fs')
const join = require('path').join;
const moment = require('moment')

// Bootstrap models
const models = join(__dirname, 'app/models');
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

var Team = mongoose.model('Team')

// Set up the pug view engine
app.set('views', './app/views');
app.set('view engine', 'pug');

// Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());

// Start server on port 3000
app.listen(3000, function() {
  console.log("Server started.");
});

// Serve static assets from "public"
app.use(express.static('public'));

// Serve templates
app.get('/', function(req, res) {
  if ( req.query.teamname && req.query.membername ) {
    Team.loadByName(req.query.teamname, function (err, team) {
      if (team) {
        team.addMember({name: req.query.membername}, function(err, member){
          res.cookie('team', team._id + ":" + member._id ,{ maxAge: 900000, httpOnly: true })
          res.redirect('/play')
        })
      } else {
        res.render('index',{})
      }
    })
  } else {
    res.render('index', {});
  }
});

function find_member(members, key) {
  for (var i=0; i<members.length; i++) {
    console.log(members[i])

    if ( members[i]._id === key ) {
      return members[i]
    }
  }
  return {}
}

app.get('/play', function (req, res) {
  if ( req.cookies.team ) {
    c = req.cookies.team.split(':')
    Team.load(c[0], function(err, team) {
      res.render('play', {team: team, member: find_member(team.members, c[1])})
    })
  } else {
    res.redirect('/');
  }
})

app.get('/admin', function(req, res) {
  Team.find().exec(function(err, teams){
    res.render('admin', { teams: teams, team: '', moment: moment });
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
