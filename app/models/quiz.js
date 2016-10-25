'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    team:    {type: Schema.ObjectId,
	      ref: 'TeamSchema',
	      required: true},
    started: {type: Date},
    ended:   {type: Date}
})

mongoose.model('Quiz', QuizSchema)


