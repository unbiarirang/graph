var currentSizing = "nothing";
var currentEdge = "fixed";
var sourceNode = "";
var width = 500,
    height = 600;
var fill = d3.scale.category20();

// set the initial state
randomGraph(15, 0.075);
updateText("initialpage");

function updateText(lessonType) {
	switch(lessonType) {        
		case "initialpage":
		d3.select("#text").html("<h2>Please choose a feature</h2>");
		break;
		case "pathfinding":
		d3.select("#text").html("<h2>Shortest Path</h2><p>Finding the shortest path between two nodes in a network.<br>We used Dijkstra's algorithm to accomplish pathfiding.</p>");
		break;
		case "centrality":
		d3.select("#text").html("<h2>Centrality</h2><br><h3>1. Closeness</h3><p>The average shortest path cost to all the nodes in the network.</p><input type='button' onclick='sizeByStats(\"Closeness\")' value='Closeness'/><br><br><h3>2. Betweenness</h3><p>The number of times a node is crossed for every shortest path in the network.</p><input type='button' onclick='sizeByStats(\"Betweenness\")' value='Betweenness Centrality' />");
		break;
		case "forcealgo":
		d3.select("#text").html("<h2>Force-Directed Layout</h2><p>A popular method for laying out networks is to assign repulsive and attractive forces to nodes and links so that the emergent behavior of the competing forces produces a network that is more legible than manually or hierarchically placing the nodes. These competing forces are typcially a repulsive force exerted by nodes (which can be based on a numerical attribute of the node or a fixed value), an attractive force exerted by shared links between nodes (which can be based on the strength of the length, typically known as \"weight\" or fixed) and a canvas gravity that draws nodes toward the center of the screen and prevents them from being pushed beyond the view of the user.</p><p>Force-directed layouts do not typically assign any value to a node being placed along the x- or y-axis beyond the confluence of forces acting upon it from nearby nodes and links. As a result, even a very stable and readable force-directed layout can be mirrored or rotated without otherwise changing. This has had the effect upon scholars of assuming that there was something wrong with a force-directed layout that placed a node on the 'top' or 'left' in one layout but on the 'bottom' or 'right' in another. Such behavior is part of the force-directed layout unless specifically designed otherwise.</p>");
        break;
        case "connectedcomponent":
        d3.select("#text").html("<form>Gravity <input id=\"gravitySlider\" type=\"range\" onchange=\"updateForce(); changeGravity()\" min =\"0\" max=\"1\" step =\".01\"  value=\".1\" /><input type=\"text\" id=\"gravityInput\" value=\".1\" /></form>");
        break;
        case "spanningtree":
        d3.select("#text").html("");
        break;
	}
}

function initializeGraph(newGraph) {
	newNodes = [];
	newLinks = [];
	//We need a hash to fit the link structure of D3's force-directed layout
	nodeHash = {};
	for ( x = 0; x < newGraph.nodes.length; x++ ) {
		newNodes.push(newGraph.nodes[x]);
		nodeHash[String(newGraph.nodes[x].id)] = x;
	}
	for ( x = 0; x < newGraph.links.length; x++ )
		newLinks.push({id: x, source: newGraph.nodes[nodeHash[newGraph.links[x].source]], target: newGraph.nodes[nodeHash[newGraph.links[x].target]], "cost": newGraph.links[x].cost, "weight": newGraph.links[x].invcost });

	force = d3.layout.force()
		.size([width, height])
		.nodes(newNodes) // initialize with a single node
		.links(newLinks)
		.linkDistance(60)
		.charge(-60)
		.on("tick", tick);
	var svg = d3.select("#graph").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("id", "networkViz");
	svg.append("rect")
		.attr("width", width)
		.attr("height", height)
		.attr("id","backgroundRect")
		.on("mousemove", mousemove);
	nodes = force.nodes();
	links = force.links();
	node = svg.selectAll(".node");
	link = svg.selectAll(".link");
	arrowhead = svg.selectAll(".link");
	cursor = svg.append("circle")
		.attr("transform", "translate(-100,-100)")
		.attr("class", "cursor")
		.attr("r", 1)
		.style("opacity", 0);
	restart();
}

function mousemove() {
  	cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
}

