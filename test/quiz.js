var mongoose = require("../app/models/db")
var team = require("../app/models/team")
var should = require("should")

var Quiz = mongoose.model('Quiz')
var Team = mongoose.model('Team');
var Member = mongoose.model('Member')

var team;
var member;
describe('Quiz', function() {

  before(function() {
	   Team.find({name: 'quiztest'}).remove().exec()
     Quiz.find().remove().exec()
     Member.find().remove().exec()
     Team.create({name: 'quiztest'}, function(err, createdTeam) {
       team = createdTeam
       createdTeam.addMember({name: 'testmember'}, function(err, createdMember){
         member = createdMember
       })
     })
  })

  describe('#addQuiz', function() {
	  it('should create a quiz', function(done) {
      team.addQuiz(10, function(err, team){
        should.not.exist(err)
        done()
      })
    })
    it('should include quizzes', function(done) {
      Team.loadByName("quiztest", function (err,thisteam) {
        thisteam.quiz.length.should.equal(10)
        done()
      })
    })
    it('should give a member a question for him/her', function(done){
      team.nextQuestion(member, function(err, q){
        should.exist(q)
        q.assigned.should.equal(member._id)
        done()
      })
    })
    it('there should be one open question', function (done){
      Quiz.where('assigned').ne(null).exec(function(err, result){
        should.not.exist(err)
        should.exist(result)
        result.length.should.equal(1)
        done()
      })
    })
  })
})
