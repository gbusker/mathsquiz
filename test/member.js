var mongoose = require("../app/models/db")
var team = require('../app/models/team')
var should = require("should")

var Team = mongoose.model('Team')
var Member = mongoose.model('Member')

describe('Member', function() {
  before(function() {
    Team.remove().exec()
	  Member.remove().exec()
  })
  var member_id
  describe('#addMember', function() {
	  it('should create a member', function(done) {
	    Team.create({name: 'teamname'}, function(err, createdTeam){
		    should.not.exist(err)
		    createdTeam.addMember({name: "Emma"}, function(err, createdMember) {
          member_id = createdMember._id
		      should.not.exist(err)
		      done()
		    })
	    })
	  })
    it('should not create a second member', function(done) {
      Team.loadByName('teamname', function(err, team){
        should.not.exist(err)
        should.exist(team)
        team.addMember({name: 'Emma'}, function(err, createdMember) {
          should.not.exist(err)
          should.exist(createdMember)
          Team.loadByName('teamname', function(err, team){
            team.members.length.should.equal(1)
            done()
          })
        })
      })
    })
  })
  describe('#load', function() {
    it('should load', function(done) {
      Member.load(member_id, function (err, member){
        should.not.exist(err)
        should.exist(member)
        member.name.should.equal("Emma")
        done()
      })
    })
  })
})
