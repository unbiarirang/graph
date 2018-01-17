function randomGraph(nodeNumber, linkChance) {
	var newGraphObj = {nodes: [], links: []};
	var x=0;
	while (x < nodeNumber) {
		var randomLat = Math.random();
		var randomLong = Math.random();
		var newNodeObj = {label: "Node"+x, id: x, lat: randomLat, long: randomLong}
		newGraphObj.nodes.push(newNodeObj);
		var y=0;
		while (y < nodeNumber) {
		if (y != x && Math.random() < linkChance) {
			var randomEdgeWeight = Math.random();
			newLinkObj = {source: x, target: y, weight: randomEdgeWeight, cost: randomEdgeWeight}
			newGraphObj.links.push(newLinkObj);
		}
		y++;
		}
		x++;
	}

    return newGraphObj;
}


function dijkstra()

function pathfinding(sourceID, targetID, directedSearch, searchType) {
    var GraphObj = randomGraph(10, 0.2)
    console.log(GraphObj);

    var road_to = {};
    for (link in links) {
        
    }
}

pathfinding(1,1,1,1);