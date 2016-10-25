'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: {type: String,
	   index: {unique: true, dropDups: true},
	   default: '',
	   trim: true}
})

mongoose.model('Team', TeamSchema);

