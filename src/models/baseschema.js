const mongoose from 'mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const baseschemaSchema = Schema({
	title: {
		type: 'String'
	},
	type: {
		type: 'String'
	},
	properties: {
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
	},
	additionalProperties: {
		type: 'Boolean'
	},
	required: {
		type: [
			'String'
		]
	}
}) 

module.exports = mongoose.model('baseschema', baseschemaSchema, 'baseschema');