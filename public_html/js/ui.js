jQuery(function($) {
	"use strict";

	var $main = $('#main'),
		$messages = $('#messages'),
		$header = $('.header', $main),
		$scroller = $('.messages-scroller', $main),
		$input = $('#message-input', $main),
		$menu = $('#menu'),
		$users = $('#users-list', $menu),
		$menuHeading = $('.menu-heading', $menu);

	$(window).on('resize', function(e) {
		$scroller.height($(window).height() - $header.outerHeight(true) - $input.outerHeight(true));
		$scroller.width($main.width());
		$users.height($(window).height() - $menuHeading.outerHeight(true) - 15);
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
});
