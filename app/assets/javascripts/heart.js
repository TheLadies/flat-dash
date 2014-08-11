$(function(){
  var data = [
    {"id": 0, "name": "jessrudder", "r": 50 },
    {"id": 0, "name": "aviflombaum", "r": 40 },
    {"id": 0, "name": "Javascript", "r": 30 },
    {"id": 0, "name": "NodeJs", "r": 30 },
    {"id": 0, "name": "D3.js", "r": 40 },
    {"id": 0, "name": "CreateJS", "r": 45 },
    {"id": 0, "name": "Cordova", "r": 40 },
    {"id": 0, "name": "CSS", "r": 40 },
    {"id": 0, "name": "SVG", "r": 20 },
    {"id": 0, "name": "PHP", "r": 20 },
    {"id": 0, "name": "jQuery", "r": 30 },

    {"id": 1, "name": "denineguy", "r": 50 },
    {"id": 1, "name": "christinaleuci", "r": 32 },
    {"id": 1, "name": "Flex", "r": 50 },
    {"id": 1, "name": "AIR", "r": 40 },
    {"id": 1, "name": "Photoshop", "r": 30 },
    {"id": 1, "name": "Illustrator", "r": 30 },

    {"id": 2, "name": "Node Webkit", "r": 40 },
    {"id": 2, "name": "Chrome App", "r": 30 },
    {"id": 2, "name": "Cordova", "r": 45 },
  ];

  var width = window.innerWidth,
      height = 450;

  var fill = d3.scale.category10();

  var nodes = [], labels = [],
      foci = [{x: 0, y: 150}, {x: 350, y: 150}, {x: 200, y: 150}];

  var svg = d3.select("div.heart-chart").append("svg")
      .attr("width", "100%")
      .attr("height", height)
      //.attr("domflag", '');

  var force = d3.layout.force()
      .nodes(nodes)
      .links([])
      .charge(-400)
      //.chargeDistance(200)
      .gravity(0.1)
      .friction(0.8)
      .size([width, height])
      .on("tick", tick);

  //var node = svg.selectAll("circle");
  var node = svg.selectAll("g");

  var counter = 0;

  function tick(e) {
    debugger;
    var k = .1 * e.alpha;

    // Push nodes toward their designated focus.
    nodes.forEach(function(o, i) {
      o.y += (foci[o.id].y - o.y) * k;
      o.x += (foci[o.id].x - o.x) * k;
    });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  }


  var timer = setInterval(function(){
    debugger;

    if (nodes.length > data.length-1) { clearInterval(timer); return;}

    var item = data[counter];
    nodes.push({id: item.id, r: item.r, name: item.name});
    force.start();

    node = node.data(nodes);

    var n = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style('cursor', 'pointer')
        .on('mousedown', function() {
           var sel = d3.select(this);
           sel.moveToFront();
        })
        .call(force.drag);

    n.append("circle")
        .attr("r",  function(d) { return d.r; })
        .style("fill", function(d) { return fill(d.id); })

    n.append("text")
        .text(function(d){
            return d.name;
        })
        .style("font-size", function(d) {
            return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 16) + "px"; 
         })
        .attr("dy", ".35em")

    counter++;
  }, 100);


  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

  function resize() {
    width = window.innerWidth;
    force.size([width, height]);
    force.start();
  }

  d3.select(window).on('resize', resize);
  tick(e);


});