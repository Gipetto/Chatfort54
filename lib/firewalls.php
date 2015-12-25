<?php

use Chat\Auth\MyBBProvider;
use Chat\Auth\MyBBListener;
use Chat\Auth\MyBBUserProvider;

/** @var Silex\Application $app */
$app['security.authentication_listener.factory.mybb'] = $app->protect(function($name, $options) use ($app) {
	$app['security.authentication_provider.' . $name . '.mybb'] = $app->share(function() use ($app) {
		return new MyBBProvider($app['security.user_provider.default']);
	});
	$app['security.authentication_listener.' . $name . '.mybb'] = $app->share(function() use ($app) {
		return new MyBBListener($app['security.token_storage'], $app['security.authentication_manager'], $app['monolog']);
	});

	return [
		'security.authentication_provider.' . $name . '.mybb',
		'security.authentication_listener.' . $name . '.mybb',
		null,
		'pre_auth',
	];
});

$app->register(new Silex\Provider\SecurityServiceProvider(), [
	'security.firewalls' => [
		'default' => [
			'stateless' => true,
			'pattern' => '^/',
			'mybb' => true,
			'users' => $app->share(function() use ($app) {
				return new MyBBUserProvider($app);
			})
		]
	]
]);
