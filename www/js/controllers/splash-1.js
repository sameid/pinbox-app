var api = document.api;

api.splash = {
	createPin: function (data, callback){
		$.ajax({
			type:'POST',
			url: document.config.host + '/pins',
			data :data,
			success:function(data){
				callback(data);
			},
			error:function(err){
				callback(err);
			},
    		crossDomain: true,
    		dataType: 'form-data'
		});
	}
}


App.controller('splash-1', function (page) {

	$(page).find("#create-pin").click(function (){
		console.log('hit');
		// App.load('splash-2');
		var newpin = $(page).find('#newpin').val();
		var newpass = $(page).find("#newpassword").val();

		var newpin_obj = $(page).find("#newpin");
		var newpass_obj = $(page).find("#newpass");

		var alert = $(page).find("#alert");

		if (newpin.length < 2){
			alert.empty();alert.show();
			alert.append('Minimum 2 characters.');
		}
		else if (newpin.indexOf(' ') != -1){
			alert.empty();alert.show();
			alert.append('No Spaces are allowed in your pin.');
		}
		else if (newpass.length < 6){
			alert.empty();alert.show();
			alert.append('Password must be minimum 6 characters in length.');
		}
		else {
			alert.empty();alert.hide();
			
			// $(page).find("#create-pin").hide();
			spin.start('spinner');

			api.splash.createPin({
				pin: newpin,
				password: newpass
			}, function (response){
				response = JSON.parse(response.responseText);
				if (response.success){
					console.log('New Pin Created Successfully.', response );
					setTimeout(function (){
						api.account.login(newpin, newpass, function(_response){
							_response = JSON.parse(_response.responseText);
							console.log('Login was successful.', _response);
							if (_response.success){
								console.log('Login Successful.');
								window.localStorage.setItem("isLoggedIn", true);
								window.localStorage.setItem("currentUser", JSON.stringify(_response.pin));
								App.load('splash-2');
							}
							else {
								window.localStorage.setItem("isLoggedIn", false);
							}
							// $(page).find("#create-pin").hide();
							spin.stop('spinner');
						});
					}, 3000)
					
				}
			});
		}
	});



});

