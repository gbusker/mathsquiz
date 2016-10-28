var mongoose = require("mongoose")
//var team = require("../app/models/team")
var Team = mongoose.model('Team')

var should = require("should")

describe('Team', function() {

  before(function() {
    Team.remove().exec()
  })

  describe('#create', function() {
    it('should create a team', function(done) {
      Team.create({name: "Test name"}, function(err, createdTeam) {
        should.not.exist(err)
        done()
      })
    });
    it('should not create a team with an existing name', function(done) {
      Team.create({name: "Test name"}, function(err, createdTeam) {
        should.exist(err)
        done()
      })
    })
    it('should give me related quizes', function(done) {
      Team.create({name: "quiz ref name"}, function(err, createdTeam) {
        should.not.exist(err)
        createdTeam.addQuiz(function(err, createdQuiz) {
          should.not.exists(err)
          done()
        })
      })
    });


  });

});
