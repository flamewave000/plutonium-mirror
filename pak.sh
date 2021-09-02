#!/bin/bash

packMozilla() {
	mkdir .mozilla-build
	cp -r icons .mozilla-build/icons
	cp -r popup .mozilla-build/popup
	cp LICENSE manifest.json mirror.js .web-extension-id .mozilla-build/
	cd .mozilla-build
	web-ext sign --api-key="$1" --api-secret="$2"
	cd ..
	mv .mozilla-build/web-ext-artifacts/* web-ext-artifacts/
	rm -R .mozilla-build
}


if [ "$1" = "chrome" ]; then
	zip -r plutonium-mirror.zip icons/ popup/ LICENSE manifest.json mirror.js
elif [ "$1" = "mozilla" ]; then
	packMozilla $2 $3
elif [ "$1" = "all" ]; then
	zip -r plutonium-mirror.zip icons/ popup/ LICENSE manifest.json mirror.js
	packMozilla $2 $3
else
	echo "./pack.sh <chrome|mozilla|all> [mozilla:api-key] [mozilla:api-secret]"
fi