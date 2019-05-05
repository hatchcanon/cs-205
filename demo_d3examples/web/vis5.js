"use strict";

// == BOILERPLATE ==
var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

var svg = d3.select("#chart5")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .style("width", width + margin.left + margin.right)
          .style("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// == DEFINE DATA ==
var data = [
  {"grade": 84, "assignment": "Exam 1"},
  {"grade": 67, "assignment": "Exam 2"},
  {"grade": 89, "assignment": "Exam 1"},
  {"grade": 42, "assignment": "Exam 1"},
  {"grade": 81, "assignment": "Exam 2"},
  {"grade": 93, "assignment": "Exam 2"},
  {"grade": 91, "assignment": "Exam 2"},
  {"grade": 97, "assignment": "Exam 1"},
  {"grade": 92, "assignment": "Exam 2"},
];

var gradeScale = d3.scaleLinear()
                  .domain( [0,100])
                  .range([0,width]);

var gradeAxis = d3.axisTop()
                  .scale(gradeScale);

svg.append("g")
    .call(gradeAxis);
//------------------------
var assignmentScale = d3.scalePoint()
                        .domain(["Exam 1", "Exam 2"])
                        .range( [0,height]);

var assignmentAxis = d3.axisLeft()
                      .scale(assignmentScale);

svg.append("g")
    .call(assignmentAxis);
// == VIZUALIZATION SHAPES ==
svg.selectAll("circles")
 .data(data)
 .enter()
 .append("circle")
 .attr("cx", function (d) {
   return gradeScale( d["grade"]);
 })
 .attr("cy", function (d) {
   return assignmentScale( d["assignment"]);
 })
 .attr("r", 4)
 ;
