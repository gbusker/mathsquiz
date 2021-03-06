const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const auth = require('http-auth');
const mongoose = require('mongoose')
const fs = require('fs')
const join = require('path').join;
const moment = require('moment')

// Port to listen to
var PORT = process.env.PORT || 3000

// Bootstrap models
const models = join(__dirname, 'app/models');
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

var Team =   mongoose.model('Team')
var Member = mongoose.model('Member')
var Quiz =   mongoose.model('Quiz')

// Controllers
const admin = require('./app/controller/admin')
const stats = require('./app/controller/stats')

// Set up the pug view engine
app.set('views', './app/views');
app.set('view engine', 'pug');

// Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());

// auth
var basic = auth.basic({
    realm: "Admin area"
  }, (username, password, callback) => {
    callback(username === "username" && password === "password");
  }
);

// Start server on port 3000
app.listen(PORT, function() {
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
        res.render('index',{query: req.query, error_team: 'can\t find this team'})
      }
    })
  } else if (req.query.teamname) {
    res.render('index', {query: req.query, error_member: 'must include a member name'});
  } else {
    res.render('index', {query: req.query});
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
        res.redirect('/quiz')
      })
    }
  })
})

app.get('/quiz', function(req,res) {
  // Check if started
  Member.load(req.cookies.team, function(err, member) {
    if ( member.team.started ) {
      // Get next question for member
      member.team.nextQuestion(member, function(err, question){
        if ( question ) {
          res.render('play/quiz', {member: member,
                                  q: question,
                                  progress: 100.0*(member.team.ncorrect + member.team.nwrong)/member.team.nquestions})
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

app.post('/quiz', function(req, res) {
  Member.load(req.cookies.team, function(err, member) {
    if ( req.body.quiz_id && req.body.result ) {
      Quiz.findOne({_id: req.body.quiz_id }, function(err, q){
        q.answer = req.body.result
        q.answeredAt = Date.now()
        q.correct = q.a*q.b == req.body.result
        if ( q.correct ) {
          member.team.ncorrect++
        } else {
          member.team.nwrong++
        }
        member.team.save()
        q.save(function(err, q){
          member.team.nextQuestion(member, function(err, question){
            if ( question ) {
              res.render('play/quiz', {member: member,
                                       q: question,
                                       progress: 100.0*(member.team.ncorrect + member.team.nwrong)/member.team.nquestions})
            } else {
              res.render('play/finished', {member: member})
            }
          })
        })
      })
    }
  })
})

app.get('/admin', auth.connect(basic), admin.index)
app.post('/admin', auth.connect(basic), admin.createTeam)

app.get('/stats', stats.index)
