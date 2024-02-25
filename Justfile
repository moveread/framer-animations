alias pub := publish

publish:
	yarn run build && yarn version --patch && npm publish