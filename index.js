const http = require('http');
const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

const BaseController = require('./controllers/Base');

app.set('view engine', 'ejs');

app.get('/', function (req,res) {
	res.render('index');
});

app.post('/', BaseController.search);

app.listen(PORT, process.env.APP_HOST);