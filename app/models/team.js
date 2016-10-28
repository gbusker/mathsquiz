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
	  }
}, { timestamps: true })

TeamSchema.methods = {
  addQuiz: function (callback) {
    Quiz.create({team: this.id}, callback)
  }
}

mongoose.model('Team', TeamSchema);
