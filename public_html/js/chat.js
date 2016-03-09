function loadCss(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
}

requirejs.config({
	baseUrl: 'js',
	urlArgs: "v=" +  (new Date()).getTime(),
	paths: {
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min',
		'fingerprint2': '//cdn.jsdelivr.net/fingerprintjs2/1.0.3/fingerprint2.min',
		'marked': '//cdn.jsdelivr.net/marked/0.3.5/marked.min',
		'rollbar': 'rollbar.umd.nojson-1.3-min'
	}
});

require(['lib/app', 'lib/message', 'lib/box', 'lib/user-list'], function(ChatApp, ChatMessage, ChatBox, UserList) {
	'use strict';

	window.chatApp = new ChatApp({
		'chatBox': new ChatBox({
			'selector': '#messages',
			'input': '#chat-input'
		}),
		'userList': new UserList({
			'selector': '#users ul'
		})
	});
});

require(['commands/help', 'lib/ui'], function(HelpBox, ui) {
	'use strict';

	var $inputTextarea = $('#chat-input', ui.input);

	$('.help').on('click', function(e) {
		e.preventDefault();
		$inputTextarea.blur();
		$(window).trigger('help-toggle');
	});

	$('.help-close').on('click', function(e) {
		e.preventDefault();
		$inputTextarea.focus();
		$(window).trigger('help-hide');
	});

	$(window).on('chat-init', function() {
		new HelpBox();
	});
});

require(['commands/test'], function(Tester) {
	'use strict';
	$(window).on('chat-init', function() {
		new Tester();
	});
});

require(['commands/tldr'], function(Tldr) {
	'use strict';
	$(window).on('chat-init', function() {
		new Tldr();
	});
});