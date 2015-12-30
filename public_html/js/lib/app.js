define(['jquery', 'fingerprint2'], function($, Fingerprint2) {
	'use strict';

	return function ChatApp(options) {
		var _defaults = {
			'channelName': 'general',
			'channelFriendlyName': 'General',
			"identity": null,
			'chatBox': null,
			'userList': null,
			'numHistoryMessages': 50
		};

		var _commands = {};

		var _options = $.extend(_defaults, options);
		var _accessManager;
		var _messagingClient;
		var _channel;
		var _browserFingerprint;

		var init = function () {
			$.getJSON('token', {
					'fingerprint': _browserFingerprint
				}, initCallback)
				.fail(function (e) {
					_options.chatBox.addError('Could not retrieve JOT token. Please refresh your browser.');
					console.log(e);
				});
		};

		this.registerCommand = function (command, eventTrigger) {
			_commands[command] = eventTrigger;
		};

		var doCommand = function (message) {
			var cmdRegex = /^\/([a-zA-Z]*)\b(.*)/;
			var matches = cmdRegex.exec(message);

			if (!matches || !matches[1]) {
				return false;
			}

			var cmd = matches[1].toLowerCase();

			if (!(cmd in _commands)) {
				return false;
			}

			var event = _commands[cmd];

			var params = [];
			if (matches[2]) {
				params.push(matches[2].trim())
			}

			$(window).trigger(event, params);
			return true;
		};

		this.sendMessage = function (message) {
			var command = doCommand(message);

			if (command) {
				return;
			}

			_channel.sendMessage(message);
		};

		this.setTyping = function() {
			_channel.typing();
		};

		this.getIdentity = function () {
			return _options.identity;
		};

		var loadMessageHistory = function () {
			var messagesPromise = _channel.getMessages(_options.numHistoryMessages);
			messagesPromise.then(function (messages) {
				$.each(messages, function (i, message) {
					_options.chatBox.addMessage(message);
					_options.userList.addUser(message.author);
				});
			}).catch(function (rejection) {
				console.log(rejection);
				_options.chatBox.addError('There was an error loading message history.');
			});
		};

		// Set up channel after it has been found
		var setupChannel = function (channel) {
			// Join the general channel
			channel.join().then(function (_channel) {
				_options.chatBox.addInfo('Joined channel as ' + '<span class="me">' + _options.identity + '</span>.');
			});

			// Listen for new messages sent to the channel
			channel.on('messageAdded', function (message) {
				_options.chatBox.addMessage(message);
			});

			channel.on('memberJoined', function (member) {
				_options.chatBox.addInfo('User "' + member.identity + '" has joined.');
				_options.userList.addUser(member.identity);
			});

			channel.on('memberLeft', function (member) {
				_options.chatBox.addInfo('User "' + member.identity + '" has left.');
				_options.userList.removeUser(member.identity);
			});

			channel.on('typingStarted', function(member) {
				_options.chatBox.setUserTyping(member);
			});

			channel.on('typingEnded', function(member) {
				_options.chatBox.setUserDoneTyping(member);
			});

			loadMessageHistory();

			_options.chatBox.ready();
			$(window).trigger('chat-ready');
		};

		var refreshToken = function (data) {
			console.log('new token');
			console.dir(data);
			_accessManager.updateToken(data.token);
		};

		var initCallback = function (data) {
			_options.chatBox.addInfo('Initializing&hellip;');
			_options.identity = data.identity;

			// Initialize the IP messaging client
			_accessManager = new Twilio.AccessManager(data.token);
			_messagingClient = new Twilio.IPMessaging.Client(_accessManager);

			_messagingClient.on('tokenExpired', function () {
				$.getJSON('token', {
						'fingerprint': _browserFingerprint
					}, refreshToken)
					.fail(function (e) {
						_options.chatBox.addError('Could not update JOT token. Please refresh your browser.');
						console.log(e);
					});
			});

			var promise = _messagingClient.getChannelByUniqueName(_options.channelName);

			promise.then(function (channel) {
				_channel = channel;
				if (!_channel) {
					_messagingClient.createChannel({
						uniqueName: _options.channelName,
						friendlyName: 'Channel: ' + _options.channelFriendlyName
					}).then(function (channel) {
						_channel = channel;
						setupChannel(_channel);
					});
				} else {
					setupChannel(_channel);
				}
			}).catch(function (rejection) {
				_options.chatBox.addError('There was an error setting up the channel. Please refresh your browser.');
				console.log(rejection);
			});

			$(window).trigger('chat-init');
		};

		new Fingerprint2({
			excludeJsFonts: true,
			excludeFlashFonts: true,
			excludePlugins: true
		}).get(function (result) {
			_browserFingerprint = result;
			init();
		});
	}
});