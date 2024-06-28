.PHONY: statics translations

DOCKERCOMPOSE = docker compose

statics:
	@$(DOCKERCOMPOSE) run --rm -e NODE_ENV=production node webpack

# Create the .po and .mo files used for i18n
translations:
	cd client/src && \
	django-admin makemessages -a --extension=ts,tsx --domain djangojs && \
	cd ../../server/src/oscarbundles && \
	django-admin makemessages -a && \
	django-admin compilemessages
