<?php

namespace Chat\Auth;

use Monolog\Logger;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Firewall\ListenerInterface;
use Symfony\Component\Security\Core\Authentication\AuthenticationManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;


class MyBBListener implements ListenerInterface {

	protected $logger;
	protected $tokenStorage;
	protected $authenticationManager;

	public function __construct(TokenStorageInterface $tokenStorage, AuthenticationManagerInterface $authManager, Logger $logger) {
		$this->tokenStorage = $tokenStorage;
		$this->authenticationManager = $authManager;
		$this->logger = $logger;
	}

	public function handle(\Symfony\Component\HttpKernel\Event\GetResponseEvent $event) {
		$request = $event->getRequest();

		try {
			$cookieVal = $request->cookies->get('mybbuser');

			$token = new MyBBUserToken();
			$token->setUser($cookieVal);

			$authToken = $this->authenticationManager->authenticate($token);
			$this->tokenStorage->setToken($authToken);

			return;
		} catch (\Symfony\Component\Security\Core\Exception\AuthenticationException $e) {
			$this->logger->addError($e->getMessage());
		} catch (\Exception $e) {
			$this->logger->addError($e);
		}

		$response = new Response('Forbidden');
		$response->setStatusCode(Response::HTTP_FORBIDDEN);
		$event->setResponse($response);
	}
}
