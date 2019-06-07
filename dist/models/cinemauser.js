const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const cinemauserSchema = Schema({
	First_Name: {
		type: 'String'
	},
	Middle_Name: {
		type: 'String'
	},
	Last_Name: {
		type: 'String'
	},
	Email: {
		type: 'String'
	},
	Password: {
		type: 'String'
	},
	Address: {
		type: 'String'
	},
	Mobile_Number: {
		type: 'String'
	},
	Phone_Number: {
		type: 'String'
	},
	Status: {
		type: 'String'
	},
	Ticket_purchased: {
		type: 'String'
	},
	Unclaimed: {
		type: 'String'
	},
	datetime: {
		type: 'String'
	},
	City: {
		type: 'String'
	},
	Birthdate: {
		type: 'String'
	},
	Company_name: {
		type: 'String'
	},
	bcodeID: {
		type: 'String'
	},
	source: {
		type: 'String'
	},
	risk: {
		type: 'String'
	},
	ip: {
		type: 'String'
	},
	province: {
		type: 'String'
	},
	gender: {
		type: 'String'
	},
	civilstatus: {
		type: 'String'
	},
	date_modified: {
		type: 'String'
	},
	dp_consent_1: {
		type: 'String'
	},
	Birthmonth: {
		type: 'String'
	},
	agreement_status: {
		type: 'String'
	}
}) 

module.exports = mongoose.model('cinemauser', cinemauserSchema, 'cinemauser');