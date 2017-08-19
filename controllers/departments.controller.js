const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const Department = require('../models/department.model');

module.exports = {
	getAll,
	get,
	create,
	update,
	remove,
};

/**
 * Get all the departments
 * @param req
 * @param res
 */
function getAll(req, res){
	let stream = db.departments.find().stream();
	let data = [];
	stream.on('data', department => data.push(department));
	stream.on('end', () => res.json(data));
	stream.on('error', err => res.json({error: err}));
}

/**
 * Gets one department based on the department id
 * @param req
 * @param res
 */
function get(req, res){
	let id = req.params ? req.params.departmentId : null;
	if(!id) return res.json({error: `Invalid department id ${id}`});
	
	let department = new Department({_id: id});
	department.find().then(data => res.json(data), error => res.json({error: err}))
}

/**
 * Create new appointment
 * @param {Object} req
 * @param {Object} res
 */
function create(req, res){
	let params = {
		name: req.body.name,
		description: req.body.description
	};
	let department = new Department(params);
	department.valid().then(valid => {
		console.log('department validation', valid);
		if(!valid) return res.json(department.errors);
		
		// save the new department
		department.save().then((data, err) => {
			if(err) return res.json({error: err});
			console.log('department data', data);
			res.json(data.ops);
		});
	});
}

/**
 * Update one department
 * @param req
 * @param res
 */
function update(req, res){
	let id = req.params ? req.params.departmentId : null;
	if(!id) return res.json({error: `Invalid department id ${id}`});
	
	let params = {
		_id: id,
		name: req.body.name,
		description: req.body.description
	};
	let department = new Department(params);
	department.valid().then(valid => {
		if(!valid) return res.json(department.errors);
		
		// save the new department
		department.update()
			.then(data => res.json(data), error => res.json({error: error}));
	});
}

/**
 * Remove an appointment base on the id
 * @param {Object} req
 * @param {Object} res
 */
function remove(req, res){
	let id = req.params ? req.params.departmentId : null;
	if(!id) return res.json({error: `Invalid department id ${id}`});
	
	let query = {_id: new ObjectID(id)};
	db.departments.findAndRemove(query, {w: 1}, (err, data) => {
		if(err) return res.json({error: err});
		res.json(data.value || {});
	});
}