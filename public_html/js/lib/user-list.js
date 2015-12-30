define(['jquery'], function($) {
	'use strict';

	return function UserList(options) {
		var defaults = {
			'selector': null,
			'item': '<li></li>',
			'itemClass': 'menu-item'
		};
		var _options = $.extend(defaults, options);
		var $userList = $(_options.selector);

		this.addUser = function (identity) {
			var userSelector = '[member-identity="' + identity + '"]';
			if ($userList.find(userSelector).length) {
				return;
			}

			var $user = $(_options.item, {
				'member-identity': identity,
				'class': _options.itemClass,
				'text': identity
			});

			$userList.append($user);
		};

		this.removeUser = function (identity) {
			var $user = $userList.find('[member-identity="' + identity + '"]');

			if ($user) {
				$user.remove();
			}
		};
	}
});
