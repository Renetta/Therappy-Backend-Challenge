const express = require('express');
var bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const url = require('url');
const step = require('step');
const RSVP = require('rsvp');
var app = express();

app.set('view engine', 'ejs');

var toCapital = (name) => {
	if (name.length > 1) {
		var res = [], result = '';
		name.forEach(item =>{
			item = item.replace(/"/g, '');
			item = item.replace(/www./g, '');
			item = item.replace(/\//g, '-');
			var n = item.toUpperCase();
			res.push(n);
		});

		res[1] = res[1].substr(1, res[1].length);
		res = res.reverse();
		res.forEach(item => {
			result += item.length > 0 ? item + ' - ' : '';
		});
		return result.substr(0, result.length - 2);
	} else 
		return name.charAt(1).toUpperCase() + name.slice(2);
}

var getParamQuery = (item) => {
	var data = {
		param: '',
		name: ''
	}
	if (item) {
		data = {
			param: item.search(".com") > 1 ? toCapital(item.split('.com')) : "NO RESPONSE",
			name: item.substr(1, item.length - 2)
		};
	}

	return data; 
}

var splitQuery = (params) => {
	var result = [];
	if (params && params.length > 1 & Array.isArray(params)) {
		params.forEach(item => {
			var data = getParamQuery(item);
			result.push(data);	
		});
	} else {
		var data = getParamQuery(params);
		result.push(data);	
	}

	return result;
}

app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({extended:true}));  

var queryParams;
var fileName = 'views/index.html';
app.get('/I/want/title', (req, res) => {
	res.setHeader('Content-type', 'text/html');

	//FIRST TASK - comment the lines from 76- 109  to view the first task result.

	// queryParams = url.parse(req.url,true).query;
	// res.render('address', {task: 'FIRST TASK', qs:splitQuery(req.query.address)});

//*************************************************************************************

	//SECOND TASK USING FLOW LIBRARY STEP - comment the lines from 70-73  and  96 - 109 to view the result.
	// step(
	// 	function readSelf() {
	// 	   fs.readFile(fileName, this);
	// 	},

	// 	function rendering(err, queryParams) {
	// 		if (err) throw err;
	// 		return res.render('address',  {task: 'SECOND TASK', qs:splitQuery(req.query.address)});
	// 	},
	// 	function showIt(err, newText) {
	// 	    if (err) throw err;
	// 	    console.log(newText);
	// 	}
	// );
//*****************************************************************************************

	//THIRD TASK USING FLOW LIBRARY STEP - comment the lines from 70-91 to view the result.
	var promise = new RSVP.Promise((fulfill, reject) => {
		var queryData = splitQuery(req.query.address); 
		if (queryData.length >= 1 ) {
			fulfill(queryData);
		} else {
			reject(queryData);
		}
	});

	promise.then((data) => {
		return res.render('address', {task: 'THIRD TASK', qs: data});
	}, (data) => {
		return res.render('address', {task: 'THIRD TASK', qs: {param: '', name: ''}});
	});
//*****************************************************************************************
});

const server = http.createServer(app);
server.listen(8080, 'localhost', () => {
	console.log("Server is connected on port 8080!");
})  

