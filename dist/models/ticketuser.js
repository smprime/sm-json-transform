const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ticketuserSchema = Schema({
	customer_id: {
		type: 'Number'
	},
	customer_firstname: {
		type: 'String'
	},
	customer_middlename: {
		type: 'String'
	},
	customer_lastname: {
		type: 'String'
	},
	customer_birthdate: {
		type: 'String'
	},
	customer_age_bracket: {
		type: 'String'
	},
	customer_gender: {
		type: 'String'
	},
	customer_nationality: {
		type: 'String'
	},
	customer_marital_status: {
		type: 'String'
	},
	customer_address1: {
		type: 'String'
	},
	customer_address2: {
		type: 'String'
	},
	customer_city: {
		type: 'String'
	},
	customer_zip: {
		type: 'String'
	},
	customer_phone: {
		type: 'String'
	},
	customer_fax: {
		type: 'String'
	},
	customer_mobile: {
		type: 'String'
	},
	customer_email: {
		type: 'String'
	},
	customer_website: {
		type: 'String'
	},
	customer_work_address1: {
		type: 'String'
	},
	customer_work_address2: {
		type: 'String'
	},
	customer_work_city: {
		type: 'String'
	},
	customer_work_zip: {
		type: 'String'
	},
	customer_work_phone: {
		type: 'String'
	},
	customer_work_fax: {
		type: 'String'
	},
	customer_work_mobile: {
		type: 'String'
	},
	customer_work_email: {
		type: 'String'
	},
	customer_work_website: {
		type: 'String'
	},
	customer_notes: {
		type: 'String'
	},
	customer_active: {
		type: 'String'
	},
	customer_username: {
		type: 'String'
	},
	customer_password: {
		type: 'String'
	},
	customer_registration_code: {
		type: 'String'
	},
	customer_createdate: {
		type: 'String'
	},
	customer_block: {
		type: 'String'
	},
	customer_partycode: {
		type: 'String'
	},
	customer_sms_active: {
		type: 'String'
	},
	customer_adress_province: {
		type: 'String'
	},
	customer_adress_street: {
		type: 'String'
	},
	customer_privacy: {
		type: 'String'
	}
}) 

module.exports = mongoose.model('ticketuser', ticketuserSchema, 'ticketuser');