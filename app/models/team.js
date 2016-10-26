'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: {type: String,
	   index: {unique: true, dropDups: true},
	   trim: true,
	   required: true
	  }    
}, { timestamps: true })

mongoose.model('Team', TeamSchema);

