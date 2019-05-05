

$(function() {
  $.getJSON("res/tree.json")
   .done(function (data) { visualize(data, "#tree"); })
   .fail(function() { alert("Falied to load JSON!"); });
});

var redirectFunction = function(board) {
  return function() {
    window.location.replace("?show=py_viz&board=" + board);
  };
};

var init = function(gameData) {
  var id_map = [
    "#cell_top_left", "#cell_top_center", "#cell_top_right",
    "#cell_middle_left", "#cell_middle_center", "#cell_middle_right",
    "#cell_bottom_left", "#cell_bottom_center", "#cell_bottom_right"
  ];

  var move = gameData.current;
  var game = gameData.game;

  if (game == "finished") {
    $("#gameOver").show();
  }

  if (game == "new") {
    $("#div_show").hide();
  }

  for (var i = 0; i < 9; i++) {
    if (move[i] == "X" || move[i] == "O") {
      $(id_map[i]).html(move[i]);
    } else if (game != "finished") {
      var newBoard = move.slice(0);
      newBoard[i] = "O";
      board = newBoard.join("");
      $(id_map[i]).click(redirectFunction(board))
                  .css("cursor", "pointer");
    }
  }
};


var visualize = function(data, target) {
  // == BOILERPLATE ==
  var margin = { top: 0, right: 50, bottom: 0, left: 50 },
     width = 1100 - margin.left - margin.right,
     height = 500 - margin.top - margin.bottom;

  // ==
  var tree = d3.layout.tree()
    .size([width, 1]);

  var diagonal = d3.svg.diagonal();

  var root = data;
  var nodes = tree.nodes(root);

  // Re-calculate y
  var yGivenDepth = function (depth) {
    var base = 100;
    var separation = 30;

    var y = 0;
    for (var i = 0; i < depth; i++) {
      y += (base / (i + 1)) + separation;
    }
    return y;
  };

  var maxDepth = d3.max(nodes, function(d) { return d.depth; });
  var height = yGivenDepth(maxDepth + 1);

  nodes.forEach(function (d) {
    d.y = yGivenDepth(d.depth);
  });

  var links = tree.links(nodes);

  var svg = d3.select(target)
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("width", width + margin.left + margin.right)
              .style("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var drawBoard = function(d) {
    var svg = d3.select(this);
    var w = 100 / (d.depth + 1);

    var board = svg.append("g")
      .attr("transform", function (d) { return "translate(" + (d.x - (w/2)) + "," + d.y + ")" })

    var grid = board.append("g");
    grid.append("line").attr("x1", 0).attr("y1", w/3).attr("x2", w).attr("y2", w/3).attr("stroke", "black");
    grid.append("line").attr("x1", 0).attr("y1", 2*w/3).attr("x2", w).attr("y2", 2*w/3).attr("stroke", "black");
    grid.append("line").attr("y1", 0).attr("x1", w/3).attr("y2", w).attr("x2", w/3).attr("stroke", "black");
    grid.append("line").attr("y1", 0).attr("x1", 2*w/3).attr("y2", w).attr("x2", 2*w/3).attr("stroke", "black");

    for (var i = 0; i < 9; i++) {
      var p = d.board[i];

      var row = Math.floor(i / 3);
      var col = i % 3;

      var dx = (col * w/3) + (0.1 * w/3);
      var dy = (row * w/3) + (0.1 * w/3);

      var mark = board.append("g")
        .attr("transform", function (d) { return "translate(" + dx + "," + dy + ")" });

      if (p == "X") {
        mark.append("line")
          .attr("x1", 0).attr("y1", 0)
          .attr("x2", 0.8*w/3).attr("y2", 0.8*w/3)
          .attr("stroke", "red");

        mark.append("line")
          .attr("x1", 0).attr("y1", 0.8*w/3)
          .attr("x2", 0.8*w/3).attr("y2", 0)
          .attr("stroke", "red");

      } else if (p == "O") {
        mark.append("circle")
          .attr("r", 0.4 * w/3)
          .attr("cx", 0.4 * w/3)
          .attr("cy", 0.4 * w/3)
          .attr("stroke", "green")
          .attr("stroke-width", 1)
          .attr("fill", "transparent");
      }

      if (d.score == 1) {
        board.append("line")
          .attr("x1", 0.1*w).attr("y1", 0.1*w)
          .attr("x2", 0.9*w).attr("y2", 0.9*w)
          .attr("stroke", "red")
          .attr("stroke-width", 3);

        board.append("line")
          .attr("x1", 0.1*w).attr("y1", 0.9*w)
          .attr("x2", 0.9*w).attr("y2", 0.1*w)
          .attr("stroke", "red")
          .attr("stroke-width", 3);
      } else if (d.score == -1) {
        board.append("circle")
          .attr("cx", w*0.5)
          .attr("cy", w*0.5)
          .attr("r", w*0.4)
          .attr("fill", "transparent")
          .attr("stroke", "green")
          .attr("stroke-width", 3);
      }
    }
  };

  svg.selectAll("nodes")
     .data(nodes)
     .enter()
     .append("g")
     .each(drawBoard)
     ;

  svg.selectAll("links")
    .data(links)
    .enter()
    .append("path")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill", "transparent")
    .attr("d", function (d) {
      //console.log(d);

      var s = {
        x: d.source.x,
        y: d.source.y + (100 / (d.source.depth + 1)),
      };
      var t = {
        x: d.target.x,
        y: d.target.y,
      };


      return diagonal({
        source: s,
        target: t
      });
    })
    ;
};
