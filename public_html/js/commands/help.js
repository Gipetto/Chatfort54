define(['jquery', 'lib/ui'], function($, ui) {
	'use strict';

	var $main = ui.main;

	return function HelpBox(options) {
		var _defaults = {
			'selector': '#help'
		};

		var _options = $.extend(_defaults, options);
		var $container = $(_options.selector);

		var init = function() {
			window.chatApp.registerCommand('help', 'help-show');

			$(window).on('help-show', show);
			$(window).on('help-hide', hide);
			$(window).on('help-toggle', function(e) {
				if ($container.is(':visible')) {
					hide();
				} else {
					show();
				}
			});
			$(window).on('keydown', function(e) {
				if (e.keyCode == 27 && $container.is(':visible')) {
					hide();
				}
			});
			sizeContainer();
		};

		var sizeContainer = function() {
			// relies on ui.js... need to break this dependency
			var mainOffset = $main.offset();
			$container.css({
				'height': $(window).height(),
				'width': $main.outerWidth(),
				'left': mainOffset['left']
			});
		};

		var show = function() {
			sizeContainer();
			$container.fadeIn('slow');
		};

		var hide = function() {
			$container.fadeOut('fast');
		};

		init();
	}
});
