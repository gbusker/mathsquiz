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
var Member = mongoose.model('Member')

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
          res.cookie('team', member._id ,{ maxAge: 60*60*1000, httpOnly: true })
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

app.get('/play', function (req, res) {
  Member.load(req.cookies.team, function(err, member) {
    if ( !err && member) {
      res.render('play', {member: member})
    } else {
      res.redirect('/');
    }
  })
})

app.get('/members', function(req,res){
  if ( req.cookies.team ) {
    Member.load(req.cookies.team, function(err, member) {
      res.render('play/members', {members: member.team.members})
    })
  } else {
    res.status(404).send('Not found');
  }
})

app.get('/quizstart', function(req, res) {
  Member.load(req.cookies.team, function(err, member) {
    if ( member.team.started ) {
      res.render('play/quiz', {member: member})
    } else {
      member.team.started = Date.now()
      member.team.startedBy = member._id
      member.team.save(function(err, product, num) {
        res.render('play/quiz', {member: member})
      })
    }
  })
})

app.get('/quiz', function(req,res) {
  // Check if started
  Member.load(req.cookies.team, function(err, member) {
    if ( member.team.started ) {
      // Get next question for member
      member.team.nextQuestion(member, function(question){
        if ( question ) {
          res.render('play/quiz', {member: member})
        } else {
          res.render('play/finished', {member: member})
        }
      })
    }
    else {
      res.status(404).send('quiz not yet started')
    }
  })
})

app.get('/admin', function(req, res) {
  Team.find().populate('quiz').populate('members').exec(function(err, teams){
    res.render('admin', { teams: teams, team: '', moment: moment });
  })
});

app.post('/admin', function(req, res) {
  const team = new Team({name: req.body.team.name})
  team.save(function (err) {
    if (err) {
      console.log('save error: ' + err);
    }
    team.addQuiz(10, function(err){
      if (err) {
        console.log('error creating quiz: ' + err);
      }
    })
  })
  return res.redirect('/admin')
})
