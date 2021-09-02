#!/bin/bash

version=`cat manifest.json | gawk 'match($0, /version":\s*"([0-9\.]+)"/, m) { print m[1]; }'`
echo "Packing v$version"

packMozilla() {
	mkdir -p .mozilla-build
	# Copy files to build directory
	cp -r icons .mozilla-build/icons
	cp -r popup .mozilla-build/popup
	cp LICENSE manifest.json mirror.js .web-extension-id .mozilla-build/
	# move into directory and perform package and signing
	cd .mozilla-build
	web-ext sign --api-key="$1" --api-secret="$2"
	# move back to root
	cd ..
	# move the new Add-On and ID file back to root
	mkdir -p releases
	mv .mozilla-build/web-ext-artifacts/*.xpi "releases/plutonium-mirror-$version.xpi"
	mv .mozilla-build/.web-extension-id ./.web-extension-id
	# delete the intermediary build directory
	rm -R .mozilla-build
}

packChrome() {
	output="plutonium-mirror-$version.zip"
	mkdir -p releases
	zip -r "releases/$output" "icons/" "popup/" "LICENSE" "manifest.json" "mirror.js"
}


if [ "$1" = "chrome" ]; then
	packChrome
elif [ "$1" = "mozilla" ]; then
	packMozilla $2 $3
elif [ "$1" = "all" ]; then
	packChrome
	packMozilla $2 $3
else
	echo "./pack.sh <chrome|mozilla|all> [mozilla:api-key] [mozilla:api-secret]"
fi

echo "Done Packing v$version"