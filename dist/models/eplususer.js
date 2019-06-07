const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const eplususerSchema = Schema({
	key: {
		type: 'Number'
	},
	online_account_key: {
		type: 'String'
	},
	card_key: {
		type: 'String'
	},
	member_code: {
		type: 'String'
	},
	last_name: {
		type: 'String'
	},
	first_name: {
		type: 'String'
	},
	middle_name: {
		type: 'String'
	},
	gender: {
		type: 'String'
	},
	city_of_residence: {
		type: 'String'
	},
	mobile_no: {
		type: 'String'
	},
	email: {
		type: 'String'
	},
	city_of_work: {
		type: 'String'
	},
	birthdate: {
		type: 'String'
	},
	civil_status: {
		type: 'String'
	},
	with_children: {
		type: 'String'
	},
	datetime: {
		type: 'String'
	},
	points: {
		type: 'String'
	},
	lock: {
		type: 'String'
	},
	status: {
		type: 'String'
	},
	confirmedMobile: {
		type: 'String'
	},
	initialConfirm: {
		type: 'String'
	},
	pending_mobile_no: {
		type: 'String'
	},
	expiry_datetime: {
		type: 'String'
	},
	id_type: {
		type: 'String'
	},
	id_number: {
		type: 'String'
	},
	member_since: {
		type: 'String'
	},
	application_date: {
		type: 'String'
	},
	card_name: {
		type: 'String'
	},
	branch_app: {
		type: 'String'
	},
	sms_msg_send: {
		type: 'String'
	},
	referrer: {
		type: 'String'
	},
	referral_points: {
		type: 'String'
	},
	SMemployee: {
		type: 'String'
	},
	signature: {
		type: 'String'
	},
	agent_key: {
		type: 'String'
	},
	express_application: {
		type: 'String'
	},
	picture: {
		type: 'String'
	},
	business_groups_key: {
		type: 'String'
	},
	AIA_reference_number: {
		type: 'String'
	},
	date_updated: {
		type: 'String'
	}
}) 

module.exports = mongoose.model('eplususer', eplususerSchema, 'eplususer');