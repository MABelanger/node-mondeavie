// import async to make control flow simplier
var async = require('async');

// import the rest of the normal stuff
var mongoose = require('mongoose');

require('./person.js')();

var Person = mongoose.model('Toto');

// define some dummy data
var data = [
    {
      name: 'bill',
      age: 25
    },
    {
      name: 'mary',
      age: 30
    },
    {
      name: 'bob',
      age: 21
    },
    {
      name: 'lilly',
      age: 26
    },
    {
      name: 'alucard',
      age: 1000
    }
];


mongoose.connect('mongodb://localhost/persons', function(err) {
  if (err) {
    throw err;
  }

  // create all of the dummy people
  async.each(data, function(item, cb) {
    Person.create(item, cb);
  });
});

