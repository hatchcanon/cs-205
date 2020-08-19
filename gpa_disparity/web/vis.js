"use strict";

/*
var cur_width = 0;
var svg = null;
var sizeScale = null;
*/
var _data = null;
var last_filters = null;

var updateByCheckboxes = function(forced) {
  try {
    // Update CSS classes
    $('input[type="checkbox"]:not(:checked)').parent().parent().removeClass("sel");
    $('input[type="checkbox"]:checked').parent().parent().addClass("sel");

    // Update visualization, if changed
    var filters = $('input[type="checkbox"]:checked').map(function() { return $(this).data("filter"); } ).get();
    if (last_filters == filters.toString() && forced != true) { return; }
    last_filters = filters.toString();

    var filtered = _.filter(_data, function(d) {
      return _.contains(filters, d["data"][0]["Course Subject"]);
    });

    if (filtered.length == 0) {
      $("#noresult").show();
    } else {
      $("#noresult").hide();
    }



    svg.selectAll(".gened_circle")
       .attr("r", function (d) {
         var containsAll = true;
         filters.forEach(function(f) {
           if ( _.indexOf(d["GenedRequirement"], f) == -1 ) { containsAll = false; }
           //if (!d["GenedRequirement"].includes(f)) { containsAll = false; }
         })

         if (containsAll) {
           return sizeScale(d["Total"]);
         } else {
           return 0;
         }
       });

     //ga('send', 'event', 'mouseover', 'filter', last_filters);

  } catch (e) {
    alert("Checkbox Exception: " + e);
  }
};


/*
$('input[type="checkbox"]').click(updateByCheckboxes);
$('input[type="checkbox"]').change(updateByCheckboxes);

$(window).resize(function () {
  if (_data != null) {
    var new_width = $("#chart").width();
    if (cur_width != new_width) {
      $("#chart").html("");
      $("div.d3-tip").remove();
      v2(_data);
    }
  }
});
*/

/* Boilerplate jQuery */
$(function() {
  $.get("res/full.csv")
   .done(function (csvData) {
     var data = d3.csvParse(csvData);
     var result = processData(data);
     _data = result;
     console.log(_data);
     visualize(result);
   })
  .fail(function(e) {
     alert("Failed to load CSV file!");
  });
});

