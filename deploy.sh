#!/bin/bash

set -o errexit # Exit on error

rm -rf ./app/
mkdir -p ./app/dist/
cp -a ../react-admin/dist ./app/dist/react-admin
cp -a ../react-calendar/dist ./app/dist/react-calendar

echo "deploy success !"