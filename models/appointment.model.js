const Model = require('./model');
const ObjectID = require('mongodb').ObjectID;
const Department = require('./department.model');
const moment = require('moment');

// Validations
const VALIDATIONS = {
	date: {
		required: true,
		validation: 'date'
	},
	hour: {
		required: true,
		validation: 'hour'
	},
	first_name: {
		required: false,
		validation: 'string'
	},
	last_name: {
		required: false,
		validation: 'string'
	},
	ID: {
		require: false,
		validation: (value, key) => new Promise((resolve, reject) => {
			console.log('custom validation for ID');
			return resolve({value, key, valid: true});
		})
	},
	deparment: {
		required: false,
		validation: (value, key) => new Promise((resolve, reject) => {
			if(!value || !ObjectID.isValid(value)) return resolve({value, key, valid: false});
			var department = new Department({_id: value});
			department.find().then(data => {
				resolve({value, key, valid: !!data});
			}).catch(err => resolve({value, key, valid: false}) );
		})
	}
};

const EXPORTABLES = ['date', 'hour',  'ID', 'first_name', 'last_name', 'deparment'];

module.exports = Appointment;

/*
 * Appointment function
 * @params {Object} data
 */
function Appointment(data){
	var self = this;

	Object.assign(data, {
		date: data.date ? moment(data.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
		hour: data.hour ? moment(data.hour).format( "HH:mm a") : moment().format( "HH:mm a"),
		first_name: data.first_name || '',
		last_name: data.last_name || '',
		ID: data.ID || null,
		deparment: data.deparment || '',
	});

	Object.assign(self, new Model(data, VALIDATIONS, EXPORTABLES, 'appointments'));

}
