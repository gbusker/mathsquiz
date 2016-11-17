'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  name: {type: String, trim: true, required: true},
  team: {type: Schema.Types.ObjectId, ref: 'Team'}
})
MemberSchema.index({name: 1, team: 1}, {unique: true})
MemberSchema.statics = {
  load: function(id, callback) {
    return this
      .findOne({_id: id})
      .populate({path: 'team', populate: {path: 'members'}})
      .exec(callback)
  }
}
var Member = mongoose.model('Member', MemberSchema)

const QuizSchema = new Schema({
  a: Number,
  b: Number,
  assigned: {type: Schema.Types.ObjectId, ref: 'Member'},
  team: {type: Schema.Types.ObjectId, ref: 'Team'},
  answer: Number,
  correct: Boolean,
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
  startedBy: {type: Schema.Types.ObjectId, ref: 'Member'},
  ended: {type: Date},
  nquestions: {type: Number, default: 0},
  nanswered:  {type: Number, default: 0},
  ncorrect:   {type: Number, default: 0},
  nwrong:     {type: Number, default: 0},
  score:      {type: Number}
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
TeamSchema.pre('remove', function(next){
  Member.remove({team: this._id}).exec()
  Quiz.remove({team: this._id}).exec()
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
  },
  stats: function(callback){
    this.find().sort({createdAt:-1}).populate('quiz').populate('members').exec(callback)
  },
  statsFinished: function(callback){
    this.where({ended: {$ne: null}}).sort({score:1}).populate('quiz').populate('members').exec(callback)
  }
}

// Random int between 1..max
function randomint(max) {
    return Math.ceil(Math.random()*max)
}

TeamSchema.methods = {
  addQuiz: function (nquestions, callback) {
    var team = this
    team.nquestions = nquestions
    team.save()
    for (var i=0; i<nquestions; i++) {
      this.addQuestion();
    }
    this.save(callback)
  },
  tryEnd: function(callback) {
    var team = this
    Quiz.findOne({team: team._id, answeredAt: null}, function(err, q){
      console.log("try end:" + q)
      if ( q ) {
        // Nothing
        callback(null,null)
      }
      else {
        // Close quiz
        console.log('Close team:' + team)
        team.ended = Date.now()
        team.score = team.timeInSeconds() + team.nwrong
        team.save(callback)
      }
    })
  },
  addQuestion: function (callback) {
    Quiz.create({a: randomint(12), b: randomint(12), team: this._id}, callback)
  },
  nextQuestion: function(member, callback) {
    var team = this
    // Is there a question already assigned to me?
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
            if ( ! team.ended )
              team.tryEnd(function(err){
                callback(err, null)
              })
            else {
              // No more questions
              callback(null, null)
            }
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
  },
  timeInSeconds: function(){
    return (this.ended-this.started)/1000
  }
}

mongoose.model('Team', TeamSchema);
