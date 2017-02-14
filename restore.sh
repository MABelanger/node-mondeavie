#!/bin/bash

# Drop the database before restoring.
#mongo
#> use mondeavie
#> db.dropDatabase()

# Restore the database
mongorestore  --db=mondeavie mondeaviedb/mondeavie
