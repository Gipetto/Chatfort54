<?php

namespace Chat\Controllers;

use Chat\Auth\MyBBUser;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;


class TokenController {

	protected static $ttl = 3600;

	public function get(Request $request, Application $app) {
		/** @var MyBBUser $identity */
		$identity = $app['security']->getToken()->getUser();
		$deviceId = $request->get('fingerprint');

		$appName = $app['config']['app']['name'];

		$token = new \Services_Twilio_AccessToken(
			$app['config']['twilio']['accountSid'],
			$app['config']['twilio']['apiKey'],
			$app['config']['twilio']['apiSecret'],
			self::$ttl,
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
