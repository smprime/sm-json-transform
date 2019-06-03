const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userschemaSchema = Schema({
	companyId: {
		type: 'ObjectId'
	},
	appId: {
		type: 'ObjectId'
	},
	questionId: {
		type: 'ObjectId'
	},
	userId: {
		type: 'ObjectId'
	},
	clientId: {
		type: 'ObjectId'
	},
	answer: {
		type: 'String'
	},
	key: {
		type: 'String'
	},
	dateCreated: {
		type: 'Number'
	},
	dateUpdated: {
		type: 'Number'
	},
	lastCreatedBy: {
		type: 'String'
	},
	lastUpdatedBy: {
		type: 'String'
	}
}) 

module.exports = mongoose.model('userschema', userschemaSchema, 'userschema');