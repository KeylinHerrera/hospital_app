const MongoClient = require('mongodb').MongoClient;

const DATABASE_NAME = 'hospital';

const uri = `mongodb://localhost:27017/${DATABASE_NAME}`;

var database = {
	db: {},
	appointments: {},
	departments: {},
};

function _init(){
	MongoClient.connect(uri, (err, db) => {
		console.log('connected to mongo...');
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
