var data = [
  {"id": 0, "name": "ambertunnell", "r": 4}, {"id": 0, "name": "natalieparellano", "r": 42}, 
  {"id": 1, "name": "jusjmkim", "r": 28}, {"id": 2, "name": "jbarrieault", "r": 31}, 
  {"id": 2, "name": "wlowry88", "r": 20}, {"id": 1, "name": "callahanchris", "r": 1}, 
  {"id": 0, "name": "vanessadean", "r": 7}, {"id": 0, "name": "elowing", "r": 43}, 
  {"id": 0, "name": "pcrglennon", "r": 83}, {"id": 0, "name": "ablwr", "r": 72}, 
  {"id": 2, "name": "juliataitz", "r": 6}, {"id": 1, "name": "bajh", "r": 6}, 
  {"id": 0, "name": "ccmeyers", "r": 7}, {"id": 2, "name": "JessRudder", "r": 55}, 
  {"id": 1, "name": "dsully360", "r": 42}, {"id": 0, "name": "kamoh", "r": 77}, 
  {"id": 2, "name": "denineguy", "r": 10}, {"id": 0, "name": "mrmitchboyer", "r": 3}, 
  {"id": 2, "name": "KorenLeslieCohen", "r": 66}, {"id": 1, "name": "randallreedjr", "r": 85}, 
  {"id": 0, "name": "lizzerdrix", "r": 17}, {"id": 2, "name": "rebeccagreenblatt", "r": 100}, 
  {"id": 2, "name": "zacksheppard", "r": 68}, {"id": 0, "name": "amyrjohnson", "r": 66}, 
  {"id": 2, "name": "kylefdoherty", "r": 50}, {"id": 0, "name": "adriennefishman", "r": 51}, 
  {"id": 0, "name": "mmlkrx", "r": 65}, {"id": 0, "name": "bshore01", "r": 36}, 
  {"id": 0, "name": "analuperez", "r": 4}, {"id": 2, "name": "ilanasufrin", "r": 55}, 
  {"id": 2, "name": "Ewarren7", "r": 18}, {"id": 2, "name": "simonseroussi", "r": 27}, 
  {"id": 1, "name": "cassidypignatello", "r": 4}, {"id": 1, "name": "kriscroes", "r": 62}, 
  {"id": 1, "name": "SpencerTang", "r": 53}, {"id": 2, "name": "ldemarest", "r": 79}, 
  {"id": 1, "name": "biancatompkins", "r": 55}, {"id": 0, "name": "ChristinaLeuci", "r": 86}, 
  {"id": 1, "name": "davidcoronado", "r": 6}, {"id": 2, "name": "timothywtan", "r": 53}, 
  {"id": 2, "name": "jackiemorgan", "r": 22}, {"id": 1, "name": "loganhasson", "r": 100}, 
  {"id": 1, "name": "ChavaLovesFyedka", "r": 51}, {"id": 1, "name": "ErikPeterson", "r": 29}, 
  {"id": 1, "name": "FifthSurprise", "r": 92}, {"id": 1, "name": "MProuts", "r": 84}, 
  {"id": 1, "name": "Msea", "r": 13}, {"id": 0, "name": "NegaMorgan", "r": 27}, 
  {"id": 2, "name": "SML4EVA", "r": 81}, {"id": 0, "name": "TSiege", "r": 80}, 
  {"id": 2, "name": "aviflombaum", "r": 53}, {"id": 2, "name": "brian1987", "r": 24}, 
  {"id": 0, "name": "cheeseandpepper", "r": 39}, {"id": 1, "name": "chriskohlbrenner", "r": 42}, 
  {"id": 0, "name": "corbinpage", "r": 58}, {"id": 1, "name": "emmaife", "r": 82}, 
  {"id": 2, "name": "eugmill", "r": 47}, {"id": 1, "name": "lipenco", "r": 37}, 
  {"id": 2, "name": "pat-whitrock", "r": 27}, {"id": 0, "name": "wontaeyang", "r": 94},
];

$(function(){


  var width = window.innerWidth,
      height = 500;

  var fill = d3.scale.category20();

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



});