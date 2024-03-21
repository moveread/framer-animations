mod demo
mod playground

PKG := "framer-animations"

help:
  @just --list

publish: build upload

# Build, increment patch number and publish
republish: patch build upload

patch:
  cd {{PKG}} && yarn version --patch

# Publish to npm
upload:
  cd {{PKG}}/dist && npm publish --access=public
  cd {{PKG}} && rm -drf dist

# Build package into dist/, copying relevant files
build: 
  cd {{PKG}} && \
  (rm -dr dist || :) \
  yarn run build
  @just copy

# Copy package.json, tsconfig.json and README.md to dist/
copy:
  cd {{PKG}} && \
  cp package.json dist && \
  cp tsconfig.json dist && \
  cp README.md dist && \

# Install a package as both --dev and --peer (pseudo-analogous to python extras)
extra PACKAGE:
  cd {{PKG}} && \
  yarn add --peer {{PACKAGE}} && yarn add --dev {{PACKAGE}}
	
# Deploy 'demo' into GitHub Pages
deploy-demo:
  gh workflow run deploy-demo.yml --ref main