var processData = function(data) {
  var cleanData = [];

  data.forEach(function (d) {
    if (d["A+"] == "N/A") { return; }
    if (d["Course Number"] >= 500) { return; }
    cleanData.push(d);
  });
  data = cleanData;


  data.forEach(function (d) {
    d["Course"] = d["Course Subject"] + " " + d["Course Number"];
    var namePieces = d["Primary Instructor"].split(",");
    if (namePieces.length < 2) {
      d["Name"] = d["Primary Instructor"];
    } else {
      d["Name"] = namePieces[0].trim() + ", " + namePieces[1].trim()[0] + ".";
    }
  });

  var groupByObj = _.groupBy(data, "Course");

  var courses = [];
  _.each(groupByObj, function (v, k) {
    courses.push({
      course: k,
      data: v
    });
  });

  courses.forEach(function (d) {
    var instGroup = _.groupBy(d["data"], "Primary Instructor");

    d["instructors"] = [];
    _.each(instGroup, function(data, instructor) {
      d["instructors"].push({
        instructor: data[0]["Name"],
        data: data
      })
    });
  });

  var coursesWithMultipleSections = [];
  courses.forEach(function (course) {
    if (course.instructors.length > 1) {
      coursesWithMultipleSections.push(course);

      course["instructors"].unshift({
        instructor: "All Sections",
        data: course.data,
        top: true
      })
    }
  });


  var gradeLetterGPAs = {
    "A+": 4.00, "A": 4.00, "A-": 3.67,
    "B+": 3.33, "B": 3.00, "B-": 2.67,
    "C+": 2.33, "C": 2.00, "C-": 1.67,
    "D+": 1.33, "D": 1.00, "D-": 0.67,
    "F": 0
  };
  var gradeLetters = _.keys(gradeLetterGPAs);

  courses.forEach(function (course) {
    course["instructors"].forEach(function (instructor) {
      gradeLetters.forEach(function (gradeLetter) {
        instructor[gradeLetter] = 0;
      });

      // Sum each grade letter
      instructor.data.forEach(function (sectionData) {
        gradeLetters.forEach(function (gradeLetter) {
          instructor[gradeLetter] += parseInt(sectionData[gradeLetter]);
        })
      });

      // Compute the GPA
      instructor["sumGPA"] = 0;
      instructor["countGPA"] = 0;
      gradeLetters.forEach(function (gradeLetter) {
        instructor["sumGPA"] += instructor[gradeLetter] * gradeLetterGPAs[gradeLetter];
        instructor["countGPA"] += instructor[gradeLetter];
      });
      instructor["avgGPA"] = instructor["sumGPA"] / instructor["countGPA"];

      // Compute the stddev
      instructor["sumSqDev"] = 0;
      gradeLetters.forEach(function (gradeLetter) {
        var diff = Math.pow(gradeLetterGPAs[gradeLetter] - instructor["avgGPA"], 2);
        instructor["sumSqDev"] += diff * instructor[gradeLetter];
      });

      instructor["varGPA"] = instructor["sumSqDev"] / instructor["countGPA"];
      instructor["stddevGPA"] = Math.pow(instructor["varGPA"], 0.5);

      // Compute quartiles
      var grades = [];
      gradeLetters.forEach(function (gradeLetter) {
        for (var i = 0; i < instructor[gradeLetter]; i++) { grades.push(gradeLetter); }
      });

      //console.log(grades[ Math.floor(grades.length * 3 / 4) ]);


      instructor["gpa_1_8"] = gradeLetterGPAs[ grades[ Math.floor(grades.length * 1 / 8) ] ];
      instructor["gpa_1_6"] = gradeLetterGPAs[ grades[ Math.floor(grades.length * 1 / 6) ] ];

      instructor["topQuartGPA"] = gradeLetterGPAs[ grades[ Math.floor(grades.length * 1 / 4) ] ];
      instructor["medianGPA"] = gradeLetterGPAs[ grades[ Math.floor(grades.length * 2 / 4) ] ];
      instructor["bottomQuartGPA"] = gradeLetterGPAs[ grades[ Math.floor(grades.length * 3 / 4) ] ];

      instructor["gpa_5_6"] = gradeLetterGPAs[ grades[ Math.floor(grades.length * 5 / 6) ] ];
      instructor["gpa_7_8"] = gradeLetterGPAs[ grades[ Math.floor(grades.length * 7 / 8) ] ];

      instructor["gpa_top"] = gradeLetterGPAs[ grades[ 0 ] ];
      instructor["gpa_bottom"] = gradeLetterGPAs[ grades[ grades.length - 1 ] ];

    });

    // Compute diff in stddev
    course["instructors"].forEach(function (instructor) {
      if (instructor.instructor == "All Sections") {
        instructor["stddevDiff"] = 99999; // always be first
      } else {
        instructor["gpaAvgDiff"] = instructor["avgGPA"] - course["instructors"][0]["avgGPA"];

        instructor["stddevDiff"] = instructor["gpaAvgDiff"] / course["instructors"][0]["stddevGPA"];
      }
    });

    course["instructors"] = _.reverse(_.sortBy(course["instructors"], "stddevDiff"));



  });

  coursesWithMultipleSections.forEach(function (course) {
    var easiestProf = course["instructors"][1]["stddevDiff"];
    var hardestProf = course["instructors"][course["instructors"].length - 1]["stddevDiff"];
    course["stdDevSpread"] = hardestProf - easiestProf;

    var weightedVar = 0;
    course["instructors"].forEach(function (instructor) {
      if (instructor.instructor == "All Sections") { return; }
      weightedVar += Math.abs(instructor["stddevDiff"] * instructor["countGPA"]);
    });
    weightedVar /= course["instructors"][0]["countGPA"];
    course["averageVar"] = weightedVar;
    //console.log(weightedVar);

  });



  //coursesWithMultipleSections = _.reverse(_.sortBy(coursesWithMultipleSections, "averageVar"));
  coursesWithMultipleSections = _.sortBy(coursesWithMultipleSections, "course");
  //console.log(coursesWithMultipleSections);

  //console.log(coursesWithMultipleSections);
  return coursesWithMultipleSections;
};



