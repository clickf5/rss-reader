develop:
	npx webpack-dev-server

install:
	npm install

build:
	rm -rf dist
	NODE_ENV=production npx webpack

dev:
	rm -rf dist
	npx webpack

test:
	npm test

test-coverage:
	npm test -- --coverage

lint:
	npx eslint .

.PHONY: test
