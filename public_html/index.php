<?php

define('DOCROOT', dirname(__DIR__));

$filename = __DIR__ . preg_replace('#(\?.*)$#', '', $_SERVER['REQUEST_URI']);
if (php_sapi_name() === 'cli-server' && is_file($filename)) {
	return false;
}

require_once DOCROOT . '/vendor/autoload.php';
require_once DOCROOT . '/lib/app.php';

$app->run();