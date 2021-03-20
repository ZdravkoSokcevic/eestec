const Base = {};
const Request = require('./Request');
Base.search = (req,res) => {
	let url = req.body.search;
	console.log(url);
	Request.request(url, {},'', 'GET').then(data=> {
		res.end(JSON.stringify({data:data}));
	})
}

module.exports = Base;