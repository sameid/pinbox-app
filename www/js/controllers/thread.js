var api = document.api;

api.thread = {
	findAllMessagesByThreadHash : function(data, callback){
		$.ajax({
			type:'GET',
			url: document.config.host + '/threads/' + data.thread_hash + '/messages',
			success:function(data){
				callback(data);
			},
			error:function(err){
				callback(err);
			},
    		crossDomain: true,
            contentType: 'application/json',
            dataType: 'json'
		});
	},
	findPinNamesByThreadHash: function (data, callback){
		$.ajax({
			type:'GET',
			url: document.config.host + '/threads/' + data.thread_hash + '/pins/' + data.pin_hash,
			success:function(data){
				callback(data);
			},
			error:function(err){
				callback(err);
			},
    		crossDomain: true,
            contentType: 'application/json',
            dataType: 'json'
		});
	}
}

App.controller('thread', function(page, thread){
	var user;



	var renderLeftMessage = function (message){
        return (
        	'<li class="message" id="'+message.hash+'">'+
        	'<div class="dp-thread"><img src="' + document.config.host + '/pins/' + message.sender.hash + '/pic" /></div>' +
        	'<div class="message-left shadow">' + message.content +
        	'<div class="message-meta">' + message.status + '</div></div></li>'
       );
	} 

	var renderRightMessage = function (message){
        return ('<li class="message message-right shadow" id="'+message.hash+'">'+
        	message.content +
        '<div class="message-meta">'+message.status+'</div></li>'
       );
	} 

	if(document.userHasSession()){
		user = document.currentUser();
		
		api.thread.findPinNamesByThreadHash({thread_hash:thread.hash, pin_hash:user.hash}, function(response){
			console.log(response);
			if (response.success){
				var title_pin = $(page).find('#title-pin');
				response.pins.forEach(function(pin){
					title_pin.append('@'+pin);
				});
			}
			
		})
		
		api.thread.findAllMessagesByThreadHash({thread_hash:thread.hash}, function (response){
			
			console.log(response);
			var thread_messages = $(page).find('#thread-messages');

			response.messages.forEach(function(message){
				message.status = moment(message.created).format('h:mm a')+ ' - @'+message.sender.name;
				// if(user.hash == message.sender.hash)thread_messages.append(renderRightMessage(message));
				// else thread_messages.append(renderLeftMessage(message));
				if(user.hash == message.sender.hash)$(renderRightMessage(message)).insertBefore('.message-spacer');
				else $(renderLeftMessage(message)).insertBefore('.message-spacer');
			});
			// $("html, body").animate({ scrollTop: $(document).height() }, "slow");

		});

		var sendButton = $(page).find('#send-message');
		sendButton.click(function(){
			var thread_messages = $(page).find('#thread-messages');
			var messageField = $(page).find('#message-box');
			var messageContent = messageField.val();

			messageField.val('');
			console.log(messageContent);
			var temp_hash = Math.floor(Math.random() * 1000);
			var message = {
				content: messageContent,
				hash: temp_hash,
				status: 'Sending...'
			}
			// console.log(renderRightMessage(message));
			$(renderRightMessage(message)).insertBefore('.message-spacer');

			if (messageContent.length > 0){
				console.log(user)
				var data = {
					sender_hash: user.hash,
					sender_name: user.name,
					content: messageContent,
					thread_hash: thread.hash
				}
				console.log(data);
				api.send.createMessage(data, function (response){
					response = JSON.parse(response.responseText);
					console.log(response);
					setTimeout(function (){
						if (response.success){
							var newMessage = response.messageObj;
							var messageTemplate = $(page).find('#'+temp_hash);
							var newStatus = moment(newMessage.created).format('h:mm a') + ' - @'+newMessage.sender.name;
							messageTemplate.find('.message-meta').html(newStatus);
							messageTemplate.attr('id',newMessage.hash );
						}
					}, 3000);

					//update status on message;
				})
			}
		})
	}

	sock.handleMessage = function(nm){
		console.log(nm);
		nm.status = moment(nm.created).format('h:mm a')+ ' - @'+nm.sender.name;
		$(renderLeftMessage(nm)).insertBefore('.message-spacer');
	}
});
