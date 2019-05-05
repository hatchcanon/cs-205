"use strict";

/**
 * Using jQuery, we request the JSON file from the server and then call
 * the `visualize` function with the data.
 */
$(function() {
  $.getJSON("res/studentGrades.json")
   .done(function (data) { visualize(data); })
   .fail(function() { alert("Failed to load the JSON file: " + fileName); });
});

/**
 * Called when the JSON has been loaded from the server, this function
 * renders the visualization.
 */
var visualize = function(data) {
  // == boilerplate for d3.js ==
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
      width = 970 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

  var svg = d3.select("#chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // == scales for d3.js ==

  // scale for converting a `grade` frome [0, 100] to [0, width]
  var gradeScale = d3.scaleLinear()
                     .domain([0, 100])
                     .range([0, width]);


  // == axes for d3.js ==

  // axis for `grade` scale
  var gradeAxis = d3.axisTop()
                    .scale(gradeScale);

  // draw the axis
  svg.append("g")
     .call(gradeAxis);


  // == visual encodings ==

  // draw a circle for each grade (in data)
  svg.selectAll("grade")
     .data(data)
     .enter()
     .append("circle")
     .attr("r", function (d, i) {
       return 4;
     })
     .attr("cx", function (d, i) {
       return gradeScale( d["grade"] );
     })
     .attr("cy", 0)
     .attr("fill", "red")
     .attr("stroke", "black")
     ;


  // == end of visualization ==
};
