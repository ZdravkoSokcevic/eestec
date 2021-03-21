const https = require('https');
const URL = require('url');
const Request = {};
Request.request = (url, data, returnType, method, headers=false)=> {
	return new Promise((res,rej) => {
		if(method == 'GET') {
			https.get(url, response=> {
				let chunk = '';
				response.on('data', d => {
					chunk+=d;
				});
				response.on('end', () => {
					res(chunk);
				});
			})
			.on('error', () => {
				console.log('## HTTP REQUEST GET ERROR ##');
				res('');
			});
		}else {
			const hostname = url.split('/')[0];
			const path =  URL.parse(url).pathname;
			const options = {
				hostname: url,
				path: path,
				method: method,
				port: 80,
				data: data??''
			}
			console.log(options);
			const req = https.request(options, response => {
			  console.log(`statusCode: ${res.statusCode}`)
			  let chunk=''
			  response.on('data', d => {
			    chunk+=d;
			  })

			  response.on('end', () => {
			  	// Parse response type
			  	res(chunk);
			  });
			});

			req.on('error', error => {
				console.log('error');
			  console.error(error)
			});

		}
	});
}

module.exports = Request;