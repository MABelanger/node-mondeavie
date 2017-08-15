#!/bin/bash

# Create the date variable used to save the files
DATE=`date +%Y-%m-%d_%Hh-%Mm-%Ss`

# switch to backup dir
cd /home/ubuntu/projects/node-mondeavie/backup &&

# Dump the database into folder ./mondeaviedb
mongodump --db=mondeavie  --out=./mondeaviedb &&

# Compress the database directory
tar -czf mondeaviedb-$DATE.tgz mondeaviedb &&

# remove the database directory
rm -rf mondeaviedb/ &&

# Compress the image files and exclude *original.jpg
tar -czf img-$DATE.tgz -C ../media/img/ --exclude "*original.jpg" . &&

# use node 6+
export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh
nvm use 6

# Send the backup
mailatt *.tgz &&

# Remove the temp directory
rm -rf *.tgz
