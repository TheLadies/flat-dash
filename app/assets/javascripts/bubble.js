////////// v code goes below   v  /////////////////////////////////////////////

    
$(function(){

setTimeout(function() {

var svg = d3.select('.bubble-chart')
  .append('svg')
  .attr('width', 800)
  .attr('height', 800);

var bubble = d3.layout.pack()
    .sort(null)
    .size([630, 650])
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
      .attr('r' , 10);
    enter.append('text')
      .style('opacity', 1)
      .style('fill', 'black')
      .style('text-anchor', 'middle')
      .text(function(d) { return d.name; });


    node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'; 
      });

    node.select('circle')
        .attr('r' , function(d) { return d.r; });
    node.select('text')
        .style('opacity', 1);

    for(var i = 0; i < $(".node").size(); i++) {
      if ($(".node circle")[i].r.animVal.value < 10) {
        $($(".node text")[i]).hide()
      } else {
        $($(".node text")[i]).show()
      }
    }

    var exit = node.exit()
      .transition()
        .remove();
    exit.select('circle').attr('r', 0);
    exit.select('text').style('opacity', 0);
    
  }


    console.log("hello");
      var TEAM_MEMBERS;
    $.ajax({
      url: "/data/heart",
      type: "GET",
      dataType: "json"
    }).done(function(data){
      TEAM_MEMBERS = data;
      setTimeout(function() {
        animate(TEAM_MEMBERS);
      }, 500);
        setTimeout(function() {
          TEAM_MEMBERS[0].value = 90;            
          animate(TEAM_MEMBERS);
        }, 1000);

        setTimeout(function() {
          TEAM_MEMBERS[4].value = 3;           
          animate(TEAM_MEMBERS);
        }, 1500);

        setTimeout(function() {
          TEAM_MEMBERS.pop();             
          animate(TEAM_MEMBERS);
        }, 5000);

        setTimeout(function() {
          TEAM_MEMBERS.push({name: "kombucha", value: 50});     
          animate(TEAM_MEMBERS);
        }, 2500);

        setTimeout(function() {
          TEAM_MEMBERS.push({name: "wine", value: 60});   
          animate(TEAM_MEMBERS);
        }, 3000);

        setTimeout(function() {
          TEAM_MEMBERS[3].value = 40;             
          animate(TEAM_MEMBERS);
        }, 3500);

        setTimeout(function() {
          TEAM_MEMBERS[4].value = 10;          
          animate(TEAM_MEMBERS);
        }, 3750);

        setTimeout(function() {
          TEAM_MEMBERS.push({name: "mountain dew", value: 100});    
          animate(TEAM_MEMBERS);
        }, 3000);

        setTimeout(function() {
          TEAM_MEMBERS[0].value = 15;           
          animate(TEAM_MEMBERS);
        }, 4000);

        setTimeout(function() {
          TEAM_MEMBERS.pop();                 
          animate(TEAM_MEMBERS);
        }, 5000);
      });

  }, 200);
});


////////// ^ code goes above  ^  /////////////////////////////////////////////
