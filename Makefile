.PHONY: serve

COMPOSER_VERSION := $(shell which composer 2>/dev/null)

composer:
ifndef COMPOSER_VERSION
	curl -sS https://getcomposer.org/installer | php -- --install-dir=bin --filename=composer
	COMPOSER_VERSION = bin/composer
endif

install: composer
	composer update

serve:
	php -S 127.0.0.1:8080 -t public_html public_html/index.php