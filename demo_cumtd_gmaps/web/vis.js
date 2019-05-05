$(function() {
  $.getJSON("res/buses.json")
   .done(function (data) { visualize(data); })
   .fail(function() { alert("Failed to load the JSON file!\n(Did your Python run?)"); });
});

var visualize = function(data) {
  // boilerplate
  var margin = { top: 0, right: 0, bottom: 0, left: 10 },
     width = 970 - margin.left - margin.right,
     height = (data.length * 20) - margin.top - margin.bottom;

  var svg = d3.select("#cumtd")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var minuteScale = d3.scaleLinear()
                 .domain([0,60])
                 .range([0,width]);
var minuteAxis = d3.axisBottom()
                 .scale(minuteScale);
               svg.append("g")
                  .call(minuteAxis);

  // simple text output
  svg.selectAll("routes")
     .data(data)
     .enter()
     .append("rect")
     .attr("x", function(d){
       return minuteScale(d["expected"]);
     })
     .attr("y", function (d, i) { return i *15})
     .attr("width",50)
     .attr("height",10)
     .attr("fill", function (d) { return "#" + d["route_color"]; })
};




var gmap_api_loaded = function() {
  $.getJSON("res/busesAndShapes.json")
   .done(function (data) { showGoogleMap(data); })
   .fail(function () { alert("Failed to load JSON for Part 2."); })
};

var showGoogleMap = function(data) {
  var mapOptions = {
    center: { lat: 40.108564, lng: -88.227134},
    zoom: 15
  };

  var map = new google.maps.Map(
	   document.getElementById("gmaps"),
     mapOptions
  );

  for (var i = 0; i < data.length; i++) {
    var d = data[i];

    console.log(d);

    var d_loc = { lat: d.loc.lat, lng: d.loc.lon};
    var title = d.route;
    var color = d.route_color;

    var d_marker = new google.maps.Marker({
      position: d_loc,
      map: map,
      title: title,
      icon: "http://www.googlemapsmarkers.com/v1/" + color + "/"
    });

    var d_path = [];
    d["shapes"].forEach(function (p) {
      d_path.push({
        lat: p["shape_pt_lat"],
        lng: p["shape_pt_lon"]
      });
    });

    var poly = new google.maps.Polyline({
      path: d_path,
      geodesic: true,
      strokeColor: "#" + color,
      strokeOpacity: 1,
      strokeWeight: 2
    });
    poly.setMap(map);
  }
};
