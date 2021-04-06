const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const otvoriHTML = async() => {
	let html = await fs.readFileSync('../api/novi.html');
	html = html.toString();
	// console.log(html);
	const dom = new JSDOM(html);
	console.log(html);
	let ht = dom.window.document.querySelectorAll('.oglasiRight');
	console.log(ht.length);
	for(let i=0; i<ht.length; i++) {
		console.log(ht[i].innerHTML);
		console.log("\n");
	}
}

otvoriHTML().then(()=> {
	console.log('otvoren');
})
.catch(e=> {
	console.log(e);
});