/* Visualize the data in the visualize function */
var visualize = function(data) {
  console.log(data);




  /*
  var table = d3.select("#chart")
                .append("table");

  var header = table.append("tr");

  header.append("th").text("Course");
  header.append("th").text("Instructor");

  var g_courses =
    table.selectAll("courses")
       .data(data)
       .enter()
       .append("tr");

   g_courses.append("td")
    .text(function (d, i) { return d["course"]; })
    */
  // --
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .html(function (d, i) {
                var s = "Historically, sections taught by " + d["instructor"] + " have ";

                if      (d["stddevDiff"] > 0.33)  { s += "much higher "; }
                else if (d["stddevDiff"] > 0.17)  { s += "somewhat higher "; }
                else if (d["stddevDiff"] > 0.1)   { s += "slightly higher "; }
                else if (d["stddevDiff"] > -0.1)  { s += "abouve average "; }
                else if (d["stddevDiff"] > -0.17) { s += "slightly lower "; }
                else if (d["stddevDiff"] > -0.33) { s += "somewhat lower "; }
                else                              { s += "much lower "; }

                s += "GPAs than an average section of " + d["data"][0]["Course"];
                return s;
              });

  var viz = d3.select("#chart");

  var g_courses =
    viz.selectAll("courses")
       .data(data)
       .enter()
       .append("div")
       .attr("class", "cs205viz");

   g_courses.append("h4")
    .text(function (d, i) {
      return d["course"] + ": " + d["data"][0]["Course Title"];
    })

  var g_insts = g_courses;
  //.append("div")
  //  .attr("class", "row");

  var g_inst =
    g_insts.selectAll("s")
    .data(function (d) {
      //console.log(d);
      return d["instructors"];
    })
    .enter()
    .append("div")
    .attr("class", function (d, i) {
      if (i == 0) { return "row cs205-headerRow"; }
      else        { return "row"; }
    });


  var g_preViz = g_inst.append("div")
    .attr("class", "col-xs-3")
    .append("div")
    .attr("class", "row");

  g_preViz.append("div")
    .attr("class", "col-xs-12 col-md-6")
    .style("overflow", "hidden")
    .style("white-space", "nowrap")
    .style("text-overflow", "ellipsis")
    .style("text-align", "left")
    .style("padding-right", "0px")
    .html(function (d, i) {
      var s = "";
      if (i == 0) {
        s += "<h6>Instructor</h6>";
        s += '<b><span class="hidden-sm hidden-xs">All Sections</span><span class="hidden-md hidden-lg hidden-xm">Overall</span></b>';
      } else {
        s += d["instructor"];
      }
      return s;
    });

  g_preViz.append("div")
    .attr("class", "col-md-3 hidden-xs hidden-sm")
    .style("margin-left", "-15px")
    .html(function (d, i) {
      var s = "";
      if (i == 0) { s += '<h6>Students</h6>'; }
      s += d["countGPA"];
      return s;
    });

    g_preViz.append("div")
    .attr("class", "col-md-3 hidden-xs hidden-sm")
    .html(function (d, i) {
      var s = "";
      if (i == 0) { s += "<h6>Sections</h6>"; }
      s += d["data"].length;
      return s;
    });



  var margin = { top: 19, right: 10, bottom: 0, left: 10 };
  var width = $("#sizer").width() - margin.right - margin.left;
  var height = 10;

  var colorScale = d3.scaleLinear()
                     .domain([99999, 0, -0.25, -0.25, -2])
                     .range([241, 241, 290, 350, 360]);

  var gpaScale = d3.scaleLinear()
                   .domain([0, 4])

                   .range([0, width]);

  var gpaAxis = d3.axisTop(gpaScale)
                  .tickValues([0, 1, 2, 3, 4]);


  var inst_svg = g_inst.append("div")
    .attr("class", "col-xs-6")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", function (d) {
      if (d["instructor"] == "All Sections") { return height + margin.top + margin.bottom; }
      return height;
    })
    .style("width", width + margin.left + margin.right)
    .style("height", function (d) {
      if (d["instructor"] == "All Sections") { return height + margin.top + margin.bottom; }
      return height;
    })
    .append("g")
    .attr("transform", function (d) {
      if (d["instructor"] == "All Sections") {
        return "translate(" + margin.left + "," + margin.top + ")";
      } else {
        return "translate(" + margin.left + "," + 0 + ")";
      }
    });

  //gpaAxis(inst_svg.append("g"));
  inst_svg.call(tip);

  inst_svg.filter(function (d) { return d["instructor"] == "All Sections"})
          .append("g")
          .attr("transform", "translate(" + 0 + "," + "-2" + ")")
          .attr("class", "axis")
          .call(gpaAxis);
