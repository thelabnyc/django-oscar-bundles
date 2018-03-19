# Minimal makefile for building static assets and selenium screen shots

DOCKERCOMPOSE = docker-compose

statics:
	@$(DOCKERCOMPOSE) run --rm -e NODE_ENV=production node webpack
