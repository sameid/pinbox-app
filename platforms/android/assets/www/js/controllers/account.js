var api = document.api;

api.account = {
	login: function(username, password, callback){
		$.ajax({
			type:'POST',
			url: document.config.host + '/login',
			data: {
				'username': username,
				'password': password
			},
			success:function(data){
				callback(data);
			},
			error:function(err){
				callback(err);
			},
    		crossDomain: true,
    		dataType: 'form-data'
		});
	},
	logout : function (callback){
		$.ajax({
			type:'GET',
			url: document.config.host + '/logout',
			success:function(data){
				callback(data);
			},
			error:function(err){
				callback(err);
			},
    		crossDomain: true,
    		dataType:'application/x-www-form-urlencoded'
		});
	}
}

App.controller('signin', function (page) {
	$(page).find("#sign-in-back").click(function(){
		App.back();
	})

	$(page).find("#sign-in").click(function(){
		spin.start('spinner');
		var username = $(page).find('#pin-box').val();
		var password = $(page).find('#password-box').val();

		setTimeout(function (){
			document.api.account.login(username, password, function(_response){
				_response = JSON.parse(_response.responseText);
				if (_response.success){
					console.log('Login Successful.');
					window.localStorage.setItem("isLoggedIn", true);
					window.localStorage.setItem("currentUser", JSON.stringify(_response.pin));
					App.load('inbox');
				}
				else {
					console.log(_response);
					window.localStorage.setItem("isLoggedIn", false);
				}
				spin.stop('spinner');
			});
		}, 1000)
	});
});
