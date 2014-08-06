var BEVERAGES = [
  {"name":"tea","value":74},
  {"name":"whiskey","value":5},
  {"name":"beer","value":54},
  {"name":"gatorade","value":3},
  {"name":"coffee","value":86},
  {"name":"fanta","value":6},
  {"name":"apple juice","value":59},
  {"name":"bourbon","value":1},
  {"name":"coke","value":82},
  {"name":"lemonade","value":18},
  {"name":"hot chocolate","value":16},
  {"name":"rage","value":61},
  {"name":"water","value":38},
  {"name":"apple","value":74},
  {"name":"banana","value":5},
  {"name":"pear","value":54},
  {"name":"tree","value":3},
  {"name":"monkey","value":86},
  {"name":"grape","value":6},
  {"name":"peach juice","value":59},
  {"name":"tires","value":1},
  {"name":"pepsi","value":82},
  {"name":"candy","value":18},
  {"name":"hot milk","value":16},
  {"name":"sadness","value":61},
  {"name":"trampolines","value":38},
  {"name":"green","value":74},
  {"name":"brown","value":5},
  {"name":"bloopers","value":54},
  {"name":"energy","value":3},
  {"name":"fury","value":86},
  {"name":"red","value":6},
  {"name":"cup juice","value":59},
  {"name":"candle","value":1},
  {"name":"peas","value":82},
  {"name":"lemons","value":18},
  {"name":"carrot chocolate","value":16},
  {"name":"tead","value":61},
  {"name":"asdf","value":38},
  {"name":"rteunrtu","value":74},
  {"name":"peace","value":5},
  {"name":"sdfg","value":54},
  {"name":"paodfk","value":3},
  {"name":"wlkefval","value":86},
  {"name":"asd.vm","value":6},
  {"name":"asdlkjb juice","value":59},
  {"name":"as,dmvadkjhc","value":1},
  {"name":"asdoiw","value":82},
  {"name":"alald","value":18},
  {"name":"hot peanuts","value":16},
  {"name":"temper","value":61},
  {"name":"tears","value":38}
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