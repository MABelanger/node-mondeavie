#!/bin/bash

set -o errexit # Exit on error

cd ../react-admin
echo "pull react-admin"
git pull
echo "rebuild react-admin"
npm run deploy

cd ../react-calendar
echo "pull react-calendar"
git pull
echo "rebuild react-calendar"
npm run deploy

cd ../node-mondeavie
echo "copy react-admin react-calendar into app/dist"
rm -rf ./app/
mkdir -p ./app/dist/
cp -a ../react-admin/dist ./app/dist/react-admin
cp -a ../react-calendar/dist ./app/dist/react-calendar

echo "deploy success !"