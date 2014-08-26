var api = document.api;

api.inbox = {
	readAllThreads : function(data, callback){
		$.ajax({
			type:'GET',
			url: document.config.host + '/pins/' + data.pin_hash + '/threads',
			success:function(data){
				callback(data);
			},
			error:function(err){
				callback(err);
			},
			crossDomain: true,
            // contentType: 'application/json',
            dataType: 'json'
        });
	}
}

App.controller('inbox', function(page){

	// sock.handleMessage = function()

	var user;
	var renderThread = function (thread){
		return ('<li class="thread-item" id="'+thread.hash+'">'+
			'<div class="profile"><img src="http://api.randomuser.me/portraits/lego/1.jpg" /></div>'+
			'<div class="content"><div class="content-meta">'+
			'<div class="content-meta-left">@'+thread.pseudo+'</div>'+
			'<div class="content-meta-right">'+moment(thread.lm.created).format('h:mm a')+ '</div><div style="clear: both;"></div>'+
			'</div>'+
			'<div class="content-message">'+thread.lm.content+'</div>'+
			'</div></li>'
			);
	} 

	if(document.userHasSession()){
		user = document.currentUser();

		$(page).find('#pinbox-title').append(' - @'+ user.name)

		api.inbox.readAllThreads({pin_hash:user.hash}, function (response){
			console.log(response);
			var pinbox = $(page).find('.pinbox');
			response.threads.forEach(function(thread){
				api.thread.findPinNamesByThreadHash({
					thread_hash: thread.hash,
					pin_hash: user.hash
				}, function(_response){
					thread.pseudo = _response.pins;
					pinbox.append(renderThread(thread));
					$(page).find("#"+thread.hash).click(function(){
						console.log(this.id);
						App.load('thread', thread);
					});

				});
				
			});


		});
	}

	$(page).find('#menu').click(function(){
		//testing
		App.dialog({
			title        : '',
			newChatButton : 'Start a new chat...',
			signOutButton  : 'Sign out',
			aboutButton : 'About'
		}, function (choice) {
			switch (choice) {
				case 'newChat':
				console.log('newChat');
				App.load('send');
				break;
				case 'signOut':
				api.account.logout(function (data){
					var response = JSON.parse(data.responseText);
					if (response.success){
						window.localStorage.setItem("isLoggedIn", false);
						window.localStorage.clear("currentUser");
						App.load("splash-1");
					}
				});
				break;
				case 'about':
				break;
			}
		});
	});

		
});
