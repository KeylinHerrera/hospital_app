const MongoClient = require('mongodb').MongoClient;

const DATABASE_NAME = 'hospital';

// Mongo`s localhost 27017
const uri = `mongodb://localhost:27017/${DATABASE_NAME}`;

var database = {
	db: {},
	appointments: {},
	departments: {},
};

/*
 * Init function from Hospital App
 * @params {Object} err
 * @params {Object} db
 * @return err or collections
 */
function _init(){
	MongoClient.connect(uri, (err, db) => {
		if(err){
			console.error(err);
			return err;
		}
		database.db = db;
		database.appointments = db.collection('appointments');
		database.departments = db.collection('departments');
	});
}

_init();

module.exports = database;
