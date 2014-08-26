
App.controller('splash-2', function (page) {

	$(page).find('#big-pin').append('@' + document.currentUser().name)
	
	var dp = $(page).find('#dp');
	var dp_upload = $(page).find('#dp-upload');

	dp.attr('src', document.config.host + '/pins/' + document.currentUser().hash + '/pic');

	dp.click(function(){
		dp_upload.click();
	})

	dp_upload.get(0).onchange = function(e) {
		var file = $(page).find(dp_upload)[0].files[0];
		console.log(file);
		var url = document.config.host + "/pins/" + document.currentUser().hash + "/pic";
		var formData = new FormData();
		formData.append('pic', file);

		$.ajax({
			url: url,
			data: formData,
			crossDomain: true,
			type: 'POST',
			success:function(data){
				console.log(data);
				dp.attr('src', document.config.host + '/pins/' + document.currentUser().hash + '/pic');

			},
			error:function(err){
				console.log(err);
			},
			contentType: false,
			processData: false

		});
  	}
});