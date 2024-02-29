alias pub := publish

publish:
	cd framer-animations && \
	(rm -dr dist || echo 'No previous dist') && \
	yarn run build && yarn version --patch && npm publish