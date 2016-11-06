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
    it('should create quizes', function(done) {
      Team.create({name: "quiz ref name"}, function(err, createdTeam) {
        should.not.exist(err)
        createdTeam.addQuiz(10, function(err, createdQuiz) {
          should.not.exists(err)
          done()
        })
      })
    });
    it('should have quizes', function(done) {
      Team.find({name: "quiz ref name"}, function(err, team)  {
        should.not.exist(err)
        done()
      })
    })
    var member_id
    it('should create members', function(done) {
      Team.create({name: "member ref"}, function(err, createdTeam) {
        should.not.exist(err)
        createdTeam.addMember({name: 'member name'}, function(err, member) {
          should.not.exists(err)
          should.exist(member)
          should(member.name).equal('member name')
          member_id = member._id
          done()
        })
      })
    })
    it('should get team by member', function(done) {
      Team.loadByMember(member_id, function (err, team){
        should.not.exist(err)
        should.exist(team)
        should(team.name).equal('member ref')
        done()
      })
    })
  });
  describe('#load', function (){
    it('should load a team', function(done) {
      Team.loadByName("quiz ref name", function (err, team) {
        should.not.exist(err)
        should.exist(team)
        should.exist(team.name)
        done()
      })
    })
    it('should include members', function(done){
      Team.loadByName('member ref', function(err, team) {
        should.not.exist(err)
        should.exist(team.members)
        team.members.length.should.equal(1)
        done()
      })
    })

    it('should pass error if load fails', function(done) {
      Team.loadByName('random', function(err, team) {
        should.not.exist(team)
        done()
      })
    })
  })


});