function mousedown() {
  var point = d3.mouse(this),
      node = {id: nodes.length, label: "Node" + nodes.length, lat: .5, long: .25, weight: 1, x: point[0], y: point[1]},
      n = nodes.push(node);
  // add links to any nearby nodes
	nodes.forEach(function(target) {
		var x = target.x - node.x,
			y = target.y - node.y;
		if (Math.sqrt(x * x + y * y) < 30)
			links.push({id: links.length, source: node, target: target, cost: .5});
	});
	restart();
}

function tick() {
  	link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });
	node.attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")"}) 
    arrowhead.attr("cx", function(d) {return ((d.target.x * .9) + (d.source.x * .1))}).attr("cy", function(d) {return ((d.target.y * .9) + (d.source.y * .1))})
}

function changeGravity() {
    d3.select("#lefttext").html("Canvas gravity draws all nodes toward the center of the canvas, preventing them from flying out of view.");
}

function highlightNodes() {
	d3.selectAll("circle.node").transition().duration(300).style("stroke-width", 5);
	d3.selectAll("circle.node").transition().delay(300).duration(300).style("stroke-width", 0);
	if (document.getElementById('nodeCheckbox').checked == true) {
		document.getElementById("repulsionSlider").disabled=true;
		d3.select("#lefttext").html("Nodes exert a repulsion on other nodes based on their degree centrality.");
	}
	else {
		document.getElementById("repulsionSlider").disabled=false;
		d3.select("#lefttext").html("Nodes exert a fixed value of repulsion set with the slider.");
	}
}

function highlightEdges() {
	d3.selectAll("line.link").transition().duration(300).style("stroke", "black");
	d3.selectAll("line.link").transition().delay(300).duration(300).style("stroke", "#999999")
	if (document.getElementById('edgeCheckbox').checked == true) {
		document.getElementById("attractionSlider").disabled=true;
		d3.select("#lefttext").html("Nodes attract connected nodes based on the strength of the shared link.");
	}
	else {
		document.getElementById("attractionSlider").disabled=false;
		d3.select("#lefttext").html("Nodes attract connected nodes based on the fixed value set on the slider.");
	}
}

function restart() {
	link = link.data(links);
	arrowhead = arrowhead.data(links);
	node = node.data(nodes);
  	nodeg = node.enter().insert("g", ".cursor")
		.attr("class", "node")
		.call(force.drag);
		nodeg.append("circle")
		.attr("r", 1)
		.attr("class", "node")
		.style("stroke-width", 0)
		.style("stroke", "#808080");
	nodeg.append("text")
		.attr("x", -5)
		.attr("y", -5)
		.attr("class", "node")
		.text(function(d) {return d.label})
		.style("display", "none");
      
  	node.exit().transition().duration(300).attr("r",1).remove();
  	link.enter().insert("line", ".node")
    	.attr("class", "link");
      
	link.exit().remove();
  
  	arrowhead.enter().insert("circle", ".node")
		.attr("class", "arrowhead")
		.attr("r",2)
		.style("opacity", function() {return 0;});
    
    arrowhead.exit().remove();
  	force.start();
	//Apparently you have to delay the resizing to keep D3 from holding the elements that are supposed to be .removed()  
	resize(currentSizing);
}

function getBetweenness() {
	updateText("Betweenness");
}

function updateForce() {
	force.stop();
	
	var newGravity = document.getElementById('gravitySlider').value;
	document.getElementById('gravityInput').value = newGravity;
	
	force.gravity(newGravity);
	force.start();
}
// d3.json("data.json",function(graph){
//     newGraphObj = {nodes: [], links: []};	
//     d3.select("#networkViz").remove();
//     initializeGraph(graph);
// });

function randomGraph(nodeNumber, linkChance) {
	newGraphObj = {nodes: [], links: []};
	var x=0;
	while (x < nodeNumber) {
		var randomLat = Math.random();
		var randomLong = Math.random();
		var newNodeObj = {label: "Node"+x, id: x, lat: randomLat, long: randomLong}
		newGraphObj.nodes.push(newNodeObj);
		var y=0;
		while (y < nodeNumber) {
			if (y != x && Math.random() < linkChance) {
                var randomEdgeWeight = Math.floor(Math.random() * 10) + 1;
				newLinkObj = {source: x, target: y, weight: randomEdgeWeight, cost: randomEdgeWeight}
				newGraphObj.links.push(newLinkObj);
			}
			y++;
		}
		x++;
	}
	
	d3.select("#networkViz").remove();
	initializeGraph(newGraphObj);
}


