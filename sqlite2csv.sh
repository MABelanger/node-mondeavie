mongod --dbpath /Volumes/data/mongodb

#!/bin/bash
./bin/sqlite3 ./sys/xserve_sqlite.db <<!
.headers on
.mode csv
.output out.csv
select * from eS1100_sensor_results;
!


admin_activities_conference
admin_activities_conference_speakers
admin_activities_course
admin_activities_coursename
admin_activities_dayconference
admin_activities_dayname
admin_activities_dayschedule
admin_activities_schedule
admin_activities_speaker
admin_activities_teacher
admin_activities_testingday         


sqlite3 -header -csv db.sqlite3 "select * FROM admin_activities_teacher;" > admin_activities_teacher.csv
mongoimport --collection adminActivitiesTeacher --type csv --headerline --db mondeavie admin_activities_teacher.csv

# drop db
use temp
db.runCommand( { dropDatabase: 1 } )