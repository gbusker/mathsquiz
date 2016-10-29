'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const team = require(__dirname + '/quiz')
const Quiz = mongoose.model('Quiz')

const TeamSchema = new Schema({
    name: {type: String,
	   index: {unique: true, dropDups: true},
	   trim: true,
	   required: true
   },
   quizzes: [{
     type: Schema.Types.ObjectId,
     ref: 'Quiz'
   }]
}, { timestamps: true })

TeamSchema.statics = {
  loadByName: function(name, callback) {
    return this.findOne({name: name}).populate('quizzes').exec(callback)
  }
}

TeamSchema.methods = {
  addQuiz: function (callback) {
    var team = this
    Quiz.create({team: this.id}, function(err, quiz) {
        team.quizzes.push(quiz.id)
        team.save(callback)
    })
  }
}

mongoose.model('Team', TeamSchema);
