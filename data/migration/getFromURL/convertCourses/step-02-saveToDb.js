"use strict";
var _ = require('lodash');
var Request     = require("superagent");
var fs = require("fs");

let courseJson = require("./courses.json");
let svgJson = require("./svg.json");

function saveCourse(obj){
  const URL = 'http://localhost:3000/api/courses';
  var promise = new Promise(function(resolve, reject) {
    Request
      .post(URL)
      .accept('application/json')
      .type('application/json')
      .send(obj)
      .end((err, res) => {
        if (! err ) {
          resolve(res.body);
        }
        else {
          reject(err);
        }
      });
  });
  return promise;
}


function saveAll(courses, svgJson){

  for(let i=0; i<courses.length; i++){
    let course = courses[i];

    let svg = _.find(svgJson, function(svg) {
      return svg.name == course.name; 
    });
    course.svg = svg.svg;
    console.log('course.svg', course.svg.length);
    console.log('dataUri.length', course.teachers[0].course.image.dataUri.length);
    saveCourse(course)
      .then( (course) => {
        console.log('course._id', course._id)
        //cb(course);
      }, (errors) => {
        console.log('err', errors)
      });
  }
}

saveAll(courseJson, svgJson);