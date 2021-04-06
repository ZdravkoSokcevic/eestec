const Base = {};
const Request = require('./Request');
const Parser = require('./Parser');
const conf = require('../config/api');

Base.search = async(req,res) => {
	let url = req.body.search;
	let query = req.query;
	let inputs = Parser.parseInput(url);
	console.log(`##${inputs}##`);
	console.log(inputs);
	let allData = [];
	allData = await Base.processAllRequests(inputs);
	// query.debug = 'sfgdg';
	if('debug' in query) {
		res.setHeader('Content-Type', 'application/json');
		res.render('results', {debug: allData});
	}else {
		res.setHeader('Content-Type', 'text/html');
		res.render('results', {content: allData});
	}
}

Base.processAllRequests = async inputs => {
	let allData = [];
	let allRequests = [];
	let results = {};
	for(let i=0; i<inputs.length; i++) {
		const config = JSON.parse(JSON.stringify(conf));
		let argumentFromInputField = inputs[i];
		let inputKey = Date. now();
		if(argumentFromInputField == '')
			continue;
		let parsedData = {};
		// let isDataComplete = false;
		// console.log(config);
		for(let x=0;x<config.length; x++) {
			let api = config[x];
			// let oneResult={};
			let parsedArgumentFromInputField = await Parser.findAddressFromString(argumentFromInputField);
			if(parsedArgumentFromInputField == '') {
				console.log('## Nastavio dalje 1 ##');
				continue;
			}
			api = await Request.correctRequest(parsedArgumentFromInputField, api);
			// console.log({
			// 	'itemType' : parsedArgumentFromInputField.type.toUpperCase(),
			// 	'ApiType': api.paramType.toUpperCase()
			// });
			// console.log(api);
			if(api == '' || !api) {
				console.log('## Ne valja config trenutni ##');
				continue;
			}
			if((parsedArgumentFromInputField.type.toUpperCase() !== api.paramType.toUpperCase())  && api.paramType !== 'universal') {
				console.log('## Nastavio dalje 2 ##');
				continue;
			}
			let request = Request.request(api)
			.then(async response => {
				// console.log(response);
				if(typeof Parser[api['parseMethod']] === 'function') {
					// console.log("## CONFIG 1");
					// console.log(config)
					parsedData = await Parser[api['parseMethod']](api, response);
				}else {
					// console.log("## CONFIG 2");
					// console.log(config)
					parsedData = await Parser.defaultParseData(api, response);
				}
				let oneResult = {
					key: inputKey,
					inputIndex: i,
					configIndex: x,
					url: argumentFromInputField,
					results:{parsedData:parsedData, api:api}
				};
				results[oneResult.key] = oneResult;

			})
			.catch(err => {
				console.log(err)
			});

			// push promises
			allRequests.push(request);
		}
		// console.log(JSON.stringify(allData.results))
	}	
	return Promise.allSettled(allRequests)
	.then(responses => {
		return results;
	})
}

module.exports = Base;