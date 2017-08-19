const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
	extended: false
}));

app.use('/appointments', require('./routers/appointments.routes'));
app.use('/departments', require('./routers/departments.routers'));

app.listen(8080, () => console.log('App express listen in port: 8080'));