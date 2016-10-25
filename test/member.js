var mongoose = require("../app/models/db")
var team = require('../app/models/team')
var member = require("../app/models/member")
var should = require("should")

var Team = mongoose.model('Team')
var Member = mongoose.model('Member')




describe('Member', function() {
    before(function() {
	Member.remove().exec()
    })

    describe('#create', function() {
	it('should create a member', function(done) {
	    Team.create({name: 'teamname'}, function(err, createdTeam){
		should.not.exist(err)
		Member.create({name: "Emma", team: createdTeam}, function(err, createdMember) {
		    should.not.exist(err)
		    done()
		})
	    })
	})
    })
})
