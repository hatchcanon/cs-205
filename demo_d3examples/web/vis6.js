"use strict";

/* Boilerplate jQuery */
$(function() {
  d3.csv("res/illiniFootballScores.csv", function (data) {
    visualize(data);
  });
});

/* Visualize the data in the visualize function */
var visualize = function(data) {
  console.log(data);

  // == BOILERPLATE ==
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
     width = 800 - margin.left - margin.right,
     height = (data.length * 20);

  var svg = d3.select("#chart6")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  // == VIZUALIZATION SHAPES ==
  svg.selectAll("circles")
     .data(data)
     .enter()
     .append("circle")
     ;

};
