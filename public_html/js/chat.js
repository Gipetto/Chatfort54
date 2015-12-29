jQuery(function($) {
	"use strict";

	var chatMarkedRenderer = new marked.Renderer();
	chatMarkedRenderer.heading = function(text, level) {
		return '<p>' + (new Array(level +1).join('#')) + ' ' + text + '</p>';
	};

	marked.setOptions({
		gfm: true,
		breaks: true,
		tables: false,
		sanitize: true,
		smartypants: true,
		renderer: chatMarkedRenderer
	});

	function ChatMessage(message, printMeta) {
		var _message = message;
		var _userColor = '#000';
		var _printMeta = (typeof printMeta !== 'undefined' ? printMeta : true);

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

			message = postProcessMessage(message);

			return message;
		};

		var emote = function(text) {
			var _text = text.replace('/me', _message.author);

			return $('<p></p>', {
				'class': 'emote',
				'html': $('<div></div>').text(_text).html() // entity-ize
			});
		};

		var postProcessMessage = function(message) {
			var $message = $('<div></div>').append($(message));

			if (_printMeta) {
				// we can't have <pre> or <blockquote> elements being the first item
				// they format the entire thing funny, and that ain't funny
				var $first = $message.find(':first');
				if ($first.is('pre') || $first.is('blockquote')) {
					$message.prepend($('<p>&nbsp;</p>'));
				}
			}

			return $message.html();
		};

		// format this message for HTML output
		var formatMessage = function(messageBody) {
			var $msg = $('<span></span>', {
				'class': 'message',
				'html': messageBody,
				'data-message-sid': message.sid,
				'data-message-timestamp': message.timestamp.valueOf()
			});

			if (_printMeta) {
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
			}

			return $('<div></div>', {
				'class': 'message-container'
			}).append($msg);
		};

		var getTime = function(dateObj) {
			var hour = dateObj.getHours();
			var minutes = dateObj.getMinutes();
			var meridian = hour >= 12 ? 'PM' : 'AM';
			return ((hour + 11) % 12 + 1) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + meridian;
		};

		// override the default user color
		this.setUserColor = function(color) {
			_userColor = color;
		};

		// public function to retrieve formatted message
		this.format = function() {
			var _text;

			if (_message.body.substring(0, 3) == '/me') {
				_text = emote(message.body);
				_printMeta = false;
			} else {
				_text = processMessage(_message.body);
			}
			return formatMessage(_text);
		};
	}

	function ChatBox(options) {
		this.chatBox = $(options.selector);
		var colors = [];
		var users = {};
		var lastMessage = null;
		var omitMetaTimeout = 60 * 10 * 1000;

		// http://www.paulirish.com/2009/random-hex-color-code-snippets/
		var randomColor = function() {
			return '#' + Math.floor(Math.random() * 16777215).toString(16);
		};

		var getUserColor = function(userName) {
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
			var _shouldPrintMeta = true;

			if (lastMessage && (message.author == lastMessage.author) &&
				(message.timestamp.getTime() < (lastMessage.timestamp.getTime() + omitMetaTimeout))) {
				_shouldPrintMeta = false;
			}

			var _message = new ChatMessage(message, _shouldPrintMeta);
			_message.setUserColor(getUserColor(message.author));
			this.chatBox.append(_message.format());

			lastMessage = message;
		};

		this.addInfo = function(text) {
			var $msg = $('<div></div>', {
				'class': 'info',
				'html': text
			});
			this.chatBox.append($msg);
		};

		this.addError = function(text) {
			var $msg = $('<div></div>', {
				'class': 'error',
				'html': text
			});
			this.chatBox.append($msg);
		};

		var listenTo = function(selector) {
			return $(selector).on('keydown', function(e) {
				var _this = $(this);
				if (e.keyCode == 13 && !e.shiftKey) {
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

		var chatInput = listenTo(options.input);
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
			'userList': null,
			'numHistoryMessages': 50
		};

		var _commands = {
			'help': 'help-show'
		};

		var _options = $.extend(_defaults, options);
		var _accessManager;
		var _messagingClient;
		var _channel;
		var _browserFingerprint;

		var init = function() {
			$.getJSON('token', {
				'fingerprint': _browserFingerprint
			}, initCallback)
				.fail(function(e) {
					_options.chatBox.addError('Could not retrieve JOT token. Please refresh your browser.');
					console.log(e);
				});
		};

		var doCommand = function(message) {
			var cmdRegex = /^\/([a-zA-Z]*)\b(.*)/;
			var matches = cmdRegex.exec(message);

			if (!matches || !matches[1] || !(matches[1] in _commands)) {
				return false;
			}

			var event = _commands[matches[1]];

			var params = [];
			if (matches[2]) {
				params.push(matches[2].trim())
			}

			$(window).trigger(event, params);
			return true;
		};

		this.sendMessage = function(message) {
			var command = doCommand(message);

			if (command) {
				return;
			}

			_channel.sendMessage(message);
		};

		this.getIdentity = function() {
			return _options.identity;
		};

		var loadMessageHistory = function() {
			var messagesPromise = _channel.getMessages(_options.numHistoryMessages);
			messagesPromise.then(function(messages) {
				$.each(messages, function(i, message) {
					_options.chatBox.addMessage(message);
					_options.userList.addUser(message.author);
				});
			}).catch(function(rejection) {
				console.log(rejection);
				_options.chatBox.addError('There was an error loading message history.');
			});
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

			loadMessageHistory();

			_options.chatBox.ready();
		};

		var refreshToken = function(data) {
			console.log('new token');
			console.dir(data);
			_accessManager.updateToken(data.token);
		};

		var initCallback = function(data) {
			_options.chatBox.addInfo('Initializing&hellip;');
			_options.identity = data.identity;

			// Initialize the IP messaging client
			_accessManager = new Twilio.AccessManager(data.token);
			_messagingClient = new Twilio.IPMessaging.Client(_accessManager);

			_messagingClient.on('tokenExpired', function() {
				$.getJSON('token', {
					'fingerprint': _browserFingerprint
				}, refreshToken)
					.fail(function(e) {
						_options.chatBox.addError('Could not update JOT token. Please refresh your browser.');
						console.log(e);
					});
			});

			var promise = _messagingClient.getChannelByUniqueName(_options.channelName, {
				'logLevel': 'debug'
			});

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
			}).catch(function(rejection) {
				_options.chatBox.addError('There was an error setting up the channel. Please refresh your browser.');
				console.log(rejection);
			});
		};

		new Fingerprint2().get(function(result, components) {
			_browserFingerprint = result;
			init();
		});
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