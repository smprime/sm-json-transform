const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userschemaSchema = Schema({
	firstName: {
		type: {
			type: 'String'
		}
	},
	lastName: {
		type: {
			type: 'String'
		}
	},
	age: {
		description: {
			type: 'String'
		},
		type: {
			type: 'String'
		},
		minimum: {
			type: 'Number'
		}
	},
	hairColor: {
		enum: {
			type: [
				'String'
			]
		},
		type: {
			type: 'String'
		}
	}
}) 

module.exports = mongoose.model('userschema', userschemaSchema, 'userschema');