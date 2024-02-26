alias pub := publish

publish:
	rm -dr dist
	yarn run build && yarn version --patch && npm publish