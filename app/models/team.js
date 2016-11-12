'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  name: String,
  team: {type: Schema.Types.ObjectId, ref: 'Team'}
})
MemberSchema.index({name: 1, team: 1}, {unique: true})
MemberSchema.statics = {
  load: function(id, callback) {
    return this.findOne({_id: id}).populate({path: 'team', populate: {path: 'members'}}).exec(callback)
  }
}
var Member = mongoose.model('Member', MemberSchema)

const QuizSchema = new Schema({
  a: Number,
  b: Number,
  assigned: {type: Schema.Types.ObjectId, ref: 'Member'},
  team: {type: Schema.Types.ObjectId, ref: 'Team'},
  answer: Number,
  answeredAt: Date
})
var Quiz = mongoose.model('Quiz', QuizSchema)

const TeamSchema = new Schema({
  name: {type: String,
	   index: {unique: true, dropDups: true},
	   trim: true,
	   required: true
  },
  started: {type: Date},
  startedBy: {type: Schema.Types.ObjectId, ref: 'Member'}
}, { timestamps: true })
TeamSchema.virtual('members',{
  ref: 'Member',
  localField: '_id',
  foreignField: 'team'
})
TeamSchema.virtual('quiz', {
  ref: 'Quiz',
  localField: '_id',
  foreignField: 'team'
})

TeamSchema.statics = {
  loadByName: function(name, callback) {
    return this.findOne({name: name}).populate('quiz').populate('members').exec(callback)
  },
  load: function(id, callback) {
    return this.findOne({_id: id}).populate('quiz').populate('members').exec(callback)
  },
  loadByMember: function(id, callback) {
    var team = this
    return Member.findOne({_id: id}, function (err, member) {
      return team.load(member.team, callback)
    })
  }
}

function randomint(max) {
    return Math.ceil(Math.random()*max)
}

TeamSchema.methods = {
  addQuiz: function (nquestions, callback) {
    var team = this
    for (var i=0; i<nquestions; i++) {
      this.addQuestion();
    }
    this.save(callback)
  },
  addQuestion: function (callback) {
    Quiz.create({a: randomint(12), b: randomint(12), team: this._id}, callback)
  },
  nextQuestion: function(member, callback) {
    var team = this
    Quiz.findOne({team: team._id, assigned: member._id, answer: null}, function(err, q){
      if (q) {
        // This should be a question for member
        callback(err, q)
      } else {
        // No question lets make one
        Quiz.findOne({team: team._id, assigned: null}, function(err, q){
          if ( q ) {
            q.assigned = member._id
            q.save(callback)
          } else {
            // No more questions
            callback(null, null)
          }
        })
      }
    })
  },
  addMember: function(data, callback) {
    data.team = this._id
    Member.find(data, function(err, members){
      if ( (!err) && members.length > 0 ) {
        callback(null, members[0])
      } else {
        Member.create(data, callback)
      }
    })
  }
}

mongoose.model('Team', TeamSchema);
