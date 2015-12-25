<?php
/** @var Silex\Application $app */
$app->get('/', 'Chat\Controllers\HomeController::get');
$app->get('/token', 'Chat\Controllers\TokenController::get');
