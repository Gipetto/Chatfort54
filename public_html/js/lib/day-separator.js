define(['jquery'], function($) {
	'use strict';

	return function ChatDaySeparator(day) {

		var days = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];

		this.format = function() {
			return $('<div></div>', {
				'class': 'day-separator'
			}).append($('<span></span>', {
				'text': days[day]
			})).append($('<hr/>'));
		}

	}
});