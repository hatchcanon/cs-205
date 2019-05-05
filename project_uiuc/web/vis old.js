"use strict";

/* Boilerplate jQuery */
$(function() {
  d3.csv("res/rawdata.csv", function (data) {
    visualize(data);
  });
});

/* Visualize the data in the visualize function */
var visualize = function(data) {
  console.log(data);

  // == BOILERPLATE ==
  var margin = { top: 50, right: 50, bottom: 50, left: 175 },
     width = 800 - margin.left - margin.right,
     height = (data.length * 50);

  var svg = d3.select("#chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  // == Your code! :) ==
var college = _.map(data, "College");
college = _.uniq(college);

//Y domain is the colleges
var collegeScale = d3.scalePoint()
.domain(college)
.range([0,height]);

var collegeAxis = d3.axisLeft()
                     .scale(collegeScale);

svg.append("g")
   .call(collegeAxis)
   .attr("stroke", "green");

//X Domain is the ethnicities

var eth = d3.map(function(row) { return d.College; })
console.log(eth);

var black = _.map(data, "Black");
black = _.uniq(black);
console.log(black);

var ethnicities = ['Asian', 'Black', 'Hispanic',	'International',	'Multi',	'Unknown']

var ethnicityScale = d3.scaleOrdinal()
.domain(ethnicities)
.range([0, 100, 200, 300, 400, 500]);

var ethnicityAxis = d3.axisTop()
                     .scale(ethnicityScale);

svg.append("g")
   .call(ethnicityAxis)
   .attr("stroke", "blue")


//the tip
// == VIZUALIZATION SHAPES ==
svg.selectAll("circles")
 .data(data)
 .enter()
 .append("circle")
 .attr("cx", function (d) {
   return ethnicityScale( d["Asian"]);
 })
 .attr("cy", function (d) {
   return ethnicityScale( d["All"]);
 })
 .attr("r",10)
};
