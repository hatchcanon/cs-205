"use strict";

// == BOILERPLATE ==
var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var svg = d3.select("#chart1")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .style("width", width + margin.left + margin.right)
          .style("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// == DEFINE DATA ==
var data = [
  {"score": 10},
  {"score": 20},
  {"score": 30},
  {"score": 40},
  {"score": 50},
  {"score": 60},
  {"score": 70},
  {"score": 80},
  {"score": 90},
  {"score": 100}
];

// == VIZUALIZATION SHAPES ==
svg.selectAll("circles")
 .data(data)
 .enter()
 .append("circle")
 .attr("cx", 20)
 .attr("cy", 20)
 .attr("r", function (d) {
   return d["score"];
 })
 .attr("fill", "hsla(31, 100%, 50%, 0.2)")
 .attr("stroke", "red")
 ;
