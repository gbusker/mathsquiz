// admin controller

var mongoose = require('mongoose')
var moment = require('moment')
var Team =   mongoose.model('Team')

// Question count
var QUESTIONS = process.env.QUESTIONS || 10

module.exports = {
  index: function(req, res) {
    Team.stats(function(err, teams) {
      res.render('admin', { teams: teams, team: '', moment: moment });
    })
  },

  createTeam: function(req, res) {
    const team = new Team({name: req.body.team.name})
    team.save(function (err) {
      if (err) {
        console.log('save error: ' + err);
      }
      team.addQuiz(QUESTIONS, function(err){
        if (err) {
          console.log('error creating quiz: ' + err);
        }
      })
    })
    return res.redirect('/admin')
  }
}
