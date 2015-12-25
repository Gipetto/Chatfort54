<?php

namespace Chat\Auth;

use Symfony\Component\Security\Core\Authentication\Token\AbstractToken;


class MyBBUserToken extends AbstractToken {

	public function __construct(array $roles = array()) {
		parent::__construct($roles);
		$this->setAuthenticated(count($roles) > 0);
	}

	public function getCredentials() {
		return '';
	}

}
