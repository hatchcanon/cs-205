"use strict";

/* Boilerplate jQuery */
$(function() {
  d3.csv("res/CSplusX.csv", function (data) {
    visualize(data);
  });
});

/* Visualize the data in the visualize function */
var visualize = function(data) {
  console.log(data);

  // == BOILERPLATE ==
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
     width = 900 - margin.left - margin.right,
     height = 930 - margin.top - margin.left;

  var svg = d3.select("#chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  // == Your code! :) ==
  var tip = d3.tip()
              .attr("class", "d3-tip")
              .html(function (d) {
                return d.data["Degree" + ];
              });

svg.call(tip);

  var arc = d3.arc()
   .outerRadius(250)
   .innerRadius(0);

  var pie = d3.pie()
  .value(function (d) {
    return d["Standalone"]
  });

  //visuals
  var g = svg.append("g")
  .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

g.selectAll(".arc")
 .data(pie(data))
 .enter()
 .append("g")
 .attr("class", "arc")
 .append("path")
 .attr("d", arc)
 .on("mouseover", tip.show)
 .on("mouseout", tip.hide)
 .style("fill", function(d) {
  console.log(d);
   if (d.data["Degree"] == "Anthropology ") return "hsla(11, 93%, 40%, 1)";
   if (d.data["Degree"] == "Astronomy ") return "hsla(230, 88%, 50%, 1)";
   if (d.data["Degree"] == "Chemistry ") return "hsla(150, 94%, 45%, 1)";
   if (d.data["Degree"] == "Linguistics ") return "hsla(204, 100%, 50%, 1)";
   if (d.data["Degree"] == "Mathematics ") return "hsla(125, 75%, 30%, 1)";
   if (d.data["Degree"] == "Statistics ") return "hsla(229, 100%, 28%, 1)";
   if (d.data["Degree"] == "Computer Science") return "hsla(185, 82%, 46%, 1)";
   return "pink";

});

};
