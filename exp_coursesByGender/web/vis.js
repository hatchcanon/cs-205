"use strict";

/**
 * Using jQuery, we request the JSON file from the server and then call
 * the `visualize` function with the data.
 */
$(function() {
  d3.csv("res/2015uiuc.csv", function (data) {
    visualize(data);
  });
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
 var numStudentsScale = d3.scaleLinear()
                          .domain( [0,5000])
                          .range( [0, width]);
 var pctFemaleScale = d3.scaleLinear()
                          .domain( [1,0] )
                          .range( [0, height]);

  // == axes for d3.js ==
  var xaxis = d3.axisTop()
                .scale( numStudentsScale );
  svg.append("g")
     .call(xaxis);
//same thing for y
  var yaxis = d3.axisLeft()
              .scale( pctFemaleScale );

svg.append("g")
   .call(yaxis);


  // == visual encodings ==
svg.selectAll("circles")
.data(data)
.enter()
.append("circle")
.attr("cx", function (d) {
  return numStudentsScale( d["Total"])
})
.attr("cy", function (d) {
  return pctFemaleScale( d["Female"])
})
.attr("r", 20)
.style("fill", "purple");
//.style("fill", function(d) { return d.color; });
  // == end of visualization ==
};
