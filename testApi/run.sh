#!/bin/bash
cd ..
node ./node_modules/mocha/bin/mocha testApi/course/api.js
node ./node_modules/mocha/bin/mocha testApi/conference/api.js