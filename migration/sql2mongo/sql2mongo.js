var Humps = require('humps'); // Underscore-to-camelCase converter
var fs = require('fs');
var async = require('async');

var tables = [
  'admin_activities_conference',
  'admin_activities_conference_speakers',
  'admin_activities_course',
  'admin_activities_coursename',
  'admin_activities_dayconference',
  'admin_activities_dayname',
  'admin_activities_dayschedule',
  'admin_activities_schedule',
  'admin_activities_speaker',
  'admin_activities_teacher',
  'admin_activities_testingday'
];



function getHeader(csv) {
  return csv.split("\n")[0];
}

function getBody(csv) {
  // break the textblock into an array of lines
  var lines = csv.split('\n');
  // remove one line, starting at the first position
  lines.splice(0,1);
  // join the array back into a single string
  var noFirstLine = lines.join('\n');
  return noFirstLine;
}

function removeStr(str, toRemove) {
  var parts = str.split(toRemove);
  parts.splice(0,1);
  return parts.join(toRemove);
}

function pluralise(str) {
  if(str[str.length -1 ] == "s") {
    return str;
  } else {
    return str + "s";
  }
}

function execute(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var command = spawn(cmd, args);
  var result = '';
  command.stdout.on('data', function(data) {
       result += data.toString();
  });

  command.stderr.on('data', function(data) {
       result += data.toString();
  });

  command.on('close', function(code) {
      return callback(result);
  });
}

function writeCsv(csv, collectionName, callback) {
  var fileName = collectionName + ".csv";
  fs.writeFile(fileName, csv, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
      callback;
  });
}

function importMongo(collectionName) {
  //mongoimport --collection adminActivitiesTeacher --type csv --headerline --db mondeavie admin_activities_teacher.csv
  var fileName = collectionName + ".csv";
  var cmd = 'mongoimport';
  var args = [ '--collection', collectionName, '--type', 'csv', '--headerline', '--db', 'mondeavie', "./csv/" + fileName ];
  execute(cmd, args, function callback(result) {
    console.log(result);
    //return csv;
  });
}

async.each(tables, function (tableName, callback) {
  console.log('tableName', tableName);

  //var collectionName = Humps.camelize(tableName);
  var collectionName = pluralise( removeStr(tableName, "admin_activities_") );

  /*
  
  var cmd = 'sqlite3';
  var args = [ 'db.sqlite3', '-header', '-csv', 'select * FROM ' + tableName ];
  execute(cmd, args, function callback(csv) {
    var csvCamelCase = Humps.camelize( getHeader(csv) ) + "\n";
    csvCamelCase += getBody(csv);
    writeCsv(csvCamelCase, collectionName );
  });
  */

  importMongo(collectionName);

});
//console.log(Humps.camelize('hello_world')); // 'helloWorld'