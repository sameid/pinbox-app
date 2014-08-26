(function(){
	document.config = {
		host: "http://192.168.11.44:8080/api"
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