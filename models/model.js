const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const moment = require('moment');

module.exports = Model;

function Model(data, validations = [], visible = [], collection){
	let exportables = visible.concat(['_id']);
	let self = this;
	
	Object.assign(self, data, {
		_id: data._id || null,
		errors: []
	});
	
	// methods
	self.valid = valid;
	self.save = save;
	self.update = update;
	self.find = find;
	self.toObject = toObject;
	
	let validationsMethods = {
		date: _validDate,
		string: _validString
	}
	
	/**
	 * Valid the model based on the validations
	 * @returns {Promise}
	 */
	function valid(){
		let valid = true;
		let promises = [];
		
		for(let key in validations){
			// let validation = (value, key) => new Promise(resolve => resolve({key, value, isvalid: true}));
			let validation = null;
			
			// is a custom validation
			if(typeof validations[key].validation === 'function') validation = validations[key].validation;
			else if(validationsMethods[validations[key].validation]) validation = validationsMethods[validations[key].validation];
			
			// console.log('validation function', validation);
			
			if(validation) promises.push(validation(self[key], key).then(data => {
				console.log('then', data);
				if(!data.valid && validations[data.key].required)
					self.errors.push(`Invalid required: ${data.key} "${data.value}".`);
				else if(!data.valid){
					data.valid = true;
					self.errors.push(`Invalid: ${data.key} "${data.value}".`);
				}
				return data.valid;
			}));
			
			// promises.push(promise);
		}
		
		// return valid;
		return Promise.all(promises).then(results => {
			console.log('results', results);
			results.forEach(isValid => !isValid ? valid = false : '');
			return valid;
		}).catch(err => {
			console.error(err);
			return false;
		});
		
	}
	
	/**
	 * Save the reservation in mongodb
	 * @param {Boolan} update
	 * @returns {Promise.<TResult>}
	 */
	function save(){
		let data = toObject();
		
		// save the new reservation
		return new Promise((resolve, reject) => {
			db[collection].insert(data, {w: 1}, (err, data) => {
				if(err) return reject(err);
				self._id = data.ops[0] ? data.ops[0]._id : null;
				resolve(data);
			});
		});
	}
	
	/**
	 * Update the model
	 * @returns {Promise}
	 */
	function update(){
		let data = toObject(true);
		
		return new Promise((resolve, reject) => {
			let query = {_id: new ObjectID(data._id)};
			delete data._id;
			
			db[collection].findOneAndUpdate(query, {$set: data}, {returnOriginal: false}, (err, results) => {
				if(err) return reject(err);
				resolve(results.value);
			});
		});
	}
	
	/**
	 * Find the data based on the model _id
	 * @returns {Promise}
	 */
	function find(){
		let data = toObject(true);
		let query = {_id: new ObjectID(data._id)};
		
		return db[collection].findOne(query);
	}
	
	/**
	 * Get the model as an object
	 * @param {Boolean} clean
	 * @returns {Object}
	 */
	function toObject(clean = false){
		let data = {};
		exportables.forEach(key => {
			if(clean && self[key]) data[key] = self[key];
			else data[key] = self[key];
		});
		return data;
	}
	
	function _validDate(value, key){
		return new Promise(resolve => resolve({
			value,
			key,
			valid: moment(value).isValid()
		}))
	}
	
	function _validString(value, key){
		return new Promise(resolve => resolve({
			value,
			key,
			valid: !!value
		}))
	}
}