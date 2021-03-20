const dns = require('dns');
const Parser = {};

Parser.domainToIp = domain => {
	return new Promise((res,rej) => {
		dns.lookup('example.org', (err, address, family) => {
			res(address);
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
	data = input.split(/\n|,| /);
	
	return data;
}

Parser.ipQualityScoreParser = data => {

}

// address: "93.184.216.34" family: IPv4
module.exports = Parser;
