alias pub := publish

publish:
	cd framer-animations && \
	(rm -dr dist || echo 'No previous dist') && \
	yarn run build && yarn version --patch && npm publish
	
# Deploy 'demo' into GitHub Pages
deploy-demo:
  gh workflow run deploy-demo.yml --ref main
