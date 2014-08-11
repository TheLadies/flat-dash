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
      .style('stroke', '#26282c')
      .style('stroke-width', '2px')
      .attr('r' , 10);
    enter.append('text')
      // .style('opacity', 1)
      // .style('fill', 'black')
      // .style('text-anchor', 'middle')
      .text(function(d) { return d.name; });


    node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'; 
      });

    node.select('circle')
        .attr('r' , function(d) { return d.r; });
    node.select('text')
        // .style('opacity', 1)
        .style("font-size", function(d) { return Math.min(d.r, (d.r - 8) / this.getComputedTextLength() * 28) + "px"; });
      
    for(var i = 0; i < $(".node").size(); i++) {
      if ($(".node circle")[i].r.animVal.value < 8) {
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

    var TEAM_MEMBERS;
    $.ajax({
      url: URL,
      type: "GET",
      dataType: "json"
    }).done(function(data){
      TEAM_MEMBERS = data;
      setTimeout(function() {
        animate(TEAM_MEMBERS);
      }, 500);

      var anim1_id = Math.floor(Math.random() * TEAM_MEMBERS.length);
      var anim2_id = Math.floor(Math.random() * TEAM_MEMBERS.length);
      var anim3_id = Math.floor(Math.random() * TEAM_MEMBERS.length);
      var anim4_id = Math.floor(Math.random() * TEAM_MEMBERS.length);
      var anim5_id = Math.floor(Math.random() * TEAM_MEMBERS.length);
      var anim6_id = Math.floor(Math.random() * TEAM_MEMBERS.length);


        setTimeout(function() {
          TEAM_MEMBERS[anim1_id].value = Math.floor((Math.random() * 50));            
          animate(TEAM_MEMBERS);
        }, 1000);

        setTimeout(function() {
          TEAM_MEMBERS[anim2_id].value = Math.floor((Math.random() * 50));           
          animate(TEAM_MEMBERS);
        }, 1500);

        var new_e1 = (TEAM_MEMBERS.push({name: "flatironschool", value: 50}) - 1);
        
        setTimeout(function() {
          animate(TEAM_MEMBERS);
        }, 2500);

        setTimeout(function() {
          TEAM_MEMBERS.pop();             
          animate(TEAM_MEMBERS);
        }, 5000);

        var new_e2 = (TEAM_MEMBERS.push({name: "We <3 Ruby", value: 100}) - 1);
       
        setTimeout(function() {
          animate(TEAM_MEMBERS);
        }, 3000);

        setTimeout(function() {
          TEAM_MEMBERS[anim3_id].value = Math.floor((Math.random() * 50));             
          animate(TEAM_MEMBERS);
        }, 3500);

        setTimeout(function() {
          TEAM_MEMBERS[anim4_id].value = Math.floor((Math.random() * 10));          
          animate(TEAM_MEMBERS);
        }, 3750);

        var new_e3 = (TEAM_MEMBERS.push({name: "RidingRails", value: 30}) - 1);

        setTimeout(function() {
          animate(TEAM_MEMBERS);
        }, 3000);

        setTimeout(function() {
          TEAM_MEMBERS[anim1_id].value = Math.floor((Math.random() * 50));           
          animate(TEAM_MEMBERS);
        }, 4000);

        setTimeout(function() {
          TEAM_MEMBERS.pop();                 
          animate(TEAM_MEMBERS);
        }, 5000);

        setTimeout(function() {
          animate(TEAM_MEMBERS);
        }, 3000);

        setTimeout(function() {
          animate(TEAM_MEMBERS);
        }, 3000);
      });

    }, 200);
});
