var mongoose = require("../app/models/db")
var quiz = require("../app/models/quiz")
var team = require("../app/models/team")
var should = require("should")

var Quiz = mongoose.model('Quiz')
var Team = mongoose.model('Team');

describe('Quiz', function() {
    before(function() {
	Quiz.remove().exec()
    })

    describe('#create', function() {
	it('should create a quiz', function(done) {
	    Team.create({name: 'Team name'}, function(err, createdTeam) {
		should.not.exist(err)
		Quiz.create({team: createdTeam}, function(err, createdQuiz) {
		    should.not.exist(err)
		    done()
		})
	    });
	})
    })
})

