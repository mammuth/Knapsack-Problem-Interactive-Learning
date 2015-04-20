
function getKnapsackResult(items, prev, maxWeight){
	var K = new Array(maxWeight);

	// Init array with zeros
	$.each(K, function(i, e){
		K[i] = 0
	})

	for (w = 1; w <= maxWeight; w++) {
		var maxVal = 0; // (current) maximal value you geta with capacity w

		// Loop over all avaiable items
		$.each(items, function(x, e){ 
			var wi = e.Weight; // get weight and value of the current item e
			var vi = e.Value;
			
			if (wi <= w) {
				val = K[w - wi] + vi // nehme das 
				if (val > maxVal) {
					maxVal = val;

					prev[w] = e;
					console.log("added "+e.Id);
				}
			}
			
		})
		K[w] = maxVal;  // we save this element e, that maximizes K[w-wi]+vi for the current weight w
		console.log(K);
	}

	return K[maxWeight] // return the last element of the array → thanks to DP this is the maximal value
}

function getSelectedItems(n, prev){
	if (n == 0)
		return new Array();

	var results = getSelectedItems((n - prev[n].Weight), prev);
	results.push(prev[n])
	return results;
}
