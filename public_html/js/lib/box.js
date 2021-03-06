define(['jquery', 'lib/message', 'lib/day-separator'], function($, ChatMessage, ChatDaySeparator) {
	'use strict';

	/********************************************************
	 Name: str_to_color
	 Description: create a hash from a string then generates a color
	 Usage: alert('#'+str_to_color("Any string can be converted"));
	 author: Brandon Corbin [code@icorbin.com]
	 website: http://icorbin.com
	 ********************************************************/
	function string_to_color(a,b){"use strict";var b="number"==typeof b?b:-10,c=function(a){for(var b=0,c=0;c<a.length;c++)b=a.charCodeAt(c)+((b<<5)-b);return b},d=function(a,b){var c=parseInt(a,16),d=Math.round(2.55*b),e=(c>>16)+d,f=(255&c>>8)+d,g=(255&c)+d;return(16777216+65536*(255>e?1>e?0:e:255)+256*(255>f?1>f?0:f:255)+(255>g?1>g?0:g:255)).toString(16).slice(1)},e=function(a){var b=(255&a>>24).toString(16)+(255&a>>16).toString(16)+(255&a>>8).toString(16)+(255&a).toString(16);return b};return d(e(c(a)),b)}


	return function ChatBox(options) {
		this.chatBox = $(options.selector);
		var colors = [];
		var users = {};
		var usersTyping = [];
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

			var color = '#' + string_to_color(userName, -30);

			users[userName] = color;
			colors.push(color);

			return users[userName];
		};

		this.addRawMessage = function(message, shouldPrintMeta) {
			message.isRaw = true;
			var _message = new ChatMessage(message, shouldPrintMeta || true);
			this.chatBox.append(_message.format());
		};

		this.addMessage = function (message) {
			var _shouldPrintMeta = true;

			message.localizedDate = new Date(message.timestamp.valueOf());

			if (lastMessage && (message.author == lastMessage.author) &&
				(message.localizedDate.getTime() < (lastMessage.localizedDate.getTime() + omitMetaTimeout))) {
				_shouldPrintMeta = false;
			}

			if (lastMessage && (message.localizedDate.getDay() != lastMessage.localizedDate.getDay())) {
				var sep = new ChatDaySeparator(message.localizedDate.getDay());
				this.chatBox.append(sep.format());
				_shouldPrintMeta = true;
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
				'html': '<i class="fa fa-info-circle"></i> ' + text
			});
			this.chatBox.append($msg);
		};

		this.addError = function (text) {
			var $msg = $('<div></div>', {
				'class': 'error',
				'html': '<i class="fa fa-exclamation-triangle"></i> ' + text
			});
			this.chatBox.append($msg);
		};

		var listenTo = function (selector) {
			return $(selector).on('keydown', function (e) {
				if (!(e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) &&
					!(e.keyCode in [13])) {
					chatApp.setTyping();
				}

				var _this = $(this);
				if (e.keyCode == 13 && !e.shiftKey) {
					e.preventDefault();
					e.stopPropagation();
					chatApp.sendMessage(_this.val());
					_this.val('');
				}
			});
		};

		this.setUserTyping = function(member) {
			var index = $.inArray(member.identity, usersTyping);

			if (index < 0) {
				usersTyping.push(member.identity);
			}

			updateUsersTyping();
		};

		this.setUserDoneTyping = function(member) {
			var index = $.inArray(member.identity, usersTyping);

			if (index > -1) {
				usersTyping.splice(index, 1);
			}

			updateUsersTyping();
		};

		var updateUsersTyping = function() {
			if (usersTyping.length == 0) {
				statusBox.html('&nbsp;');
				return;
			}

			var modifier = usersTyping.length > 1 ? 'are' : 'is';
			var text = usersTyping.join(', ') + ' ' + modifier + ' typing&hellip;';
			var spinner = '<i class="fa fa-spinner fa-spin"></i>';

			statusBox.html(spinner + '&nbsp;' + text);
		};

		var setStatusBox = function(htmlContent, duration) {
			if (htmlContent == undefined) {
				return;
			}

			statusBox.html(htmlContent).css({'visibility': 1});

			if (duration != undefined) {
				setTimeout(function() {
					clearStatusBox();
				}, duration);
			}
		};

		var clearStatusBox = function() {
			statusBox.fadeOut('normal', function() {
				$(this).html('&nbsp;').show();
			});
		};

		this.setStatus = function(statusMessage, icon) {
			setStatusBox('<i class="fa fa-' + icon + '"></i> ' + statusMessage, 3000);
		};

		this.ready = function () {
			chatInput.prop('disabled', false);
			setStatusBox('<i class="fa fa-thumbs-up"></i> Ready', 5000);
		};

		var chatInput = listenTo(options.input);
		var statusBox = chatInput.siblings('.status');
	}
});