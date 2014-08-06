var BEVERAGES = [
 {"name":"Msea","value":1},
 {"name":"ChavaLovesFyedka","value":1},
 {"name":"emmaife","value":1},
 {"name":"SML4EVA","value":1},
 {"name":"wontaeyang","value":1},
 {"name":"corbinpage","value":1},
 {"name":"eugmill","value":1},
 {"name":"pat-whitrock","value":1},
 {"name":"TSiege","value":1},
 {"name":"lipenco","value":1},
 {"name":"ErikPeterson","value":1},
 {"name":"NegaMorgan","value":1},
 {"name":"brian1987","value":1},
 {"name":"MProuts","value":1},
 {"name":"chriskohlbrenner","value":1},
 {"name":"FifthSurprise","value":1},
 {"name":"cheeseandpepper","value":1},
 {"name":"bokwon","value":1},
 {"name":"kamoh","value":108},
 {"name":"elowing","value":115},
 {"name":"natalieparellano","value":124},
 {"name":"wlowry88","value":117},
 {"name":"vanessadean","value":116},
 {"name":"lizzerdrix","value":94},
 {"name":"dsully360","value":108},
 {"name":"mmlkrx","value":85},
 {"name":"amyrjohnson","value":88},
 {"name":"ablwr","value":112},
 {"name":"mrmitchboyer","value":102},
 {"name":"ldemarest","value":62},
 {"name":"ilanasufrin","value":82},
 {"name":"zacksheppard","value":93},
 {"name":"KorenLeslieCohen","value":101},
 {"name":"JessRudder","value":106},
 {"name":"ambertunnell","value":124},
 {"name":"jusjmkim","value":121},
 {"name":"callahanchris","value":116},
 {"name":"jbarrieault","value":117},
 {"name":"pcrglennon","value":115},
 {"name":"randallreedjr","value":101},
 {"name":"ccmeyers","value":109},
 {"name":"rebeccagreenblatt","value":93},
 {"name":"Ewarren7","value":78},
 {"name":"simonseroussi","value":77},
 {"name":"juliataitz","value":112},
 {"name":"kriscroes","value":64},
 {"name":"biancatompkins","value":59},
 {"name":"cassidypignatello","value":70},
 {"name":"analuperez","value":82},
 {"name":"ChristinaLeuci","value":53},
 {"name":"denineguy","value":105},
 {"name":"SpencerTang","value":63},
 {"name":"aviflombaum","value":1},
 {"name":"kylefdoherty","value":88},
 {"name":"adriennefishman","value":85},
 {"name":"loganhasson","value":6},
 {"name":"bshore01","value":83},
 {"name":"timothywtan","value":48},
 {"name":"bajh","value":109},
 {"name":"davidcoronado","value":48},
 {"name":"jackiemorgan","value":6}
];

////////// v code goes below   v  /////////////////////////////////////////////

var svg = d3.select('.bubble-chart')
  .append('svg')
  .attr('width', 800)
  .attr('height', 800);

var bubble = d3.layout.pack()
    .sort(null)
    .size([800, 800])
    .padding(1.5);

var color = d3.scale.category20b();

function animate(data) {

  var treeLikeData = {"children": data};

  var bubbleData = bubble.nodes(treeLikeData)
    .filter(function(d) { return !d.children; });

  var node = svg.selectAll('.node')
    .data(bubbleData, function(d) { return d.name; });

  var enter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')'; });
  enter.append('circle')
    .style('fill', function(d) { return color(d.name); })
    .attr('r' , 0);
  enter.append('text')
    .style('opacity', 1)
    .style('fill', 'black')
    .style('text-anchor', 'middle')
    .text(function(d) { return d.name; });

  var update = node.transition()
    .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')'; });
  update.select('circle')
      .attr('r' , function(d) { return d.r; });
  update.select('text')
      .style('opacity', 1);

  var exit = node.exit()
    .transition()
      .remove();
  exit.select('circle').attr('r', 0);
  exit.select('text').style('opacity', 0);
  
}

animate(BEVERAGES);

animate(BEVERAGES);
////////// ^ code goes above  ^  /////////////////////////////////////////////

setTimeout(function() {
  BEVERAGES[0].value = 90;            // changes value of tea to 100
  animate(BEVERAGES);
}, 1000);

setTimeout(function() {
  BEVERAGES[4].value = 3;            // changes value of coffe to 3
  animate(BEVERAGES);
}, 1500);

setTimeout(function() {
  BEVERAGES.pop();                 // removes wine
  animate(BEVERAGES);
}, 2000);

setTimeout(function() {
  BEVERAGES.push({name: "kombucha", value: 50});     // adds kombucha in
  animate(BEVERAGES);
}, 2500);

setTimeout(function() {
  BEVERAGES.push({name: "wine", value: 60});    // adds wine back
  animate(BEVERAGES);
}, 3000);

setTimeout(function() {
  BEVERAGES[3].value = 40;             // changes value of gatorade to 50
  animate(BEVERAGES);
}, 3500);

setTimeout(function() {
  BEVERAGES[4].value = 10;             // coffee is now 10
  animate(BEVERAGES);
}, 3750);

setTimeout(function() {
  BEVERAGES.push({name: "mountain dew", value: 100});    // adds wine back
  animate(BEVERAGES);
}, 3000);

setTimeout(function() {
  BEVERAGES[0].value = 15;             // tea is now 15
  animate(BEVERAGES);
}, 4000);