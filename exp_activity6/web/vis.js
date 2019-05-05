"use strict";

/* Boilerplate jQuery */
$(function() {
  d3.csv("res/illiniFootballScores_streak.csv", function (data) {
    visualize(data);
  });
});

/* Visualize the data in the visualize function */
var visualize = function(data) {
  console.log(data);

  // == BOILERPLATE ==
  var margin = { top: 50, right: 50, bottom: 50, left: 100 },
     width = 1000 - margin.left - margin.right,
     height = (data.length * 5);

  var svg = d3.select("#chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  // == Your code! :) ==
  // == DEFINE DATA ==
    var opponents = _.map(data, "Opponent");
    opponents = _.uniq(opponents);
    // opponents can now be used as the domain in your scale

    var years = _.map(data, "Season");
    years = _.uniq(years);
    // years can now be used as the domain in your scale


    var opponentScale = d3.scalePoint()
    .domain(opponents)
    .range([0,height]);

    var opponentAxis = d3.axisLeft()
  					             .scale(opponentScale);


    svg.append("g")
       .call(opponentAxis);
    //------------------------
    var seasonScale = d3.scaleLinear()
                          .domain([1892,2015])
                          .range( [0,width]);
    var seasonAxis = d3.axisTop()
                          .scale(seasonScale);
    svg.append("g")
    .call(seasonAxis);
    // The tip
    var tip = d3.tip()
              .attr('class', 'd3-tip')
              .html(function (d) {
                return "Illinois " + d["Location"] + " " + d["Opponent"] + ": " + d["IlliniScore"] + "-" + d["OpponentScore"];
              });

    svg.call(tip);

    // == VIZUALIZATION SHAPES ==
  svg.selectAll("circles")
   .data(data)
   .enter()
   .append("circle")
   .on("mouseover", tip.show)
   .on("mouseout", tip.hide)
   .attr("cx", function (d) {
     return seasonScale( d["Season"]);
   })
   .attr("cy", function (d) {
     return opponentScale( d["Opponent"]);
   })
   .attr("r", function (d) {
    if(d["WinStreak"] == 0 && d["Result"] == "W"){
    return 1+2;}
    else{
    return 1+d["WinStreak"]*2;
  }
})
.style("fill",function(d){
       if(d["Result"] === "W"){
         return "blue";
       }
       else{
         return "orange";
       }
     })
.style("fill-opacity",function(d){
            return 0.5
          })
   ;
};
