#!/bin/bash
set -e

echo "Running entrypoint.test.sh"

echo "Setting up .npmrc file"

file=".npmrc"

if [ -f "$file" ]; then
    rm "$file"
fi

touch "$file"
echo "@vrsoftbr:registry=https://npm.pkg.github.com" >>"$file"
echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >>"$file"

echo "Recreate coverage dir"
rm -rf coverage/unit/*
mkdir -p coverage/unit/

if [ -z $TEST ]; then
    echo "Removing node_modules"
    rm -rf node_modules
fi

if ! [ -d "./node_modules" ]; then
    echo "Removing package-lock.json"
    rm package-lock.json

    echo "Running npm install"
    npm install --legacy-peer-deps
fi

echo "---------------------------------------------------------"

if ! [ -z $TEST ] && [ $TEST == 'unit' ]; then
    echo "Running unit tests"
    npm run test:cov
elif ! [ -z $TEST ] && [ $TEST == 'unit-chrome' ]; then
    echo "Running unit tests in Google Chrome (with coverage)"
    npm run test:cov:chrome
elif ! [ -z $TEST ] && [ $TEST == 'ci-chrome' ]; then
    echo "Running CI unit tests in Google Chrome (with coverage)..."
    npm run test:ci:chrome

    ls -la coverage/unit
elif ! [ -z $TEST ] && [ $TEST == 'unit-firefox' ]; then
    echo "Running unit tests in Mozilla Firefox"
    npm run test:firefox
elif ! [ -z $TEST ] && [ $TEST == 'ci-firefox' ]; then
    echo "Running CI unit tests in Mozilla Firefox"
    npm run test:ci:firefox
elif ! [ -z $TEST ] && [ $TEST == 'dev' ]; then
    echo "Running dev"
    ng serve --host 0.0.0.0 --port 4400
elif ! [ -z $TEST ] && [ $TEST == 'lint' ]; then
    echo "Running lint"
    npm run lint:lib
elif ! [ -z $TEST ] && [ $TEST == 'format' ]; then
    echo "Running format"
    npm run format:lib
fi
