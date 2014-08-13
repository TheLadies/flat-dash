$(function(){

  if ($(".heart-div").length > 0) {

    $.ajax({
      url: "/list_of_users",
      type: "GET",
      dataType: "json"
    }).done(function(TEAM_MEMBERS){
      data = TEAM_MEMBERS;
    });

    setTimeout(function() {
      force.tick(1);
    }, 3000);

    var width = window.innerWidth,
        height = 575;

    var fill = d3.scale.category20();

    var nodes = [], labels = [],
        foci = [{x: 600, y: 400}, {x: 900, y: 200}, {x: 600, y: 200}, {x: 900, y: 500}, {x: 100, y: 100}, {x: 500, y: 100}, {x: 1200, y: 500}];

    var svg = d3.select("div.heart-chart").append("svg")
        .attr("width", "100%")
        .attr("height", height)
        //.attr("domflag", '');

    var force = d3.layout.force()
        .nodes(nodes)
        .links([])
        .charge(-1000)
        //.chargeDistance(200)
        .gravity(0.1)
        .friction(0.8)
        .size([width, height])
        .on("tick", tick);


    //var node = svg.selectAll("circle");
    var node = svg.selectAll("g");

    var counter = 0;

    function tick(e) {
      var k = .1 * e.alpha;

      // Push nodes toward their designated focus.
      nodes.forEach(function(o, i) {
        o.y += (foci[o.id].y - o.y) * k;
        o.x += (foci[o.id].x - o.x) * k;
      });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    }


    var timer = setInterval(function(){

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
          .style("fill", function(d) { return fill(d.name); })

      n.append("text")
          .text(function(d){
              return d.name;
          })
          .style("font-size", function(d) { 
            return Math.min(d.r, (d.r - 8) / this.getComputedTextLength() * 28) + "px"; 
          })
          .attr("dy", ".35em")

      counter++;
    }, 100);


    var animate = setInterval(function(){
      force.start();
      force.tick();
      force.end();
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
  }
});