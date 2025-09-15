#!/bin/bash


npm --no-git-tag-version version prerelease --preid=pack --prefix projects/datatables

rm -rf dist/VRDatatables
rm -rf publish

npm install

npm run build:VRDatatables

mkdir -p publish/VRDatatables
cp -r dist/VRDatatables/* publish/VRDatatables

cd publish/VRDatatables

npm pack

mv *.tgz ../../

cd ../../