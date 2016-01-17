define(['jquery', 'lib/ui', 'marked'], function($, ui, marked) {
	'use strict';

	return function Tldr() {

		var index_url = 'https://tldr-pages.github.io/assets/index.json';
		var page_base = 'https://api.github.com/repos/tldr-pages/tldr/contents/pages/';
		var index = {};

		var init = function() {
			window.chatApp.registerCommand('tldr', 'tldr');
			$(window).on('tldr', process);

			loadCss('css/tldr.css');

			$.getJSON(index_url, function(response) {
				response.commands.map(function(item) {
					index[item.name] = page_base + item.platform[0] + '/' + item.name + '.md'
				});
			});
		};

		var process = function(e, message) {
			var _message = message;

			if (index.hasOwnProperty(message)) {
				$.getJSON(index[message], function(man) {
					var _text = window.atob(man.content);

					window.chatApp.addRawMessage({
						'author': 'tldr',
						'body': '<p>/tldr ' + _message + "</p><div class=\"tldr\">" + marked(_text) + '</div>',
						'timestamp': new Date()
					});
				});
			} else {
				window.chatApp.addNotice('**TLDR Command not found:** ' + message);
			}
		};

		init();
	}
});
