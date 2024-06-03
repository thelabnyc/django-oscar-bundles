.PHONY: statics translations install_precommit test_precommit fmt fmt_client fmt_server

DOCKERCOMPOSE = docker-compose

statics:
	@$(DOCKERCOMPOSE) run --rm -e NODE_ENV=production node webpack

# Create the .po and .mo files used for i18n
translations:
	cd client/src && \
	django-admin makemessages -a --extension=ts,tsx --domain djangojs && \
	cd ../../server/src/oscarbundles && \
	django-admin makemessages -a && \
	django-admin compilemessages

install_precommit:
	pre-commit install

test_precommit: install_precommit
	pre-commit run --all-files

fmt_client:
	cd client && \
	npm run prettier --no-color --write .

fmt_server:
	black .

fmt: fmt_client fmt_server
