<?php

namespace Chat\Auth;

use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authentication\Provider\AuthenticationProviderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;


class MyBBProvider implements AuthenticationProviderInterface {

	protected $userProvider;

	public function __construct(UserProviderInterface $userProvider) {
		$this->userProvider = $userProvider;
	}

	public function authenticate(TokenInterface $token) {
		$user = $this->userProvider->loadUserByUsername($token->getUsername());
		if ($user) {
			$authenticatedToken = new MyBBUserToken($user->getRoles());
			$authenticatedToken->setUser($user);
			return $authenticatedToken;
		}

		throw new AuthenticationException('The WSSE authentication failed.');
	}

	public function supports(TokenInterface $token) {
		return $token instanceof MyBBUserToken;
	}
}
