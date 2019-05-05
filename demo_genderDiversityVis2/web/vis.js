"use strict";

/* Boilerplate jQuery */
$(function() {
  d3.csv("res/genderDiversity.csv", function (data) {
    visualize(data);
  });
});

/* Visualize the data in the visualize function */
var visualize = function(data) {
  console.log(data);

  // == BOILERPLATE ==
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
     width = 800 - margin.left - margin.right,
     height = 400 - margin.top - margin.left;

  var svg = d3.select("#chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // == Your code! :) ==
  var colleges =_.map(data, "College");
  colleges =_.uniq(colleges);
  var collegesScale = d3.scaleBand()
  .paddingInner(0.2)
  .domain(colleges)
  .range([0,width]);

  var collegeAxis = d3.axisTop()
  .scale(collegesScale);

  svg.append("g")
     .call(collegeAxis);  

  var pctFemaleScale = d3.scaleLinear()
                         .domain( [0, 1] )
                         .range( [0, height] );

  var pctFemaleAxis = d3.axisLeft()
                        .scale(pctFemaleScale);

  svg.append("g")
     .call(pctFemaleAxis);


  var yearScale = d3.scalePoint()
                    .domain( [2005, 2015] )
                    .range( [0, collegesScale.bandwidth()] );

  var yearAxis = d3.axisBottom()
                   .scale(yearScale);

  svg.append("g")
//     .attr("rotate")
     .attr("transform", "translate(" + 0 +", " + height + ")")
     .call(yearAxis);


  var tip = d3.tip()
              .attr("class", "d3-tip")
              .html(function (d) {
                return d["Major Name"];
              });

  svg.call(tip);

//college groups
var groupData = _.groupBy(data, "College");
    groupData = _.toArray(groupData);

    console.log(groupData)

    var cSvg = svg.selectAll("groups")
                          .data(groupData)
                          .enter()
                          .append("g")
                          .attr("transform", function (d) {
                            var college = d[0]["College"];
                            return "translate(" + collegesScale(college) + ","+0+")";
                          });

cSvg.append("g")
.attr("transform", "translate("+0+", "+height+")")
//transform
.call(yearAxis);

  cSvg
    .selectAll("s")
    .data(function (d) { return d;})
    .enter()
    .append("line")
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
    .attr("x1", function (d) {
      return yearScale(2005);
    })
    .attr("y1", function (d) {
      console.log(d);
      return pctFemaleScale( d["%Female_2005"] );
    })
    .attr("x2", function (d) {
      return yearScale(2015);
    })
    .attr("y2", function (d) {
      return pctFemaleScale( d["%Female_2015"] );
    })
    .attr("stroke", "black")
    .attr("stroke-width", 3);


/*

  svg.selectAll("lines")
     .data(data)
     .enter()
     .append("line")
     .on("mouseover", tip.show)
     .on("mouseout", tip.hide)
     .attr("x1", function (d) {
       return yearScale(2005);
     })
     .attr("y1", function (d) {
       return pctFemaleScale( d["%Female_2005"] );
     })
     .attr("x2", function (d) {
       return yearScale(2015);
     })
     .attr("y2", function (d) {
       return pctFemaleScale( d["%Female_2015"] );
     })
     .attr("stroke", "black")
     .attr("stroke-width", 3)


*/









};
