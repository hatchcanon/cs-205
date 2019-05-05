"use strict";

/* Boilerplate jQuery */
$(function() {
  d3.csv("res/changed.csv", function (data) {
    visualize(data);
  });
});

/* Visualize the data in the visualize function */
var visualize = function(data) {
  console.log(data);

  // == BOILERPLATE ==
  var margin = { top: 50, right: 50, bottom: 50, left: 225 },
      width = 1000 - margin.left - margin.right,
      height = (data.length * 10);

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

var ethnicities = _.map(data, "Race");
ethnicities = _.uniq(ethnicities);

//Y domain is the colleges
var collegeScale = d3.scalePoint()
.domain(college)
.range([0,height]);

var collegeAxis = d3.axisLeft()
                     .scale(collegeScale);

svg.append("g")
   .call(collegeAxis)
   .attr("font-size", "15px")
   .attr("stroke", "purple");

//ethnicity crap
var ethnicityScale = d3.scalePoint()
.domain(ethnicities)
.range([0, height]);

var ethnicityAxis = d3.axisTop()
                     .scale(ethnicityScale);

svg.append("g")
   .call(ethnicityAxis)
   .attr("font-size", "15px")
   .attr("stroke", "purple");

//gonna try the groupBy
var groupData = _.groupBy(data, "College");
    groupData = _.toArray(groupData);

//the tip
var tip = d3.tip()
          .attr('class', 'd3-tip')
          .html(function (d) {
            return d["Race"] + " " + d["Percentage"]+ "%";
          });

svg.call(tip);

var color = d3.scaleLinear()
                .range(["hsla(360, 95%, 41%, 0.77)", "hsla(199, 77%, 41%, 0.77)"])
                .interpolate(d3.interpolateHsl);
// == VIZUALIZATION SHAPES ==
svg.selectAll("circles")
 .data(data)
 .enter()
 .append("circle")
 .on("mouseover", tip.show)
 .on("mouseout", tip.hide)
 .attr("cy", function (d) {
   return collegeScale( d["College"]);
 })
 .attr("cx", function (d) {
   return ethnicityScale( d["Race"]);
 })
 .attr("r",function (d) {
   return d["Percentage"]/6;
 })
 .attr("fill", function(d){
        return color(d["Percentage"])
     })
 //.style("fill-opacity",function(d){
//             return 0.5
//           })
};