/*
  inst_svg.append("g")
    //.call(gpaAxis);
    .apply(function (d, i) {
      console.log(d);
      console.log(i);
      if (d["instructor"] == "All Sections") {
        console.log("grid");
        gpaAxis(d,i);
      }
    });
*/
  var gpaColor = "hsla(241, 100%, 76%, 0.2)";

  var drawGPABox = function(low, high, a) {
    inst_svg.append("rect")
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("x", function (d) {
        return gpaScale(d[low]) - 5;
      })
      .attr("width", function (d) {
        return gpaScale(d[high]) - gpaScale(d[low]) + 10;
      })
      .attr("height", height)
      .attr("fill", function (d) {
        var h = colorScale(d["stddevDiff"]);
        return "hsla(" + h + ", 100%, 76%, " + a + ")";

      })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      ;
  };

  drawGPABox("gpa_bottom", "gpa_top", 0.2);
  drawGPABox("gpa_7_8", "gpa_1_8", 0.2);
  drawGPABox("gpa_5_6", "gpa_1_6", 0.2);
  drawGPABox("bottomQuartGPA", "topQuartGPA", 0.6);









  inst_svg.append("rect")
    .attr("x", function (d) {
      return gpaScale(d["avgGPA"]) - 1;
      //return gpaScale(d["medianGPA"]) - 1;
    })
    .attr("width", function (d) {
      return 3;
    })
    .attr("height", height)
    .attr("fill", "black");

    /*
    .html(function (d) {
      return "<b>" +
        d["avgGPA"] + " " +
        d["stddevDiff"] + " " +
        d["medianGPA"] + " " +
        d["bottomQuartGPA"] + " " +
        d["topQuartGPA"] +
        "</b>"
    });
    */

  var g_postViz = g_inst.append("div")
    .attr("class", "col-xs-3")
    .append("div")
    .attr("class", "row");

  g_postViz.append("div")
    .attr("class", "col-xs-6")
    .html(function (d, i) {
      if (d["instructor"] == "All Sections") {
        return "<h6>&Delta;&sigma;</h6>&ndash;"
      }
      var value = d["stddevDiff"].toFixed(2);

      if (value < 0)
        return value;
      else if (value == 0)
        return "+0.00"
      else
        return "+" + value;
    })

    g_postViz.append("div")
      .attr("class", "col-xs-6")
    .html(function (d, i) {
      var s = "";
      if (i == 0) { s += "<h6>GPA</h6>"; }
      s += d["avgGPA"].toFixed(2);
      return s;
    });

  return;








  // == BOILERPLATE ==
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
     width = 800 - margin.left - margin.right,
     height = (data.length * 80);

  var svg = d3.select("#chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //
  var g_courses =
    svg.selectAll("courses")
       .data(data)
       .enter()
       .append("g")
       .attr("transform", function (d, i) {
         return "translate(" + 0 + "," + (i * 80) + ")"
       });

    //
    g_courses.append("text")
       //.attr("x", function (d, i) { return i * 10; })
       //.attr("y", function (d, i) { return i * 10; })
       .text(function (d, i) { return d["course"]; })
       .attr("fill", "black")
       ;


  // == Your code! :) ==

};
