// admin controller

var mongoose = require('mongoose')
var moment = require('moment')
var Team =   mongoose.model('Team')

module.exports = {
  index: function(req, res) {
    Team.stats(function(err, teams) {
      console.log(teams[0].quiz.filter(function(q){return (q.a*q.b==q.answer)}).length)
      res.render('admin', { teams: teams, team: '', moment: moment });
    })
  },

  createTeam: function(req, res) {
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
  }
}
