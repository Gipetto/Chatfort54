<?php

namespace Chat\Auth;

use Symfony\Component\Security\Core\User\AdvancedUserInterface;

class MyBBUser implements AdvancedUserInterface {

	private $username;
	private $password = null;
	private $enabled = true;
	private $accountNonExpired = true;
	private $credentialsNonExpired = true;
	private $accountNonLocked = true;
	private $roles = [
		'ROLE_USER'
	];

	public function __construct($username) {
		if ('' === $username || null === $username) {
			throw new \InvalidArgumentException('The username cannot be empty.');
		}

		$this->username = $username;
	}

	/**
	 * @return mixed
	 */
	public function isAccountNonExpired() {
		return $this->accountNonExpired;
	}

	/**
	 * @return mixed
	 */
	public function isAccountNonLocked() {
		return $this->accountNonLocked;
	}

	/**
	 * @return mixed
	 */
	public function isCredentialsNonExpired() {
		return $this->credentialsNonExpired;
	}

	/**
	 * @return mixed
	 */
	public function isEnabled() {
		return $this->enabled;
	}

	/**
	 * @return mixed
	 */
	public function getRoles() {
		return $this->roles;
	}

	/**
	 * @return mixed
	 */
	public function getPassword() {
		return $this->password;
	}

	/**
	 * @return mixed
	 */
	public function getSalt() {
		return null;
	}

	/**
	 * @return mixed
	 */
	public function getUsername() {
		return $this->username;
	}

	/**
	 * @return mixed
	 */
	public function eraseCredentials() {}

}
