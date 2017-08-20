const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const moment = require('moment');
const Appointment = require('../models/appointment.model');

// Export controller functions
module.exports = {
	getAll,
	create,
	remove,
	update,
	getAgenda,
};

/*
 * Get All function from Hospital App
 * @params {Object} req
 * @params {Object} res
 */
function getAll(req, res){
	let stream = db.appointments.find().stream();
	let data = [];
	stream.on('data', appointment => data.push(appointment));
	stream.on('end', () => res.json(data));
	stream.on('error', err => res.json({error: err}));
}

/**
 * Update one department
 * @param req
 * @param res
 */
function update(req, res){
	let id = req.params ? req.params.appointmenId : null;
	if(!id) return res.json({error: `Invalid department id ${id}`});
	
	let params = {
		ID: req.body.ID,
		date: req.body.date,
		hour: req.body.hour,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		department: req.body.department,
		_id: id
		
	};
	let appointment = new Appointment(params);
	appointment.valid().then(valid => {
		if(!valid) return res.json(appointment.errors);
		
		// save the new department
		appointment.update()
			.then(data => res.json(data), error => res.json({error: error}));
	});
}


/*
 * Create new appointment
 * @param {Object} req
 * @param {Object} res
 */
function create(req, res){
	let params = {
		date: req.body.date,
		ID: req.body.ID,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		deparment: req.body.deparment,
	};
	console.log('params', params);
	let appointment = new Appointment(params);
	console.log('appointment', appointment);
	appointment.valid().then(valid => {
		console.log('appointment validation', valid);
		if(!valid) return res.json(appointment.errors);

		// save the new appointment
		appointment.save().then((data, err) => {
			if(err) return res.json({error: err});
			console.log('data', data);
			res.json(data.ops);
		});
	});
}

/**
 * Remove an appointment base on the id
 * @param {Object} req
 * @param {Object} res
 */
function remove(req, res){
	let id = req.params ? req.params.appointmentId : null;
	if(!id) return res.json({error: `Invalid id ${id}`});

	let query = {_id: new ObjectID(id)};
	db.appointments.findAndRemove(query, {w: 1}, (err, data) => {
		if(err) return res.json({error: err});
		res.json(data.value || {});
	});
}

/**
 * Get the appointment for today
 * @param req
 * @param res
 */
function getAgenda(req, res){
	let query = {date: moment().format()};
	let stream = db.appointments.find(query).stream();
	let data = [];
	stream.on('data', appointment => data.push(appointment));
	stream.on('end', () => res.json(data));
	stream.on('error', err => res.json({error: err}));
}
