const Base = {};
const Request = require('./Request');
const Parser = require('./Parser');
const config = require('../api/config');
var querystring = require("querystring");

Base.search = async(req,res) => {
	let url = req.body.search;

	let inputs = Parser.parseInput(url);
	let allData = [];
	for(let i=0; i<inputs.length; i++) {
		let item = inputs[i];
		let results = [];
		let parsedData = {};
		for(let x=0;x<config.length; x++) {
			let api = config[x];
			item = await Base.findAddressFromString(item);
			api = Base.correctRequest(item, api);
			let baseUrl = api.url;
			let data = api.data ?? {};
			let returnType = api.returnType;
			let method = api.method;
			let headers = api.headers ?? {};
			console.log(baseUrl);
			let response = await Request.request(baseUrl, data,returnType, method, headers);
			if(typeof Parser[api['parseMethod']] === 'function') {
				parsedData = Parser[api['parserMethod']](response);
			}else {
				parsedData = Parser.defaultParseData(response);
			}
			results.push({parsedData:parsedData, data:data});
		}
		allData.push({
			url: item,
			results: results
		})
		// console.log(JSON.stringify(allData.results))
	}
	res.setHeader('Content-Type', 'application/json');
	res.render('results', {content: allData});
}

Base.correctRequest = (item, api) => {
	if(item == false || (item.type == null)||(item.value == null)) {
		throw new Error('Data is not correct');
		return ;
	}
	let value = item.value;
	let type = item.type;
	value = querystring.escape(value);
	if('apiKey' in api && api.method=='GET') {
		api.url = api.url.replace('%%apiKey%%', api.apiKey);
	}
	if(api.url.includes('%%url%%'))
	{
		// Check if url is url
		// if isUrl
		if(type == 'URL') {
			api.url = api.url.replace('%%url%%', value);
		}else {
			// correct ip to url
			let url = Parser.ipToDomain(value);
			api.url = api.url.replace('%%url%%', url);
		}
	}else if(api.url.includes('%%ip%%')) {
		// if is IP
		// if is
		if(type == 'URL') {
			let ip = Parser.domainToIp(value);
			api.url = api.url.replace('%%ip%%', ip);
		}else {
			api.url = api.url.replace('%%ip%%', value);
		}
	}

	if(api.type == 'POST') {

	}
	// console.log('## API ##');
	// console.log(api);
	api.url = api.url.replace('%%%%')
	return api;
}

Base.findAddressFromString = async (findFrom) => {
	const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
	const DOMAIN_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
	const NON_HTTP_PREFIX_REGEX = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

	let found = findFrom.match(IP_REGEX);
	if (found) {
		return {type : 'IP', value : found[0]}
	}
	found = findFrom.match(DOMAIN_REGEX);
	if(found) {
		return {type : "URL", value : found[0]}
	}

	return {type : null, value: null}
}

module.exports = Base;