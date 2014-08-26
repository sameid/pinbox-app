document.host = "http://192.168.1.117:8080/api"

var api = {
	createPin: function (data, callback){
		$.ajax({
			type:'POST',
			url: document.host + '/pins',
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
			api.createPin({
				pin: newpin,
				password: newpass
			}, function (data){
				console.log(data);

			});
		}

		

	});



});

