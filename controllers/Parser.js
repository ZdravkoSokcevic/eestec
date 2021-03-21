const dns = require('dns');
const Parser = {};
// const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const {exec} = require('child_process');

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

const specialchars = [
	", ",
	" ",
	",",
	";",
	"\u002c",
	"\n",
	"<br>",
	"<br/>",
];

Parser.parseInput = input => {
	let data = '';
	for(let x=0; x<specialchars.length; x++) {
		input = input.replace(specialchars[x], "%%");
	}

	data = input.split("%%");
	let final = [];
	for(let x=0; x<data.length; x++) {
		let str = data[x].replace(" ", "",(data[x]));
		if(str !== '') {
			// Avoid duplicates
			final.push(str);
		}
	}
	// data = input;
	return final;
}

Parser.defaultParseData = (config, data) => {
	// thow new Error('dgfdgfd');
	if(config && config.returnType && config.returnType == 'json')
		return JSON.parse(data);
	else if(config && config.returnType == 'HTML') {
		return data;
	}
	// try {
	// 	let parsed = JSON.parse(data);
	// 	return parsed;
	// } catch(e) {
	// 	// statements
	// 	return data;
	// }
}

Parser.htmlDoc = (config, html) => {
	const dom = new JSDOM(html);
	// console.log(dom);
	console.log(config);
	if(config.name == 'Opswat')
	{
		// console.log(html);
		// exec("echo sdfsdf >> file.html", (error, stdout, stderr) => {
		//     if (error) {
		//         console.log(`error: ${error.message}`);
		//         return;
		//     }
		//     if (stderr) {
		//         console.log(`stderr: ${stderr}`);
		//         return;
		//     }
		//     console.log(`stdout: ${stdout}`);
		// });
		// fs.writeFile('html.txt', html, function (err) {
		// 	if(err)console.log(err);
		// });
	}
	console.log(config["infectedSelector"]);
	let value = 'Failed from htmlDoc parser!';
	try {
		// let infectedSlector =  dom.window.document.querySelectorAll(config["infectedSelector"]);
		let infectedSlector = dom.window.document.querySelectorAll('p.infoText');
		console.log(infectedSelector);
		console.log(config["infectedSelector"]);
		if(infectedSelector[0].innerHTML == config["infectedStringValue"]) {
			//sus
			value = infectedSelector[0].innerHTML;
		} else if (safeSelector[0].innerHTML == config["safeStringValue"]) {
			//notSus
			value = infectedSelector[0].innerHTML;
		}	
	} catch(e) {
		// statements
		// console.log(e);
	}

	try {
		// let safeSelector =  dom.window.document.querySelectorAll(config["safeSelector"]);
		let safeSelector = dom.window.document.querySelectorAll('p.infoText');
		console.log(safeSelector);
		if(safeSelector[0].innerHTML == config["infectedStringValue"]) {
			//sus
			value = safeSelector[0].innerHTML;
		} else if (safeSelector[0].innerHTML == config["safeStringValue"]) {
			//notSus
			value = safeSelector[0].innerHTML;
		}
	} catch(e) {
		// statements
		// console.log(e);
	}

	return [{
		site: config.name,
		columName : 'Suspecious',
		columnValue: value
	}];
}

// Parser.virusTotalParser = (config, jsonData) => {
// 	console.log(`JSON DATA ${JSON.stringify(jsonData)}`);
// 	if(jsonData && jsonData[0]) {
// 		console.log(jsonData[0])
// 	}
// 	return [{
// 		site: config.name,
// 		columName : 'Virustotal',
// 		columnValue: 'value'
// 	}];
// }
Parser.opswatParserOld = (config, html)=> {
	return Parser.htmlDoc(config, html);
}

Parser.opswatParserSecondAttempt = async (config, html)=> {
	const sc = require("scrapper-tools")
	const path = require("path")
	console.log(config.url);
  await sc.fastPage().setUserDataDir(path.join(__dirname, "/../.userDataDir"))
  await sc.fastPage().setWindowSizeArg({ width: 1660, height: 960 })
  await sc.fastPage().setDefaultNavigationTimeout(120 * 1000)
  // await sc.fastPage().setHeadless(false)
  await sc.fastPage().setHeadless(true)

  let page = await sc.fastPage().newPage()
  await page.goto(config.url, { waitUntill: "networkidle2" })
  await page.close()
  // let element = await page?.document?.querySelectorAll('p');

  // At the end don't forget to close browser
  await sc.fastPage().closeBrowser()

	return Parser.htmlDoc(config, html);
}

Parser.opswatParser = async (config, html)=> {
	const HTMLParser = require("node-html-parser");
	const puppeteer = require("puppeteer");

	const content = await getHtmlFromUrl(config.url)


}

async function getHtmlFromUrl(url) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url);

  const content = HTMLParser.parse(await page.content());

  await browser.close();
  return content;
}

// fun
// const getParsed = async() => {
// 	let file = fs.readFileSync('../api/noninfected.html');
// 	// let url = 'https://exchange.xforce.ibmcloud.com/ip/%%ip%%';
// 	const results = fs.createWriteStream('./usecases.txt');
// 	// const 
// 	Parser.htmlDoc(file);
// }
// getParsed();
Parser.ipQualityScoreParser = (config, jsonData) => {
	let res = JSON.parse(jsonData)["unsafe"]

	if(typeof res === "undefined") res = "Failed"

	return {site: config.name, columnName: "Suspecius", columnValue:  res}
}

Parser.IbmCloudParser = (config, html) => {
	return Parser.htmlDoc(config, html);
}

// address: "93.184.216.34" family: IPv4
module.exports = Parser;
