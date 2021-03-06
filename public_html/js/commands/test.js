define(['jquery', 'lib/ui'], function($, ui) {
	'use strict';

	return function Tester() {

		var init = function() {
			window.chatApp.registerCommand('error', 'test-error');
			window.chatApp.registerCommand('info', 'test-info');

			$(window).on('test-error', testError);
			$(window).on('test-info', testInfo);
		};

		var testError = function(e, message) {
			window.chatApp.addErrorMessage(message);
		};

		var testInfo = function(e, message) {
			window.chatApp.addInfoMessage(message);
		};

		init();
	}
});
