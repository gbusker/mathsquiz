'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  name: String,
  team: {type: Schema.Types.ObjectId, ref: 'Team'}
})
MemberSchema.statics = {
  load: function(id, callback) {
    return this.findOne({_id: id}).populate({path: 'team', populate: {path: 'members'}}).exec(callback)
  }
}
var Member = mongoose.model('Member', MemberSchema)

const TeamSchema = new Schema({
  name: {type: String,
	   index: {unique: true, dropDups: true},
	   trim: true,
	   required: true
  },
  quiz: [{
      a: Number,
      b: Number,
      answer: Number,
      answered_by: Number
  }],
  started: {type: Date},
  startedBy: {type: Schema.Types.ObjectId, ref: 'Member'}
}, { timestamps: true })
TeamSchema.virtual('members',{
  ref: 'Member',
  localField: '_id',
  foreignField: 'team'
})

TeamSchema.statics = {
  loadByName: function(name, callback) {
    return this.findOne({name: name}).populate('quizzes').populate('members').exec(callback)
  },
  load: function(id, callback) {
    return this.findOne({_id: id}).populate('members').exec(callback)
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
    this.save(callback);
  },
  addQuestion: function (callback) {
    this.quiz.push(
      {
        a: randomint(10),
        b: randomint(10)
      })
  },
  addMember: function(data, callback) {
    data.team = this._id
    Member.create(data, callback)
  }

}

mongoose.model('Team', TeamSchema);
