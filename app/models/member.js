'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const MemberSchema = new Schema({
    name: {type: String,
	   default: '',
	   trim:true},
    team: {type: Schema.ObjectId,
	   ref: 'TeamSchema',
	   required: true}
})

mongoose.model('Member', MemberSchema);
