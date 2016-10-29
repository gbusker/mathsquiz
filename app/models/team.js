'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

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
   members: [{
     uid: Number,
     name: String
   }]
}, { timestamps: true })

TeamSchema.statics = {
  loadByName: function(name, callback) {
    return this.findOne({name: name}).populate('quizzes').exec(callback)
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
  addMember: function (data, callback) {
    this.members.push(data)
    this.save(callback)
  }

}

mongoose.model('Team', TeamSchema);
