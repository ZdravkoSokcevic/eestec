const dns = require('dns');
const Parser = {};

Parser.domainToIp = domain => {
	return new Promise((res,rej) => {
		dns.lookup('example.org', (err, address, family) => {
			if(err) res(err);
			else res(address);
		  // console.log('address: %j family: IPv%s', address, family);
		});

	})
}

Parser.ipToDomain = (ip, port=80) => {
	return new Promise((res,rej) => {
		const dnsPromises = dns.promises;
		dnsPromises.lookupService(ip, 80).then((result, domain) => {
		  // console.log(result.hostname, result.service);
		  // Prints: localhost ssh
		  res(result);
		}).catch(err => {
			rej(err);
		});
	})
}

Parser.reverseLookup = (ip) => {
	dns.reverse(ip,function(err,domains){
		if(err!=null)	callback(err);

		domains.forEach(function(domain){
			dns.lookup(domain,function(err, address, family){
				console.log(domain,'[',address,']');
				console.log('reverse:',ip==address);
			});
		});
	});
}

// domainToIp('http://google.com');
// const findDoamin = async ip => {
// 	let result = await ipToDomain(ip);
// 	console.log(result);
// }

// ipToDomain('89.216.25.22').then(res => {
// 	console.log(res);
// })

Parser.csvParser = data => {

}


Parser.parseInput = input => {
	let data = '';
	input = input.replace(", ", "%%");
	input = input.replace(" ", "%%");
	input = input.replace(",", "%%");
	input = input.replace(";", "%%");
	// input = input.replace(0x, "%%");
	input = input.replace("\n", "%%");
	input = input.replace("<br>", "%%");
	input = input.replace("<br/>", "%%");

	data = input.split("%%");
	let final = [];
	for(let x=0; x<data.length; x++) {
		let str = data[x].replace(" ", "",(data[x]));
		if(str !== '')
			final.push(str);
	}
	// data = input;
	console.log(final);
	return final;
}

Parser.defaultParseData = data => {
	return JSON.parse(data);
	// try {
	// 	let parsed = JSON.parse(data);
	// 	return parsed;
	// } catch(e) {
	// 	// statements
	// 	return data;
	// }
}

// Parser.ipQualityScoreParser = data => {

// }

// address: "93.184.216.34" family: IPv4
module.exports = Parser;
