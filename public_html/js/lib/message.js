define(['jquery', 'marked'], function($, marked) {
	'use strict';

	var chatMarkedRenderer = new marked.Renderer();
	chatMarkedRenderer.heading = function (text, level) {
		return '<p>' + (new Array(level + 1).join('#')) + ' ' + text + '</p>';
	};

	marked.setOptions({
		gfm: true,
		breaks: true,
		tables: false,
		sanitize: true,
		smartypants: true,
		renderer: chatMarkedRenderer
	});

	return function ChatMessage(message, printMeta) {
		var _message = message;
		var _userColor = '#000';
		var _printMeta = (typeof printMeta !== 'undefined' ? printMeta : true);

		// run all processing methods against the message
		var processMessage = function (messageText) {
			var message = messageText;

			message = marked(message, function (err, content) {
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

		var emote = function (text) {
			var _text = text.replace('/me', _message.author);

			return $('<p></p>', {
				'class': 'emote',
				'html': $('<div></div>').text(_text).html() // entity-ize
			});
		};

		var postProcessMessage = function (message) {
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
		var formatMessage = function (messageBody) {
			var $msg = $('<div></div>', {
				'class': 'message',
				'html': messageBody,
				'data-message-id': message.index || '',
				'data-message-sid': message.sid || '',
				'data-message-timestamp': message.timestamp ? message.timestamp.valueOf() : ''
			});

			if (_printMeta) {
				var $time = $('<span></span>', {
					'class': 'time',
					'text': getTime(message.timestamp)
				});

				var $user = $('<span></span>', {
					'class': 'username',
					'text': _message.author
				}).css({"color": _userColor});

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

		var getTime = function (dateObj) {
			var _date = new Date(dateObj.valueOf());
			var hour = _date.getHours();
			var minutes = _date.getMinutes();
			var meridian = hour >= 12 ? 'PM' : 'AM';
			return ((hour + 11) % 12 + 1) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + meridian;
		};

		// override the default user color
		this.setUserColor = function (color) {
			_userColor = color;
		};

		// public function to retrieve formatted message
		this.format = function () {
			var _text;

			if (_message.isEmote) {
				_text = emote(message.body);
			} else if (_message.isRaw) {
				_text = _message.body;
			} else {
				_text = processMessage(_message.body);
			}
			return formatMessage(_text);
		};
	}
});