function resize(byValue) {
  currentSizing = byValue;
  var minSize = d3.min(nodes, function(d) {return parseFloat(d["weight"])});
  var maxSize = d3.max(nodes, function(d) {return parseFloat(d["weight"])});
  var minWeight = d3.min(links, function(d) {return parseFloat(d["cost"])});
  var maxWeight = d3.max(links, function(d) {return parseFloat(d["cost"])});
  var sizingRamp = d3.scale.linear().domain([minSize,maxSize]).range([1,10]).clamp(true);
  var edgeRamp = d3.scale.linear().domain([maxWeight,minWeight]).range([.5,3]).clamp(true);
  
  switch(byValue)
  {
    case "nothing":
      d3.selectAll("circle.node").attr("r", 5)
      
      d3.selectAll("image.node").attr("x", -2.5)
      .attr("y", -2.5)
      .attr("width", 5)
      .attr("height", 5);
    break;
    case "degree":
      d3.selectAll("circle.node").attr("r", function(d) {return sizingRamp(d["weight"])})
      
      d3.selectAll("image.node").attr("x", function(d) { return -((sizingRamp(d["weight"]))/2)})
      .attr("y", function(d) { return -((sizingRamp(d["weight"]))/2)})
      .attr("width", function(d) { return (sizingRamp(d["weight"]))})
      .attr("height", function(d) { return (sizingRamp(d["weight"]))});
    break;
    }
    
    d3.selectAll("line.link").style("stroke-width", function(d) {return edgeRamp(d["cost"])})
}

const INF = 2100000000;
function dijkstra(point, road_to, link_list, total_node_num) {
    // initialization
    var start_vertex = point.start;
	var end_vertex = point.end;
	if (start_vertex == end_vertex) return { nodes: {}, paths: {}, total_cost: 0 };

    var d = [];             // the shortest distance to every node
    var previous = [];

    for (var i = 0; i < total_node_num; i++) {
        d.push(INF);
        previous.push("UNDEFINED");
    }

    var S = [];             // nodes already in shortest path
    var Q = [];             // nodes not in shortest path
    S.push(start_vertex);
    for (var i = 0; i < total_node_num; i++) {
        if (road_to[start_vertex][i])
            d[i] = road_to[start_vertex][i];
        if (i != start_vertex)
            Q.push(i);
    }
    d[start_vertex] = 0;

    // main algorithm
    var cur_vertex = start_vertex;
    while (Q.length && cur_vertex != end_vertex) {
        // find min distance
        var d_min = INF;
        for (var i = 0; i < Q.length; i++) {
            var vertex = Q[i];
            if (d[vertex] <= d_min) {
                d_min = d[vertex];
                cur_vertex = vertex;
            }
        }

        // add current node to S, erase current node from Q
        S.push(cur_vertex);
        Q.splice(Q.indexOf(cur_vertex), 1);

        // update distance
        for (var i = 0; i < Q.length; i++) {
            var vertex = Q[i];
            if (d[vertex] > d[cur_vertex] + road_to[cur_vertex][vertex]) {
                d[vertex] = d[cur_vertex] + road_to[cur_vertex][vertex];
                previous[vertex] = cur_vertex;
            }
        }
    }

    var node_result = [];
	var edge_result = [];
	var total_cost = 0;

    // no path
    if (d[end_vertex] == INF) {
		node_result[0] = [];
		edge_result[0] = [];
        node_result[0].push("Path not found");
        edge_result[0].push("Path not found");
        return { nodes: node_result, paths: edge_result, total_cost: INF};
    }

	node_result.push(cur_vertex);
    while (true) {
        if (previous[cur_vertex] == "UNDEFINED") break;
		node_result.push(previous[cur_vertex]);
		edge_result.push(link_list[cur_vertex][previous[cur_vertex]]);
		total_cost += links[link_list[cur_vertex][previous[cur_vertex]]].cost;
        cur_vertex = previous[cur_vertex];
    }
    node_result.push(start_vertex);
	edge_result.push(link_list[start_vertex][cur_vertex]);
	total_cost += links[link_list[start_vertex][cur_vertex]].cost;

    return { nodes: node_result, paths: edge_result, total_cost: total_cost };
}

