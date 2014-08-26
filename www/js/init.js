(function(){

	var PRODUCTION = {
		protocol: 'http',
		host: 'pinbox-api.jit.su',
		port: 80,
		api_endpoint: '/api',
		ws_endpoint: '/echo'
	}

	var DEVELOPMENT = {
		protocol: 'http',
		host: '192.168.1.117',
		port: 8080,
		api_endpoint: '/api',
		ws_endpoint: '/echo'
	}

	var e = PRODUCTION;

	document.config = {
		host: e.protocol + '://' + e.host + ':' + e.port + e.api_endpoint,
		sockjs: e.protocol + '://' + e.host + ':' + e.port + e.ws_endpoint
	}

	document.userHasSession = function (){
		var hasSession = window.localStorage.getItem("isLoggedIn");
		if (hasSession == "true") return true;
		else return false;
	}

	document.currentUser = function (){
		var user  = window.localStorage.getItem("currentUser");
		// console.log(user);
		if (user) return JSON.parse(user);
		else return false
	}

	document.api = {}
	// FastClick.attach(document.body);
}());