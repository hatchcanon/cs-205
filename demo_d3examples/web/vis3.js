"use strict";

// == BOILERPLATE ==
var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var svg = d3.select("#chart3")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .style("width", width + margin.left + margin.right)
          .style("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// == DEFINE DATA ==
var data = [
  {"x": 10, "color": "blue", "r": 10},
  {"x": 20, "color": "blue", "r": 10},
  {"x": 30, "color": "red", "r": 20},
  {"x": 40, "color": "blue", "r": 10},
  {"x": 50, "color": "blue", "r": 10},
  {"x": 60, "color": "red", "r": 20},
  {"x": 70, "color": "blue", "r": 10},
  {"x": 80, "color": "blue", "r": 10},
  {"x": 90, "color": "red", "r": 20},
  {"x": 100, "color": "blue", "r": 10}
];

// == VIZUALIZATION SHAPES ==
svg.selectAll("circles")
 .data(data)
 .enter()
 .append("circle")
 .attr("cx", function (d) {
   return d["x"];
 })
 .attr("cy", 13)
 .attr("r", function (d) {
   return d["r"];
 })
 .attr("fill", function (d) {
   return d["color"];
 })
 ;