// find the shortest path or centrality
function findPath(sourceID, targetID, centrality_flag) {
	var total_node_num = nodes.length;

    // init road_to and edge_list
    var road_to = new Array(nodes.length);        // distance between two nodes
    var edge_list = new Array(links.length);      // edge id between two nodes
    for (var i = 0; i < total_node_num; i++) {
        road_to[i] = new Array(total_node_num);
        edge_list[i] = new Array(links.length);

        for (var j = 0; j < total_node_num; j++)
            road_to[i][j] = INF;
        road_to[i][i] = 0;
    }

    for (var index in links) {
		var link = links[index];
        var source_id = link.source.id;
        var target_id = link.target.id;
        var cost = link.cost;

        road_to[source_id][target_id] = cost;
        road_to[target_id][source_id] = cost;

        edge_list[source_id][target_id] = link.id;
        edge_list[target_id][source_id] = link.id;
    }

	// get the shortest path between two nodes
	if (!centrality_flag)
		return dijkstra({start: sourceID, end: targetID}, road_to, edge_list, total_node_num);
	

	// get centrality (closeness and betweenness)
	var graphStats = {};
	for (var i in nodes) {
		graphStats[nodes[i].id] = {};
		graphStats[nodes[i].id]["Closeness"] = 0;
		graphStats[nodes[i].id]["Betweenness"] = 0;
		graphStats[nodes[i].id]["Total Connectivity"] = 0;
	}

	for (var i in nodes) {
		var sourceID = nodes[i].id;
		var connected_node_num = 0;
		var total_connected_distance = 0;

		// get all shortest path cost from source node
		for (var j in nodes) {
			var targetID = nodes[j].id;
			var result_obj = dijkstra({start: sourceID, end: targetID}, road_to, edge_list, total_node_num);

			// for closeness
			var cost = result_obj.total_cost;
			if (cost != INF) {
				connected_node_num++;
				total_connected_distance += cost;
			}

			// for betweenness
			var node_ids = result_obj.nodes;
			if (node_ids[0] != "Path not found") {
				for (var index in node_ids) {
					var node_id = node_ids[index]
					if (node_id == sourceID || node_id == targetID) continue;

					graphStats[node_id]["Betweenness"] += 1;
				}
			}
		}

		// calculate closeness
		graphStats[sourceID]["Total Connectivity"] = connected_node_num;
		if(connected_node_num == 0)
			graphStats[sourceID]["Closeness"] = 0;        
		else
			graphStats[sourceID]["Closeness"] = total_connected_distance / connected_node_num;
	}

	return graphStats;
}

function selectPath() {
    d3.selectAll("line.link").transition().duration(300).style("stroke","#999");
    d3.selectAll("circle.node").style("fill", "#FA8806");
    d3.selectAll("g.node").on("click" ,setSource).style("cursor", "pointer")
	d3.select("#lefttext").html("Select a node to compute a path from");
}
function selectNodeSpanningTree() {
    d3.selectAll("line.link").transition().duration(300).style("stroke","#999");
    d3.selectAll("circle.node").style("fill", "#FA8806");
    d3.selectAll("g.node").on("click", function(d) { sourceNode = d.id; getSpanningTree(); d3.selectAll("g.node").on("click", null).style("cursor","auto");}).style("cursor", "pointer");
    d3.select("#lefttext").html("Select a node to compute a minimum spanning tree");
}
function selectNodeConnectedComponent() {
    d3.selectAll("line.link").transition().duration(300).style("stroke","#999");
    d3.selectAll("circle.node").style("fill", "#FA8806");
    d3.selectAll("g.node").on("click", function(d) { sourceNode = d.id; getConnectedComponent(); d3.selectAll("g.node").on("click", null).style("cursor","auto");}).style("cursor", "pointer");
    d3.select("#lefttext").html("Select a node to compute a connected component");
}
function setSource(d) {
	sourceNode = d.id;
	d3.selectAll("g.node").on("click",setTarget);
	d3.select("#lefttext").html(d.id + "selected - select a node to compute the path to");
}
function setTarget(d) {
	var computedPathArray = findPath(sourceNode, d.id);

	if (computedPathArray.nodes[0] == "Path not found") {
		d3.select("#lefttext").html("No path");
		d3.selectAll("circle.node").transition().duration(300).style("fill", function(p) {return [d.id,sourceNode].indexOf(p.id) > -1 ? "brown" : "black"});
		d3.selectAll("line.link").transition().duration(300).style("stroke","black");
	}
	else {
		computedPathArray.paths.reverse();
		computedPathArray.nodes.reverse();
		d3.select("#lefttext").html("<span style='color:#FA8806;'>Path from " + sourceNode + " to " + d.id + ".<br>Total cost is " + computedPathArray.total_cost + ".<br>The path is " + computedPathArray.nodes + "</span>");
		d3.selectAll("circle.node").transition().delay(function(d) {return computedPathArray.nodes.indexOf("" + d.id) > -1 ? (computedPathArray.nodes.indexOf("" + d.id) * 500) + 500 : 0}).duration(300).style("fill", function(d) {return computedPathArray.nodes.indexOf(d.id) > -1 ? "brown" : "#FA8806"});
		d3.selectAll("line.link").transition().delay(function(d) {return computedPathArray.paths.indexOf(d.id) > -1 ? (computedPathArray.paths.indexOf(d.id) * 500) + 500 : 0}).duration(300).style("stroke", function(d) {return computedPathArray.paths.indexOf(d.id) > -1 ? "brown" : "#999"});
	}
	d3.selectAll("g.node").on("click", null).style("cursor","auto");
	sourceNode = "";
}

