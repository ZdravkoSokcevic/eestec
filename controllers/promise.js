const https = require('https');

const doRequest = (url) => {
	return new Promise((res,rej) => {
		https.get(url, (response)=> {
			response.setEncoding('utf8');
			let chunk = '';
			response.on('data', d => {
				chunk+=d+"\n";
			});
			response.on('end', () => {
				res(chunk);
			});
		})
		.on('error', err=> {
			rej(err);
		})
	})
}


let url = 'https://api.ipify.org/?format=txt';

const doRequests = async() => {
	let data = '';
	let promises = [];
	for(let i=0; i<100; i++) {
		promises.push(
			doRequest(url)
			.then(response=> {
				console.log(i);
				data+=response + "\n";
			})
		);
	}
	return Promise.allSettled(promises)
	.then(responses => {
		// console.log(data);
		return data;
	});
}
doRequests().then(response => {
	console.log(response);
});

const doRequestSequential = async() => {
	let data = '';
	for(let i=0; i<100; i++) {
		data+= await doRequest(url);
		console.log(i);
	}
	return data;
}
// doRequestSequential().then(response => {
// 	console.log(response);
// });

