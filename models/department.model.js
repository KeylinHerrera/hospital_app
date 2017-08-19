const Model = require('./model');
const moment = require('moment');

const VALIDATIONS = {
	name: {
		required: true,
		validation: 'string'
	},
	description: {
		required: false,
		validation: 'string'
	}
};

const EXPORTABLES = ['_id', 'name', 'description'];

module.exports = Department;

function Department(data){
	var self = this;
	
	Object.assign(data, {
		_id: data._id || null,
		name: data.name || '',
		description: data.description || ''
	});
	
	Object.assign(self, new Model(data, VALIDATIONS, EXPORTABLES, 'departments'));
	
}