function sizeByStats(statname) {
	var minStat = 9999;
	var maxStat = 0;
    for (x in nodes) {
		if (graphStats[nodes[x].id]["Total Connectivity"] != 0) {
			minStat = Math.min(minStat, graphStats[nodes[x].id][statname]);
			maxStat = Math.max(maxStat, graphStats[nodes[x].id][statname]);
		}
    }
    
    d3.select("#lefttext").html("Nodes are now sized by " + statname);
	var sizeRamp = d3.scale.linear().domain([minStat,maxStat]).range([2,10]).clamp(true);
	d3.selectAll("circle.node").transition().duration(300).attr("r", function(d,i) {return graphStats[nodes[i].id][statname] > 0 ? sizeRamp(graphStats[nodes[i].id][statname]) : 1});
	d3.selectAll("image.node").transition().duration(300)
	.attr("height", function(d,i) {return graphStats[nodes[i].id]["Total Connectivity"] > 0 ? sizeRamp(graphStats[nodes[i].id][statname]) : 1})
	.attr("width", function(d,i) {return graphStats[nodes[i].id]["Total Connectivity"] > 0 ? sizeRamp(graphStats[nodes[i].id][statname]) : 1})
	.attr("x", function(d,i) {return graphStats[nodes[i].id]["Total Connectivity"] > 0 ? -(sizeRamp(graphStats[nodes[i].id][statname]) / 2) : -.5})
	.attr("y", function(d,i) {return graphStats[nodes[i].id]["Total Connectivity"] > 0 ? -(sizeRamp(graphStats[nodes[i].id][statname]) / 2) : -.5});
}

function calculateCentrality() {
	d3.select("#lefttext").html("Calculating paths...");
	graphStats = findPath(0, 0, true);
	sizeByStats("Closeness");   
}

function findMinEdge(V, E, road_to, edge_list, total_node_num, callback) {
    var connected_flag = false;
    var edge_min = INF;
    var edge;
    for (var i = 0; i < V.length; i++) {
        for (var j = 0; j < total_node_num; j++) {
            var start_node = V[i];
            var end_node = nodes[j].id;

            if (start_node == end_node) {
                if ((i == V.length - 1) && (j == total_node_num - 1)) {return callback(connected_flag, edge);}
                continue;  
            } 
            if (road_to[start_node][end_node] != INF) connected_flag = true;

            var match1 = V.find(function(node_id) { return node_id === start_node; });
            var match2 = V.find(function(node_id) { return node_id === end_node; });
            if (match1 !== undefined && match2 === undefined) { // start_node should exist in V and end_node should not
                if (road_to[start_node][end_node] < edge_min) {
                    edge_min = road_to[start_node][end_node];
                    edge = {start_node: start_node, end_node: end_node};
                    console.log("edge: ", edge);
                    if ((i == V.length - 1) && (j == total_node_num - 1)) {return callback(connected_flag, edge);}
                }
                else if ((i == V.length - 1) && (j == total_node_num - 1)) {return callback(connected_flag, edge);}
            }
            else if ((i == V.length - 1) && (j == total_node_num - 1)) {return callback(connected_flag, edge);}
        }
    }
}

