define(['jquery'], function($) {
	'use strict';

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

	$inputTextarea.focus();



	return {
		main: $main,
		messages: $messages,
		input: $input,
		users: $users
	};
});
