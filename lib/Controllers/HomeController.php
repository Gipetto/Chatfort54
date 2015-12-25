<?php

namespace Chat\Controllers;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;


class HomeController {

	public function get(Request $request, Application $app) {
		$data = [];
		$data['user'] = $app['security']->getToken()->getUser();
		return $app['twig']->render('index.twig', $data);
	}
}
