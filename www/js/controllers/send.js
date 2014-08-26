var api = document.api;

api.send = {
	findThreadByPinHash: function(data, callback){
		$.ajax({
			type:'GET',
			url: document.config.host + '/threads/' + data.thread_,
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
	createThread: function(data, callback){
		$.ajax({
			type:'POST',
			url: document.config.host + '/threads',
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
	},
	addPinToThread: function(data, callback){
		$.ajax({
			type:'POST',
			url: document.config.host + '/threads/'+ data.thread_hash+'/addPin',
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
	},
	createMessage: function(data, callback){
		$.ajax({
			type:'POST',
			url: document.config.host + '/messages',
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

App.controller('send', function(page){
	var currentPin = document.currentUser();

	var recipient_pins = $(page).find("#recipient-pins");

	var tagApi = recipient_pins.tagsManager({
		onlyTagList:true,
		externalTagId:true
    });

	var pinsbh = new Bloodhound({
		datumTokenizer: function (datum) {
			return Bloodhound.tokenizers.whitespace(datum.value);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: document.config.host+'/search/%QUERY',
			filter: function (pins) {
				return $.map(pins, function (pin) {
					return {
						value: pin.pin,
						hash: pin.hash
					};
				});
			}
		}
	});

	// Initialize the Bloodhound suggestion engine
	pinsbh.initialize();

	// Instantiate the Typeahead UI
	recipient_pins.typeahead(null, {
		displayKey: 'value',
		source: pinsbh.ttAdapter()
	}).on ('typeahead:selected', function(e,d){
		console.log(d);
		tagApi.tagsManager("pushTag", d.value, false, d.hash);
	});


	$(page).find("#send-new-message").click(function(){

		var pin_hashes = tagApi.tagsManager('tagIds');
		pin_hashes.push(currentPin.hash);
		var message_content = $(page).find("#new-message").val();

		if (pin_hashes.length > 0 && message_content.length > 0){
			api.send.createThread({
					pin_hashes: JSON.stringify(pin_hashes)
			}, function(response){
				response = JSON.parse(response.responseText);
				if (response.success){
					var thread_hash = response.thread.hash
					api.send.createMessage({ 
						sender_name: currentPin.name,
						sender_hash: currentPin.hash, 
						content: message_content, 
						thread_hash: thread_hash 
					}, function(_response){
						console.log(_response);
						_response = JSON.parse(_response.responseText);
						if (_response.success){
							console.log(_response);
							console.log('Message sent successfully.');
							App.load('thread', response.thread);	
						}	
					});
				}
			})
		}
		else {
			console.log('no hashes, or empty message');
		}
	});

	$(page).find("#cancel-send").click(function(){
		// App.back();
	});
});
