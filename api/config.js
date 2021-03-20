const config = [
	{	
		name:"ipQualityScore",
		apiKey: "UlI8Gpaa8wSFpgSPalBvG5VoxJb9RzvR",
		url: "https://ipqualityscore.com/api/json/url/%%apiKey%%/%%url%%",
		priority: 1,
		parseMethod: "ipQualityScoreParser",
		returnType: "json",
		type: "GET"
	},{
		name:"",
		url: "https://exchange.xforce.ibmcloud.com/ip/%%ip%%",
		priority: 2,
		parseMethod: "exchangeXForce",
		returnType: "HTML",
		type: "GET"
	},{	
		name:"ipQualityScore",
		apiKey: "UlI8Gpaa8wSFpgSPalBvG5VoxJb9RzvR",
		url: "https://ipqualityscore.com/api/json/url/%%apiKey%%/%%url%%",
		priority: 1,
		parseMethod: "ipQualityScoreParser",
		returnType: "json",
		type: "POST",
		dataParam: "file"
	},
]