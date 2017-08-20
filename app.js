const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json());    
app.use(bodyParser.urlencoded({ 
	extended: false
}));

// Requires
app.use('/appointments', require('./routers/appointments.routes'));
app.use('/departments', require('./routers/departments.routers'));

// Port: 8124
app.listen(8124, () => console.log('App express listen in port: 8124'));