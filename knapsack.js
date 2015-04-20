var items = {
	item1: {
		Id: "milk",
		Weight: 6,
		Value: 30,
		DefaultCopies: 12
	},
	item2: {
		Id: "map",
		Weight: 3,
		Value: 14,
		DefaultCopies: 5
	},
	item3: {
		Id: "tv",
		Weight: 4,
		Value: 16,
		DefaultCopies: 5
	},
	item4: {
		Id: "sandwich",
		Weight: 2,
		Value: 9,
		DefaultCopies: 6
	},
	item5: {
		Id: "minion",
		Weight: 5,
		Value: 24,
		DefaultCopies: 11
	}
}

window.onload = generateElements();

// This function generates a couple of copies of each item
function generateElements(){
	var holder = document.getElementById('elementHolder');

	$.each(items, function(x, e){ 
		for (var i = 0; i < e.DefaultCopies; i++){
			holder.innerHTML += "<img id="+e.Id+i+"\" src=\"images/"+e.Id+".jpg\" draggable=\"true\" ondragstart=\"drag(event,"+e.Weight+","+e.Value+")\" height=\"75\">";
		}
		holder.innerHTML += "<h5>Weight: "+e.Weight+", Value: "+e.Value+" ("+e.Id+")</h5>";
	});	

	console.log('Items generated');
}



function allowDrop(ev) {
	ev.preventDefault();
}
function drag(ev, weight, value) {
	ev.dataTransfer.setData("id", ev.target.id);
	ev.dataTransfer.setData("weight", weight);
	ev.dataTransfer.setData("value", value);
}
function drop(ev) {
	ev.preventDefault();

	var weight = ev.dataTransfer.getData("weight");
	var value = ev.dataTransfer.getData("value");
	var weightCounter = document.getElementById("weightCounter");
	var valueCounter = document.getElementById("valueCounter");
	var maxWeight = parseInt(document.getElementById("maxWeight").value);

	console.log(maxWeight);

	var newWeight = parseInt(weightCounter.innerHTML)+parseInt(weight);
	if (newWeight <= maxWeight){
		ev.target.appendChild(document.getElementById(ev.dataTransfer.getData("id")));
		weightCounter.innerHTML = newWeight;
		valueCounter.innerHTML = parseInt(valueCounter.innerHTML)+parseInt(value);
	} else {
		// Backpack is full
		alert("Backpack is full with value = "+valueCounter.innerHTML);
	}
}


// Algorithm-Gaudi

// Algorithm to solve unbound Knapsack, using DynamicProgramming
function getKnapsackResult(items, prev, maxWeight){
	var K = new Array(maxWeight);

	// Init array with zeros
	$.each(K, function(i, e){
		K[i] = 0
	})

	for (w = 1; w <= maxWeight; w++) {
		var maxVal = 0; // (current) maximal value you get with capacity w

		// Loop over all avaiable items
		$.each(items, function(x, e){ 
			var wi = e.Weight; // get weight and value of the current item e
			var vi = e.Value;
			
			if (wi <= w) {
				val = K[w - wi] + vi // nehme das 
				if (val > maxVal) {
					maxVal = val;

					prev[w] = e;
				}
			}
		})
		K[w] = maxVal;  // we save this element e, that maximizes K[w-wi]+vi for the current weight w
		console.log(K);
	}
	return K[maxWeight] // return the last element of the array → thanks to DP this is the maximal value
}

function solveKnapsack() {
	// This function collects the values the user entered, then calls the algorithm in the knapsack.js file and presents the result on this page

	var items = {
		item1: {
			Id: "milk",
			Weight: 6,
			Value: 30
		},
		item2: {
			Id: "map",
			Weight: 3,
			Value: 14
		},
		item3: {
			Id: "tv",
			Weight: 4,
			Value: 16
		},
		item4: {
			Id: "sandwich",
			Weight: 2,
			Value: 9
		},
		item5: {
			Id: "minion",
			Weight: 5,
			Value: 24
		}
	}


	var prev = {};
	var maxWeight = parseInt(document.getElementById("maxWeight").value);
	var knapsackResult = getKnapsackResult(items, prev, maxWeight);
	var selectedItems = getSelectedItems(maxWeight, prev);

	console.log('Max Value = ' + knapsackResult + ' by packing:');
	$.each(selectedItems, function(i, e){
		console.log(e.Id);
	});

	// Pack items in backpack
	var backpack = document.getElementById("backpack");
	backpack.innerHTML = "";
	$.each(selectedItems, function(i, e){
		backpack.innerHTML += "<img id="+e.Id+i+"\" src=\"images/"+e.Id+".jpg\" height=\"75\">";
	});

	// Set weight and value counter
	document.getElementById("valueCounter").innerHTML = knapsackResult;
	document.getElementById("weightCounter").innerHTML = "";
}

function getSelectedItems(n, prev){
	if (n == 0)
		return new Array();

	var results = getSelectedItems((n - prev[n].Weight), prev);
	results.push(prev[n])
	return results;
}
