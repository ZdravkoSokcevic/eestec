const http = require('http');
const express = require('express');
const app = express();
const PORT = 3000;

const BaseController = require('controllers/Base');

app.set('view engine', 'ejs');

app.get('/', function (req,res) {
	res.render('index');
});

app.post('/', BaseController.search);

app.listen(PORT);