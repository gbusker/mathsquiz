var mongoose = require('mongoose')
var moment = require('moment')
var Team =   mongoose.model('Team')

module.exports = {

  index: function(req, res) {
    Team.statsFinished(function(err, teams) {
      res.render('stats/index', {teams: teams})
    })
  }

}
