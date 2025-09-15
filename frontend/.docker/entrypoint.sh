#!/bin/bash

file=".npmrc"

if [ -f "$file" ]; then
    rm "$file"
fi

touch "$file"
echo "@vrsoftbr:registry=https://npm.pkg.github.com" >>"$file"
echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >>"$file"
echo "save-exact=true" >>"$file"
echo "legacy-peer-deps=true" >>"$file"

check_file=".node_modules"

if [ ! -f "$check_file" ]; then
    touch "$check_file"
fi

curr_date=$(date +"%Y-%m-%d")

function resetCheckFile() {
    truncate -s0 "$check_file"
    echo "$curr_date" >>"$check_file"
}

if [ -s "$check_file" ]; then
    old_date=$(<$check_file)
    date "+%Y-%m-%d" -d "$old_date" >/dev/null 2>&1
    if [ $? -eq 0 ]; then

        curr_date_int=$(date -d "${curr_date}" +"%s")
        old_date_int=$(date -d "${old_date}" +"%s")

        if [[ "$curr_date_int" -le "$old_date_int" ]]; then
            resetCheckFile
        else
            rm -rf node_modules
            resetCheckFile
        fi
    else
        resetCheckFile
    fi
else
    rm -rf node_modules
    resetCheckFile
fi

rm -rf ./dist

echo "Cleaning cache"
npm cache clean --force

echo "Running npm install"
npm install --legacy-peer-deps

echo "Running npm dedupe"
npm dedupe

echo "Starting application"
npm start

# tail -f /dev/null
