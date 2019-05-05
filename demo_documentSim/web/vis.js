"use strict";

/* Boilerplate jQuery */
$(function() {
  $.getJSON("res/graph.json")
   .done(function (data) {
     visualize(data);
     //visualize2(data);
   })
   .fail(function() { alert("Failed to load the JSON file!\n(Did your Python run?)"); });
});



var visualize2 = function(data) {
  // == BOILERPLATE ==
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
     width = 1600 - margin.left - margin.right,
     height = 1600 - margin.top - margin.bottom;

  var svg = d3.select("#chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // == SCALES ==
  var xScale = d3.scaleBand()
                 .domain( d3.range( data.vertices.length ) )
                 .range( [0, width] );

  var yScale = d3.scaleBand()
                       .domain( d3.range( data.vertices.length ) )
                       .range( [0, height] );

  var simScale = d3.scalePow()
                         .exponent(1)
                         .domain([
                           d3.min( data.edges, function (d) { return d.similarity } ),
                           d3.max( data.edges, function (d) { return d.similarity } )
                         ])
                         .range( [0, 1] );

  var xAxis = d3.axisTop()
                .scale(xScale);

  svg.append("g")
     .attr("class", "axis")
     .call(xAxis);

   var yAxis = d3.axisRight()
                 .scale(yScale);


   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + width + ", 0)")
      .call(yAxis);

  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .html(function (d) {
                return "Simularity: " + d.similarity;
              });
  svg.call(tip);

  // == VISUAL ENCODINGS ==
  svg.selectAll(".rects")
     .data(data.edges)
     .enter()
     .append("rect")
     .attr("x", function (d, i) {
       return xScale(d.target);
     })
     .attr("y", function (d, i) {
       return xScale(d.source);
     })
     .attr("width", xScale.bandwidth())
     .attr("height", yScale.bandwidth())
     .attr("opacity", function (d) {
       return simScale(d.similarity);
     })
     //.attr("fill", "#c58115")
     .attr("fill", "#8400ff")
     .on("mouseover", tip.show)
     .on("mouseout", tip.hide)
     .on("click", function (d) {
       var source_tfidf = d["source-tfidf"];
       var target_tfidf = d["target-tfidf"];

       var allWords = [];
       for (var key in source_tfidf) {
         if (allWords.indexOf(key) == -1) {
           allWords.push(key);
         }
       }

       for (var key in target_tfidf) {
         if (allWords.indexOf(key) == -1) {
           allWords.push(key);
         }
       }

       var source_html = data.vertices[d.source].text;
       var target_html = data.vertices[d.target].text;

       var html = "";
       html += "<p><b>Similarity</b>: " + d.similarity + "</p>";
       html += "<hr />";
       html += "<p><b>Paragraph #1</b>: " + source_html + "</p>";
       html += "<hr />";
       html += "<p><b>Paragraph #2</b>: " + target_html + "</p>";

       html += "<table class=\"table table-striped\" >";
       html += "<thead>";
       html += "<tr>";
       html += "<th>Word</th>";
       html += "<th>tfidf - Paragraph #1</th>";
       html += "<th>tfidf - Paragraph #2</th>";
       html += "</tr>";
       html += "</thead>";

       html += "<hr />";

       for (var i in allWords) {
         var word = allWords[i];

         html += "<tr>";
         html += "<td>" + word + "</td>";

         if (word in source_tfidf) {
           html += "<td>" + source_tfidf[word] + "</td>";
         } else {
           html += "<td>---</td>";
         }

         if (word in target_tfidf) {
           html += "<td>" + target_tfidf[word] + "</td>";
         } else {
           html += "<td>---</td>";
         }

         html += "</tr>";
       }
       html += "</table>";


       $(".modal-title").html("Similarity Details");
       $(".modal-body").html(html);
       $("#tfidf-modal").modal();
     })
     ;



};


/* Visualize the data in the visualize function */
var visualize = function(data) {
  // == BOILERPLATE ==
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
     width = 800 - margin.left - margin.right,
     height = 400 - margin.top - margin.bottom;

  var svg = d3.select("#chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // == SCALES ==
    var xScale = d3.scalePoint()
                   .domain( d3.range( data.vertices.length ) )
                   .range( [0, width] );

    var arcScale = d3.scalePow()
                     .exponent(3)
                     .domain([
                        d3.min( data.edges, function (d) { return d.similarity } ),
                        d3.max( data.edges, function (d) { return d.similarity } )
                     ])
                     .range( [0, 1] );

    var color = d3.interpolateHsl("#8400ff", "yellow");

    // == HELPER ==
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function (d) {
                  return d.text.replace("\n", "<br><br>");
                });

    svg.call(tip);

    var tip2 = d3.tip()
                .attr('class', 'd3-tip')
                .html(function (d) {
                  return JSON.stringify(d["source-tfidf"]);
                });

    svg.call(tip2);


    // == VISUAL ENCODINGS ==
    svg.selectAll(".paragraph_circles")
       .data(data.vertices)
       .enter()
       .append("circle")
       .attr("cx", function (d) { return xScale( d.index ) } )
       .attr("cy", height)
       .attr("r", 2)
       .on("mouseover", tip.show)
       .on("mouseout", tip.hide);

    // == ARCS ==
    var arc = d3.arc()
                    .innerRadius( function (d) {
                      var x1 = xScale( d.source );
                      var x2 = xScale( d.target );
                      var diff = x2 - x1;
                      return diff / 2;
                    })
                    .outerRadius( function (d) {
                      var x1 = xScale( d.source );
                      var x2 = xScale( d.target );
                      var diff = x2 - x1;
                      return (diff / 2) - 1;
                    })
                    .startAngle(-Math.PI/2) //convert from degs to radians
                    .endAngle(Math.PI/2) //just radians

    svg.selectAll(".paragraph_arcs")
       .data(data.edges)
       .enter()
       .append("path")
       .attr("d", arc)
       .attr("transform", function (d) {
         var x1 = xScale( d.source );
         var x2 = xScale( d.target );
         var dx = x1 + ((x2 - x1) / 2);
         var dy = height;
         return "translate(" + dx + ", " + dy + ")";
       })
       .attr("opacity", function (d) {
         return arcScale(d.similarity);
       })
       .attr("stroke", function (d) {
         return color(d.similarity);
       })
       .on("mouseover", tip2.show)
       .on("mouseout", tip2.hide)

       ;



}
