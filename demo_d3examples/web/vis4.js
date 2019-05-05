"use strict";

// == BOILERPLATE ==
var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var svg = d3.select("#chart4")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .style("width", width + margin.left + margin.right)
          .style("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// == DEFINE DATA ==
var data = [
  {"grade": 84},
  {"grade": 67},
  {"grade": 89},
  {"grade": 42},
  {"grade": 81},
  {"grade": 93},
  {"grade": 91},
  {"grade": 97},
  {"grade": 92},
];

var gradeScale = d3.scaleLinear()
                  .domain( [0,100])
                  .range( [0, width ])

var gradeAxis = d3.axisTop()
                  .scale(gradeScale);

svg.append("g")
    .call(gradeAxis);

// == VIZUALIZATION SHAPES ==
svg.selectAll("circles")
 .data(data)
 .enter()
 .append("circle")
 .attr("cx", function (d) {
   return gradeScale(d["grade"]);
 })
 .attr("cy", 0)
 .attr("r", 5)
 ;
