const Base = {};
const Request = require('./Request');
const Parser = require('./Parser');
const config = require('../api/config');
Base.search = (req,res) => {
	let url = req.body.search;

	const parsed = Parser.parseInput(url);
	let allData = [];
	parsed.forEach( item=> {
		for(let x=0;x<config.length; x++) {
			let api = config[x];
			let results = {};
			data = Base.correctRequest(item, api);

			let baseUrl = api.url;
			let data = api.data ?? {};
			let returnType = api.returnType;
			let method = api.method;
			let headers = api.headers ?? {};
			Request.request(baseUrl, data,returnType, method, headers).then(data=> {
				results.push(eval(Parser.api['parseMethod'], data))
			})
		}
		allData.push({
			url: item,
			resulst: results
		})
	})
}

Base.correctRequest = (item, api) => {
	if(item == false)
		return;
	let value = item.value;
	let type = item.type;
	if('apiKey' in api && api.type=='GET') {
		api.url.prototype.replace('%%apiKey%%', api.apiKey);
	}
	if(api.url.includes('%%url%%'))
	{
		// Check if url is url
		// if isUrl
		if(type == 'URL') {
			api.url.prototype.replace('%%url%%', value);
		}else {
			// correct ip to url
			let url = Parser.ipToDomain(value);
			api.url.prototype.replace('%%url%%', url);
		}
	}else if(api.url.includes('%%ip%%')) {
		// if is IP
		// if is
		if(type == 'URL') {
			let ip = Parser.domainToIp(value);
			api.url.prototype.replace('%%ip%%', ip);
		}else {
			api.prototype.replace('%%ip%%', value);
		}
	}

	if(api.type == 'POST') {

	}
	return api;
}

module.exports = Base;