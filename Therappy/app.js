const express = require('express');
const http = require('http');
const fs = require('fs');
const url = require('url');
const app = express();

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

app.get('/I/want/title', (req, res) => {
	var fileName = 'views/index.html';
	res.setHeader('Content-type', 'text/html');
	var query = url.parse(req.url,true).query;
	fs.readFile(fileName, (err, data) => {
		if (err) {
      		return res.end("404 Not Found");
		} else {
			res.render('address', {qs:splitQuery(req.query.address)});
		    return res.end(data);
		}
	});
});

const server = http.createServer(app);

server.listen(8080, 'localhost', () => {
	console.log("Server is connected on port 8080!");
})  