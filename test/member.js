var mongoose = require("../app/models/db")
var team = require('../app/models/team')
var should = require("should")

var Team = mongoose.model('Team')
var Member = mongoose.model('Member')

describe('Member', function() {
  before(function() {
	  Member.remove().exec()
  })
  var member_id
  describe('#create', function() {
	  it('should create a member', function(done) {
	    Team.create({name: 'teamname'}, function(err, createdTeam){
		    should.not.exist(err)
		    Member.create({name: "Emma", team: createdTeam}, function(err, createdMember) {
          member_id = createdMember._id
		      should.not.exist(err)
		      done()
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
