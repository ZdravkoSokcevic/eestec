// const https = require('https');
const { https } = require('follow-redirects');
const URL = require('url').URL;
const querystring = require("querystring");
const FormData = require('form-data');
const Request = {};
const config = require('../config/api.json');
const Parser = require('./Parser');
const Base = require('./Base');


/*
	param request:Object
	props: url, data||[], method||GET, headers||[], returnType?, port?
*/
Request.request = (request)=> {
	return new Promise((res,rej) => {
		let r_data = '';
		request.url = Parser.getValidUrl(request.url);
		let url = new URL(request.url);
		let path = url.pathname??'/';
		let port = (url.protocol == 'http:')? 80 : 443;
		if(port in request)
			port = request.port;
		let headers = {}
		let data = {};
		if('headers' in request)
			headers = request.headers;
		if('data' in request)
			data = Request.getFormData(request.data);
		path += url.search;
		let options = {
			method: request.method ?? 'GET',
			hostname: url.hostname,
			path: path,
			port: port,
			headers: headers,
			data: data,
			maxRedirects: 10
		}
		console.log('## OPTIONS ##');
		console.log(options);
		const req = https.request(options, response => {
			// console.log(response);
			response.on('data', chunk => r_data += chunk);

			response.on('end', () => res(r_data));
		})

		req.on('error', err => {
			console.log(err);
			rej(err);
		})

		req.end();
	});
}

Parser.getValidUrl = (url = "") => {
    newUrl = url.trim().replace(/\s/g, "");

    if(/^(:\/\/)/.test(newUrl)){
        return `http${newUrl}`;
    }
    if(!/^(f|ht)tps?:\/\//i.test(newUrl)){
        return `http://${newUrl}`;
    }

    return newUrl;
};

Request.getFormData = data => {
	const formData = new FormData();
	for(let i in data) {
		formData.append(i, data.i);
	}
	return formData;
}

const testRequests = async() => {
	let input = '89.216.25.22';
	let inputs = Parser.parseInput(input);
	input = await Parser.findAddressFromString(input);
	let req_config = await Request.correctRequest(input, config[0]);
	let data = await Request.request(req_config);
	// data from request
	// console.log(data);
	return 'bla';
}

const placeholders = [
	'apiKey',
	'url',
	'ip',
	'base64_ip'
];

Request.correctRequest = async(input,config) => {
	if(input == false || (input.type == null)||(input.value == null))
		return '';
	let {value,type} = input;
	if(type == 'ip')
		config[type] = value; // config['ip'] = 89.216.25.22 // config['url'] = 
	if(type == 'url')
		value = querystring.escape(value); // ne znam
	input = await Parser.getCorrectValueForInput(input, config);
	if(!input)
		return false;
	placeholders.forEach(placeholder => {
		if(placeholder in config) {
			if(placeholder != 'url')
				config.url = config.url.replace('%%' + placeholder + '%%', config[placeholder]);
			else {
				config.url = config.url.replace('%%' + placeholder + '%%', value);
			}
		}
		else if(placeholder == 'base64_ip')
			config.url = config.url.replace('%%' + placeholder + '%%', input.value);
	})
	return config;
}

// testRequests()
// .then(res => {
// 	console.log(res);
// })
// .catch(err => {
// 	console.log(err);
// })

module.exports = Request;