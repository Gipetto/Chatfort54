jQuery(function($) {
	"use strict";

	marked.setOptions({
		gfm: true,
		tables: false,
		sanitize: true,
		smartypants: true
	});

	var accessManager;
	var messagingClient;

	function ChatMessage(message) {
		var _message = message;
		var _userColor = '#000';

		// run all processing methods against the message
		var processMessage = function(messageText) {
			var message = messageText;

			message = marked(message, function(err, content) {
				if (err) {
					console.group();
					console.log(err);
					console.log(content);
					console.groupEnd();
				}
				return content;
			});

			message = fixUpMessage(message);

			return message;
		};

		var fixUpMessage = function(message) {
			var $message = $('<div></div>').append($(message));

			// we can't have <pre> elements being the first item
			// they format the entire thing funny, and that ain't funny
			if ($message.find(':first').is('pre')) {
				$message.prepend($('<p>&nbsp;</p>'));
			}

			return $message.html();
		};

		// format this message for HTML output
		var formatMessage = function(messageBody) {
			var _self = this;

			var $msg = $('<span></span>', {
				'class': 'message',
				'html': messageBody
			});

			var $time = $('<span></span>', {
				'class': 'time',
				'text': getTime(message.timestamp)
			});

			var $user = $('<span></span>', {
				'class': 'username',
				'text': _message.author
			}).css({ "color": _userColor });

			if (_message.author === chatApp.getIdentity()) {
				$user.addClass('me');
			}

			var $meta = $('<span></span>', {
				'class': 'meta'
			}).append($time).append($user);

			$msg.find(':first').prepend($meta);

			return $('<div></div>', {
				'class': 'message-container'
			}).append($msg);
		};

		var getTime = function(dateObj) {
			var hour = dateObj.getHours();
			var minutes = dateObj.getMinutes();
			var meridian = hour >= 12 ? 'PM' : 'AM';
			return ((hour + 11) % 12 + 1) + ':' + (minutes < 10 ? '0' + minutes : minutes) + meridian;
		};

		// override the default user color
		this.setUserColor = function(color) {
			_userColor = color;
		};

		// public function to retrieve formatted message
		this.format = function() {
			var _text = processMessage(_message.body);
			return formatMessage(_text);
		};
	}

	function ChatBox(options) {
		// http://www.paulirish.com/2009/random-hex-color-code-snippets/
		var randomColor = function() {
			return '#' + Math.floor(Math.random() * 16777215).toString(16);
		};

		var getUserColor = function(userName) {
			var _self = this;
			if (userName in users) {
				return users[userName];
			}

			var color = randomColor();
			while ($.inArray(color, colors) >= 0) {
				color = randomColor();
			}

			users[userName] = color;
			colors.push(color);

			return users[userName];
		};

		this.addMessage = function(message) {
			var _message = new ChatMessage(message);
			_message.setUserColor(getUserColor(message.author));
			this.chatBox.append(_message.format());
		};

		this.addInfo = function(text) {
			var $msg = $('<div></div>', {
				'class': 'info',
				'html': text
			});
			this.chatBox.append($msg);
		};

		var listenTo = function(selector) {
			return $(selector).on('keydown', function(e) {
				var _this = $(this);
				if (e.keyCode == 13) {
					e.preventDefault();
					e.stopPropagation();
					chatApp.sendMessage(_this.val());
					_this.val('');
				}
			});
		};

		this.ready = function() {
			chatInput.prop('disabled', false);
		};

		this.chatBox = $(options.selector);
		var chatInput = listenTo(options.input);
		var colors = [];
		var users = {};
	}

	function UserList(options) {
		var defaults = {
			'selector': null,
			'item': '<li></li>',
			'itemClass': 'menu-item'
		};
		var _options = $.extend(defaults, options);
		var $userList = $(_options.selector);

		this.addUser = function(identity) {
			var userSelector = '[member-identity="' + identity + '"]';
			if ($userList.find(userSelector).length) {
				return;
			}

			var $user = $(_options.item, {
				'member-identity': identity,
				'class': _options.itemClass,
				'text': identity
			});

			$userList.append($user);
		};

		this.removeUser = function(identity) {
			var $user = $userList.find('[member-identity="' + identity + '"]');

			if ($user) {
				$user.remove();
			}
		};
	}

	function ChatApp(options) {
		var _defaults = {
			'channelName': 'general',
			'channelFriendlyName': 'General',
			"identity": null,
			'chatBox': null,
			'userList': null
		};

		var _options = $.extend(_defaults, options);
		var _channel;

		this.init = function() {
			$.getJSON('token', initCallback)
				.fail(function(e) {
					console.log(e);
				});
		};

		this.sendMessage = function(message) {
			_channel.sendMessage(message);
		};

		this.getIdentity = function() {
			return _options.identity;
		};

		// Set up channel after it has been found
		var setupChannel = function(channel) {
			// Join the general channel
			channel.join().then(function(_channel) {
				_options.chatBox.addInfo('Joined channel as ' + '<span class="me">' + _options.identity + '</span>.');
			});

			// Listen for new messages sent to the channel
			channel.on('messageAdded', function(message) {
				_options.chatBox.addMessage(message);
			});

			channel.on('memberJoined', function(member) {
				_options.chatBox.addInfo('User "' + member.identity + '" has joined.');
				_options.userList.addUser(member.identity);
			});

			channel.on('memberLeft', function(member) {
				_options.chatBox.addInfo('User "' + member.identity + '" has left.');
				_options.userList.removeUser(member.identity);
			});

			var messagesPromise = channel.getMessages('50');
			messagesPromise.then(function(messages) {
				$.each(messages, function(i, message) {
					_options.chatBox.addMessage(message);
					_options.userList.addUser(message.author);
				});
			}).catch(function(rejection) {
				console.log(rejection);
			});

			_options.chatBox.ready();
		};

		var initCallback = function(data) {
			_options.chatBox.addInfo('Initializing&hellip;');
			_options.identity = data.identity;

			// Initialize the IP messaging client
			accessManager = new Twilio.AccessManager(data.token);
			messagingClient = new Twilio.IPMessaging.Client(accessManager);

			var promise = messagingClient.getChannelByUniqueName(_options.channelName, {
				'logLevel': 'debug'
			});
			promise.then(function (channel) {
				_channel = channel;
				if (!_channel) {
					messagingClient.createChannel({
						uniqueName: _options.channelName,
						friendlyName: 'Channel: ' + _options.channelFriendlyName
					}).then(function (channel) {
						_channel = channel;
						setupChannel(_channel);
					});
				} else {
					setupChannel(_channel);
				}
			});
		};

		this.init();
	}

	var chatApp = new ChatApp({
		'chatBox': new ChatBox({
			'selector': '#messages',
			'input': '#chat-input'
		}),
		'userList': new UserList({
			'selector': '#users ul'
		})
	});
});