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
		let argumentFromInputField = inputs[i];
		if(argumentFromInputField == '')
			continue;
		let results = [];
		let parsedData = {};
		let isDataComplete = false;
		for(let x=0;x<config.length; x++) {
			let api = config[x];
			let parsedArgumentFromInputField = await Base.findAddressFromString(argumentFromInputField);
			if(parsedArgumentFromInputField == '')
				continue;
			api = await Base.correctRequest(parsedArgumentFromInputField, api);
			// console.log({
			// 	'itemType' : parsedArgumentFromInputField.type.toUpperCase(),
			// 	'ApiType': api.paramType.toUpperCase()
			// });
			if((parsedArgumentFromInputField.type.toUpperCase() !== api.paramType.toUpperCase())  && api.paramType !== 'universal') {
				continue;
			}
			if(api == '')
				continue;
			let baseUrl = api.url;
			let data = api.data ?? {};
			let returnType = api.returnType;
			let method = api.method;
			let headers = api.headers ?? {};
			let response = await Request.request(baseUrl, data,returnType, method, headers);
			if(typeof Parser[api['parseMethod']] === 'function') {
				// console.log("## CONFIG 1");
				// console.log(config)
				parsedData = await Parser[api['parseMethod']](api, response);
				if(parsedData) 
					isDataComplete = true;
			}else {
				// console.log("## CONFIG 2");
				// console.log(config)
				parsedData = await Parser.defaultParseData(api, response);
				if(parsedData)
					isDataComplete = true;
			}
			results.push({parsedData:parsedData, data:data});
		}
		if(isDataComplete)
			allData.push({
				url: argumentFromInputField,
				results: results
			})
		// console.log(JSON.stringify(allData.results))
	}
	res.setHeader('Content-Type', 'application/json');
	res.render('results', {content: allData});
}

Base.correctRequest = async(item, api) => {
	if(item == false || (item.type == null)||(item.value == null)) {
		// console.log(`ITEM: ${JSON.stringify(item)}`);
		//throw new Error('Data is not correct');
		return '';
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
			console.log('## URL1 ##')
			console.log(api.url);
		}else {
			// correct ip to url
			let url = await Parser.ipToDomain(value);
			if('hostname' in url) {
				url = url.hostname;
			}
			api.url = api.url.replace('%%url%%', url);
		}
	}else if(api.url.includes('%%ip%%')) {
		// if is IP
		// if is
		if(type == 'URL') {
			let ip = await Parser.domainToIp(value);
			api.url = api.url.replace('%%ip%%', ip);
		}else {
			api.url = api.url.replace('%%ip%%', value);
		}
	}else if(api.url.includes("%%base64_ip%%") && api.paramType == 'ip') {
		let buffer = new Buffer(value);
		api.url = api.url.replace('%%base64_ip%%', buffer.toString('base64'));
	}

	if(api.type == 'POST') {

	}
	// api.url = api.url.replace('%%%%')
	return api;
}

Base.findAddressFromString = async (findFrom) => {
	const IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
	const DOMAIN_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
	const NON_HTTP_PREFIX_REGEX = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

	if(findFrom == '' || (typeof findFrom == undefined) || !(typeof findFrom === 'string')) {
		console.log('## FIND ADDRESS FROM STRING FAILED ##')
		console.log(findFrom)
		return '';
	}
	let found = findFrom.match(IP_REGEX);
	if (found) {
		return {type : 'IP', value : found[0]}
	}
	found = findFrom.match(NON_HTTP_PREFIX_REGEX);
	if(found) {
		return {type : "URL", value : found[0]}
	}

	return {type : null, value: null}
}

module.exports = Base;