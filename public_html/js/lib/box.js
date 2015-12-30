define(['jquery', 'lib/message'], function($, ChatMessage) {
	'use strict';

	return function ChatBox(options) {
		this.chatBox = $(options.selector);
		var colors = [];
		var users = {};
		var lastMessage = null;
		var omitMetaTimeout = 60 * 10 * 1000;

		// http://www.paulirish.com/2009/random-hex-color-code-snippets/
		var randomColor = function () {
			return '#' + Math.floor(Math.random() * 16777215).toString(16);
		};

		var getUserColor = function (userName) {
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

		this.addMessage = function (message) {
			var _shouldPrintMeta = true;

			if (lastMessage && (message.author == lastMessage.author) &&
				(message.timestamp.getTime() < (lastMessage.timestamp.getTime() + omitMetaTimeout))) {
				_shouldPrintMeta = false;
			}

			if (lastMessage && lastMessage.isEmote) {
				_shouldPrintMeta = true;
			}

			if (message.body.substring(0, 3) == '/me') {
				message.isEmote = true;
				_shouldPrintMeta = false;
			}

			var _message = new ChatMessage(message, _shouldPrintMeta);
			_message.setUserColor(getUserColor(message.author));
			this.chatBox.append(_message.format());

			lastMessage = message;
		};

		this.addInfo = function (text) {
			var $msg = $('<div></div>', {
				'class': 'info',
				'html': text
			});
			this.chatBox.append($msg);
		};

		this.addError = function (text) {
			var $msg = $('<div></div>', {
				'class': 'error',
				'html': text
			});
			this.chatBox.append($msg);
		};

		var listenTo = function (selector) {
			return $(selector).on('keydown', function (e) {
				var _this = $(this);
				if (e.keyCode == 13 && !e.shiftKey) {
					e.preventDefault();
					e.stopPropagation();

					chatApp.sendMessage(_this.val());
					_this.val('');
				}
			});
		};

		this.ready = function () {
			chatInput.prop('disabled', false);
		};

		var chatInput = listenTo(options.input);
	}
});