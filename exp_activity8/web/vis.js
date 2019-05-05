
$(function() {
  $.getJSON("res/graph.json")
   .done(function(data) { v(data); })
   .fail(function() { alert("Failed to load the JSON. (Did your Python run?)"); });
});

var v = function(data) {
  data.links.forEach(function (link) {
    if (link.score == undefined) {
      link.score = 0;
    }
  });

  var min = _.minBy(data.links, "score")["score"];
  var max = _.maxBy(data.links, "score")["score"];

  // Boilerplate
  var margin = { top: 30, right: 30, bottom: 30, left: 30 },
      width = 800 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  // --
  var svg = d3.select("#chart");
  svg = svg.append("svg")
           .attr("width", width + margin.left + margin.right)
           .attr("height", height + margin.top + margin.bottom)
           .style("width", width + margin.left + margin.right)
           .style("height", height + margin.top + margin.bottom);

  // --
  var defs = svg.append("svg:defs");

  defs.append("svg:marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

 // --
 svg = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // --
  var player_scale = d3.scalePoint()
                       .domain( [1, 2] )
                       .range( [0, height] );

  var marks_scale = d3.scalePoint()
                      .domain( [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0] )
                      .range( [0, width] );

  var marks_axis = d3.axisTop().scale(marks_scale);
  svg.append("g")
     .attr("transform", "translate(" + 0 + "," + (-10) + ")")
     .call(marks_axis);

  // --
  var player_axis = d3.axisLeft().scale(player_scale);
  svg.append("g")
     .attr("transform", "translate(" + (-10) + "," + 0 + ")")
     .call(player_axis);


  // --
  svg.selectAll("edges")
     .data(data.links)
     .enter()
     .append("line")
     .attr("x1", function(d) {
       var offset = 7;
       return marks_scale( data.nodes[ d.source ].marks ) + offset;
     })
     .attr("x2", function(d) {
       var offset = -7;
       return marks_scale( data.nodes[ d.target ].marks ) + offset;
     })
     .attr("y1", function(d) {
       var offset = 0;
       if (data.nodes[ d.source ].player == 1) { offset = 7; }
       else { offset = -7; }

       return player_scale( data.nodes[ d.source ].player ) + offset;
     })
     .attr("y2", function(d) {
       var offset = 0;
       if (data.nodes[ d.target ].player == 1) { offset = 7; }
       else { offset = -7; }

       return player_scale( data.nodes[ d.target ].player ) + offset;

     })
     .attr("marker-end", "url(#arrow)")
     .attr("stroke", function (d) {
       var score = d["score"];
       var a = 1;
       var h = 0;
       var l = "50%";

       if (score == 0) {
         a = 0.1;
         l = "0%";
       } else if (score > max / 2) {
         h = 229;
         a = score / max;
         if (a < 0.5) { a = 0.5; }
       } else {
         a = 1 - (score / (max / 2));
         if (a < 0.5) { a = 0.5; }
       }

       return "hsla(" + h + ", 100%, " + l + ", " + a + ")";
     })
     .attr("stroke-width", 3);


  // --
  svg.selectAll("nodes")
     .data(data.nodes)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
       return marks_scale(d.marks);
     })
     .attr("cy", function(d) {
       return player_scale(d.player);
     })
     .attr("r", 10)
     .attr("stroke", "black")
     .attr("fill", "transparent");


};
