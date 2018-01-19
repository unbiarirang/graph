function randomGraph(nodeNumber, linkChance) {
	var newGraphObj = {nodes: [], links: []};
	var x = 0;
	while (x < nodeNumber) {
		var randomLat = Math.random();
		var randomLong = Math.random();
		var newNodeObj = {label: "Node"+x, id: x, lat: randomLat, long: randomLong}
		newGraphObj.nodes.push(newNodeObj);
        var randomEdgeWeight = Math.random();
        var y = x + 2;
        if (y >= nodeNumber) y = x;
        newLinkObj = {source: x, target: y, weight: randomEdgeWeight, cost: randomEdgeWeight}
        newGraphObj.links.push(newLinkObj);
		x++;
	}

    return newGraphObj;
}

const INF = 2100000000;
function dijkstra(point, road_to, link_list, total_node_num) {
    // initialization
    var start_vertex = point.start;
    var end_vertex = point.end;
    var d = [];             // the shortest distance to every node
    var previous = [];

    for (var i = 0; i < total_node_num; i++) {
        d.push(INF);
        previous.push("UNDEFINED");
    }
    console.log("d: " + d);

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
    console.log(Q, Q.length);
    while (Q.length && cur_vertex != end_vertex) {
        // find min distance
        console.log("d: " + d);
        var d_min = INF;
        for (var i = 0; i < Q.length; i++) {
            var vertex = Q[i];
            if (d[vertex] <= d_min) {
                d_min = d[vertex];
                cur_vertex = vertex;
            }
        }

        console.log("cur_vertex: " + cur_vertex);
        // add current node to S, erase current node from Q
        S.push(cur_vertex);
        Q.splice(Q.indexOf(cur_vertex), 1);
        console.log("S: " + S + "\n Q: " + Q);

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

    // no path
    if (d[end_vertex] == INF) {
        node_result.push("Path not found");
        edge_result.push("Path not found");
        return { nodes: node_result, paths: edge_result};
    }

    node_result.push(cur_vertex);
    while (true) {
        if (previous[cur_vertex] == "UNDEFINED") break;
        node_result.push(previous[cur_vertex]);
        edge_result.push(link_list[cur_vertex][previous[cur_vertex]]);
        cur_vertex = previous[cur_vertex];
    }
    node_result.push(start_vertex);
    edge_result.push(link_list[start_vertex][cur_vertex]);

    return { nodes: node_result, paths: edge_result};
}

function pathfinding2(sourceID, targetID, directedSearch, searchType) {
    var total_node_num = 10;
    var GraphObj = randomGraph(total_node_num, 0.2);
    var links = GraphObj.links;
    var nodes = GraphObj.nodes;
    console.log(GraphObj);

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
        var source = link.source;
        var target = link.target;
        var cost = link.cost;

        road_to[source][target] = cost;
        road_to[target][source] = cost;

        edge_list[source][target] = index;
        edge_list[target][source] = index;
    }

    
    console.log("road_to: " + road_to);
    console.log("edge_list: " + edge_list);
    var result_obj = dijkstra({start: 1, end: 9}, road_to, edge_list, total_node_num);
    console.log("node_result : ", result_obj.nodes);
    console.log("edge_result : ", result_obj.paths);
}

pathfinding(1,1,1,1);