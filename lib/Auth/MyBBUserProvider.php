<?php

namespace Chat\Auth;

use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Silex\Application;


class MyBBUserProvider implements UserProviderInterface {

	protected $app;
	protected $myBB;

	public function __construct(Application $app) {
		$this->app = $app;
	}

	/**
	 * @TODO - there has to be a less heavy way of doing this...
	 */
	public function init($username = null) {
		global $db, $cache, $plugins;
		global $groupscache, $forum_cache, $fpermcache, $mybb, $cached_forum_permissions_permissions, $cached_forum_permissions;

		if (!defined('IN_MYBB')) {
			define('IN_MYBB', true);
		}

		@include_once dirname(DOCROOT) . '/mies/inc/init.php';
		@include_once MYBB_ROOT . 'inc/class_session.php';

		try {
			ob_start();

			if (isset($mybb)) {
				$session = new \session();
				$session->init();
				$mybb->session = &$session;

				$this->myBB = $mybb;
			} else {
				$this->myBB = new \stdClass();
				$this->myBB->user = [
					'username' => null,
				];
				if ($this->app['config']['mybb']['allowRandom']) {
					$this->myBB->user['username'] = $username;
				}
			}

			ob_end_clean();
		} catch (\Exception $e) {
			throw new AuthenticationException('Could not initialize MYBB application for authentication.');
		}
	}

	public function loadUserByUsername($username) {
		if (!$this->myBB) {
			$this->init($username);
		}
		return new MyBBUser($this->myBB->user['username']);
	}

	public function refreshUser(UserInterface $user) {
		return $this->loadUserByUsername($user->getUsername());
	}

	public function supportsClass($class) {
		return $class === 'MyBBUser';
	}

}
