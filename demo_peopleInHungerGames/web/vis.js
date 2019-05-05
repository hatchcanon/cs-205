"use strict";

/* Boilerplate jQuery */
$(function() {
  var f1 = $.getJSON("res/hg.json");

  $.when(f1)
   .done(visualize)
   .fail(function() { alert("Failed to load JSON.") });
});




var visualize = function(data) {


  var bucket = 0;
  var BUCKET_SIZE = 15;

  var sentimentTotal = 0;
  var sentimentSummary = [];

  var people = [
    {
      "name": "Peeta",
      "knownAs": ["Peeta", "Peeta Mellark", "Mellark"]
    },
    {
      "name": "Gale",
      "knownAs": ["Gale"]
    },
    {
      "name": "Haymitch",
      "knownAs": ["Haymitch Abernathy", "Haymitch", "Abernathy"]
    },
    {
      "name": "Effie",
      "knownAs": ["Effie Trinket", "Effie", "Trinket"]
    },
    {
      "name": "Prim",
      "knownAs": ["Prim"]
    },
    {
      "name": "Madge",
      "knownAs": ["Madge"]
    },
    {
      "name": "Flavius",
      "knownAs": ["Flavius"]
    },
    {
      "name": "Octavia",
      "knownAs": ["Octavia"]
    },
    {
      "name": "Cinna",
      "knownAs": ["Cinna"]
    },
    {
      "name": "Caesar Flickerman",
      "knownAs": ["Caesar Flickerman", "Caesar", "Flickerman"]
    },
    {
      "name": "Claudius Templesmith",
      "knownAs": ["Claudius Templesmith", "Claudius", "Templesmith"]
    },
    {
      "name": "Rue",
      "knownAs": ["Rue"]
    },
    {
      "name": "Glimmer",
      "knownAs": ["Glimmer"]
    },
    {
      "name": "Foxface",
      "knownAs": ["Foxface"]
    },
    {
      "name": "Cato",
      "knownAs": ["Cato"]
    },
    {
      "name": "Thresh",
      "knownAs": ["Thresh"]
    },
    {
      "name": "President Snow",
      "knownAs": ["Snow", "President Snow"]
    },

  ];

  people.forEach(function (d) {
    d.summary = [];
    d.total = 0;
  });

  for (var i = 0; i < data.sentences; i++) {
    var sentiment = data.sentiments[i];
    sentimentTotal += sentiment;

    var persons = data.persons[i];
    people.forEach(function (d) {
      d.knownAs.forEach(function (aka) {
        if (persons.indexOf(aka) != -1) {
          d.total++;
        }
      });
    });

    if (bucket == BUCKET_SIZE) {
      bucket = -1;

      sentimentSummary.push(sentimentTotal / BUCKET_SIZE);
      sentimentTotal = 0;

      people.forEach(function (d) {
        d.summary.push(d.total);
        d.total = 0;
      });
    }
    bucket++;
  }

  data = sentimentSummary;

  var margin = { top: 10, right: 50, bottom: 10, left: 120 },
     width = 800 - margin.left - margin.right,
     height = 300 - margin.top - margin.bottom;

  var svg = d3.select("#chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var negScale = d3.interpolateHsl("white", "red");
  var posScale = d3.interpolateHsl("white", "green");

  var namesOfPeople = people.map( function (d) { return d.name; } );
  var namesScale = d3.scaleBand()
                           .domain(namesOfPeople)
                           .range( [30, height] )
                           .paddingOuter(0.2);

  var namesAxis = d3.axisLeft()
                    .scale(namesScale);

  var sentiment = d3.scaleBand()
                    .domain(["Sentiment"])
                    .range( [0, 30] );

  var sentimentAxis = d3.axisLeft()
                        .scale(sentiment);



  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(-1, 0)")
     .call(namesAxis);

   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(-1, 0)")
      .call(sentimentAxis);

  svg.append("g")
     .append("line")
     .attr("x1", 0)
     .attr("y1", 30)
     .attr("x2", data.length)
     .attr("y2", 30)
     .style("shape-rendering", "crispEdges")
     .attr("stroke-dasharray", "5,5")
     .attr("stroke", "black")
     .attr("stroke-width", "1");


  svg.selectAll(".sentiments")
     .data(data)
     .enter()
     .append("rect")
     .attr("y", 0)
     .attr("x", function (d, i) { return i; })
     .attr("width", 1)
     .attr("height", 10)
     .attr("fill", function (d, i) {
       if (d == 0) { return "white"; }
       if (d < 0) { return negScale(-1 * d); }
       if (d > 0) { return posScale(d); }
     });

  var data5 = [];
  var total = 0;
  for (var i = 0; i < data.length; i++) {
    total += data[i];
    if (i % 5 == 4) {
      data5.push(total / 5);
      total = 0;
    }
  }
  data = data5;
  svg.selectAll(".sentiments5")
     .data(data)
     .enter()
     .append("rect")
     .attr("y", 10)
     .attr("x", function (d, i) { return i * 5; })
     .attr("width", 5)
     .attr("height", 10)
     .attr("fill", function (d, i) {
       if (d == 0) { return "white"; }
       if (d < 0) { return negScale(-1 * d); }
       if (d > 0) { return posScale(d); }
     });


     var data5 = [];
     var total = 0;
     for (var i = 0; i < data.length; i++) {
       total += data[i];
       if (i % 3 == 2) {
         data5.push(total / 3);
         total = 0;
       }
     }
     data = data5;
     svg.selectAll(".sentiments15")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", 20)
        .attr("x", function (d, i) { return i * 15; })
        .attr("width", 15)
        .attr("height", 10)
        .attr("fill", function (d, i) {
          if (d == 0) { return "white"; }
          if (d < 0) { return negScale(-1 * d); }
          if (d > 0) { return posScale(d); }
        });

  svg.append("g")
     .append("line")
     .attr("x1", 0)
     .attr("y1", 0)
     .attr("x2", sentimentSummary.length)
     .attr("y2", 0)
     .style("shape-rendering", "crispEdges")
     .attr("stroke-dasharray", "5,5")
     .attr("stroke", "black")
     .attr("stroke-width", "1");



  for (var i = 0; i < people.length; i++) {
    var p = people[i];

    svg.selectAll(".people_" + i)
       .data(p.summary)
       .enter()
       .append("rect")
       .attr("x", function (d, i) { return i; })
       .attr("y", function (d, i) { return namesScale(p.name); } )
       .attr("width", 1)
       .attr("height", namesScale.bandwidth() )
       .attr("fill", function (d, i) {
         if (d == 0) { return "white"; }
         if (d == 1) { return "black"; }
       });
  }


}
