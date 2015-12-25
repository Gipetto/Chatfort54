<?php

use Silex\Application;
use Monolog\Logger;
use Monolog\Handler\ErrorLogHandler;
use Monolog\Formatter\LineFormatter;

$app = new Application();

$app->register(new DerAlex\Silex\YamlConfigServiceProvider(DOCROOT . '/config/app.yaml'));

$app->register(new Silex\Provider\TwigServiceProvider(), [
	'twig.path' => DOCROOT . '/lib/twig',
]);

$app->register(new Silex\Provider\MonologServiceProvider(), [
	'monolog.logfile' => DOCROOT . '/app.log',
]);
$app['monolog'] = $app->share($app->extend('monolog', function(Logger $log, Application $app) {
	$log->pushHandler(new ErrorLogHandler(ErrorLogHandler::OPERATING_SYSTEM, Logger::WARNING));

	foreach ($log->getHandlers() as $handler) {
		$handler->setFormatter(new LineFormatter(null, 'c', true, true));
	}

	return $log;
}));

require_once DOCROOT . '/lib/routes.php';
require_once DOCROOT . '/lib/firewalls.php';
