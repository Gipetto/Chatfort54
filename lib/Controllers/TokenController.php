<?php

namespace Chat\Controllers;

use Chat\Auth\MyBBUser;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;


class TokenController {

	public function get(Request $request, Application $app) {
		/** @var MyBBUser $identity */
		$identity = $app['security']->getToken()->getUser();

		$appName = $app['config']['app']['name'];
		$deviceId = 'browser';

		$token = new \Services_Twilio_AccessToken(
			$app['config']['twilio']['accountSid'],
			$app['config']['twilio']['apiKey'],
			$app['config']['twilio']['apiSecret'],
			3600,
			$identity->getUsername()
		);

		$impGrant = new \Services_Twilio_Auth_IpMessagingGrant();
		$impGrant->setServiceSid($app['config']['twilio']['IPMServiceSid']);
		$impGrant->setEndpointId(sprintf('%s:%s:%s', $appName, $identity->getUsername(), $deviceId));

		$token->addGrant($impGrant);

		return new JsonResponse([
			'identity' => $identity->getUsername(),
			'token' => $token->toJWT(),
		]);
	}
}