function getSpanningTree() {
    var sourceID = sourceNode;
    var total_node_num = nodes.length;

    console.log("nodes: ", nodes);
    console.log("links: ", links);
    
    // init road_to and edge_list
    var road_to = new Array(nodes.length);        // distance between two nodes
    var edge_list = new Array(links.length);      // edge id between two nodes
    for (var i = 0; i < total_node_num; i++) {
        road_to[i] = new Array(total_node_num);
        edge_list[i] = new Array(links.length);

        for (var j = 0; j < total_node_num; j++)
            road_to[i][j] = INF;
        road_to[i][i] = 0;
    }

    for (var index in links) {
        var link = links[index];
        var source_id = link.source.id;
        var target_id = link.target.id;
        var cost = link.cost;

        road_to[source_id][target_id] = cost;
        road_to[target_id][source_id] = cost;

        edge_list[source_id][target_id] = link.id;
        edge_list[target_id][source_id] = link.id;
    }

    var V = [];
    var E = [];
    V.push(sourceID);
    var flag = false;
    while (true) {
        if (V.length >= total_node_num) break;
        if (flag) break;
        console.log("V.length: ", V.length);

        var edge_min = INF;
        for (var i = 0; i < V.length; i++) {
            for (var j = 0; j < total_node_num; j++) {
                var start_node = V[i];
                var end_node = nodes[j].id;
                if (road_to[start_node][end_node] < edge_min) edge_min = road_to[start_node][end_node];
            }
        }

        findMinEdge(V, E, road_to, edge_list, total_node_num, function (connected_flag, edge) {
            console.log("connected_flag, edge: ", connected_flag, edge);
            if (connected_flag === false) {
                console.log("이어져 있는 점이 없다. 지금은 이거 나오면 안됨");
                flag = true;
            }
            else {
                V.push(edge.end_node);
                E.push(edge_list[edge.start_node][edge.end_node]);
                console.log("V: ", V);
                console.log("E: ", E);
            }
        });
    }
    sourceNode = "";
    d3.selectAll("line.link").transition().delay(function(d) {return E.indexOf(d.id) > -1 ? (E.indexOf(d.id) * 500) + 500 : 0}).duration(300).style("stroke", function(d) {return E.indexOf(d.id) > -1 ? "brown" : "#999"});
}

function getComponent(start_node, road_to, res) {
    for (var i = 0; i < nodes.length; i++) {
        if (road_to[start_node][i] != INF) {
            if (res.find(function(id) {return id == i}) === undefined) {
                res.push(i);
                res = getComponent(i, road_to, res);
            }
        }
    }

    return res;
}

function getConnectedComponent() {
    var sourceID = sourceNode;
    var total_node_num = nodes.length;

    var road_to = new Array(nodes.length);        // distance between two nodes
    for (var i = 0; i < total_node_num; i++) {
        road_to[i] = new Array(total_node_num);

        for (var j = 0; j < total_node_num; j++)
            road_to[i][j] = INF;
        road_to[i][i] = 0;
    }

    for (var index in links) {
        var link = links[index];
        var source_id = link.source.id;
        var target_id = link.target.id;
        var cost = link.cost;

        road_to[source_id][target_id] = cost;
        road_to[target_id][source_id] = cost;
    }

    var components = {};
    var component_count = 0;
    var total_count = 0;

    var index = 0;
    while (true) {
        if (index == nodes.length) break;
        var connected_flag = false;
        for (var i = 0; i < component_count; i++) {
            if (components[i].find(function(id) {return id == index}) != undefined) {
                connected_flag = true;
                break;
            }
        }

        if (!connected_flag) {
            components[component_count] = getComponent(index, road_to, [index]);
            component_count++;
        }
        index++;
    }

    var randomColor = [];
    for (var i = 0; i < component_count; i++)
        randomColor.push(Math.floor(Math.random()*16777215).toString(16));  // generate random color

    d3.selectAll("circle.node").transition().delay(function(d) {return nodes.indexOf("" + d.id) > -1 ? (nodes.indexOf("" + d.id) * 500) + 500 : 0}).duration(300).style("fill", function(d) {
        var i;
        for (i = 0; i < component_count; i++) {
            if (components[i].find(function(id) {return id == d.id}) !== undefined) {
                break;
            }
        }
        return randomColor[i];
    });

    sourceNode = "";
}