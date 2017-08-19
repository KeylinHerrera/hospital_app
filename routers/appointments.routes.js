// const express = require('express');
const router = require('express').Router();
const appointments = require('../controllers/appointments.controller');

// compose appointments routes
router.get('/', appointments.getAll);
router.post('/', appointments.create);
router.delete('/:appointmentId', appointments.remove);

router.get('/agenda', appointments.getAgenda);

module.exports = router;
