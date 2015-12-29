jQuery(function($) {
	"use strict";

	var $main = $('#main'),
		$messages = $('#messages'),
		$header = $('.header', $main),
		$scroller = $('.messages-scroller', $main),
		$input = $('#message-input', $main),
		$inputTextarea = $('#chat-input', $input),
		$menu = $('#menu'),
		$users = $('#users-list', $menu),
		$menuHeading = $('.menu-heading', $menu),
		$menuFooter = $('.menu-footer', $menu);

	$(window).on('resize', function(e) {
		$scroller.height($(window).height() - $header.outerHeight(true) - $input.outerHeight(true));
		//$scroller.width($main.width());
		$users.height($(window).height() - $menuHeading.outerHeight(true) - $menuFooter.outerHeight(true) - 15);
	}).trigger('resize');

	$messages.on('DOMNodeInserted', function(e) {
		$scroller.stop().animate({
			scrollTop: $messages[0].scrollHeight
		}, 500);
	});

	$messages.on('click', 'a', function(e) {
		e.stopPropagation();
		e.preventDefault();
		window.open(this.href);
	});

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

	function HelpBox(options) {
		var _defaults = {
			'selector': '#help'
		};

		var _options = $.extend(_defaults, options);
		var $container = $(_options.selector);

		var init = function() {
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

	var helpBox = new HelpBox();
	$inputTextarea.focus();
});
