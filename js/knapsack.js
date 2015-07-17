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
function generateElements() {
  var holder = document.getElementById('elementHolder');

  $.each(items, function(x, e) {
    for (var i = 0; i < e.DefaultCopies; i++) {
      holder.innerHTML += "<img id=" + e.Id + i + "\" src=\"images/" + e.Id + ".jpg\" draggable=\"true\" ondragstart=\"drag(event," + e.Weight + "," + e.Value + ")\" height=\"75\">";
    }
    holder.innerHTML += "<h5>Weight: " + e.Weight + ", Value: " + e.Value + " (" + e.Id + ")</h5>";
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

  var newWeight = parseInt(weightCounter.innerHTML) + parseInt(weight);
  if (newWeight <= maxWeight) {
    ev.target.appendChild(document.getElementById(ev.dataTransfer.getData("id")));
    weightCounter.innerHTML = newWeight;
    valueCounter.innerHTML = parseInt(valueCounter.innerHTML) + parseInt(value);
  } else {
    // Backpack is full, send alert
    swal({
      title: "Oops!",
      text: "Backpack is full with value = " + valueCounter.innerHTML,
      type: "error",
			confirmButtonText: "Try again!"
    }, function() {
      window.location.reload();
    });

  }
}


/*
 * Algorithm-Gaudi
 */


// This function collects the values the user entered, then calls the algorithm in the knapsack.js file and presents the result on this page
/* Idea:
Consider trying to build a knapsack of size W. The question to answer is, should item i be included in the knapsack or not.
Including item i should make a knapsack of higher value than all previous knapsacks of size W.
But, if the knapsack is already at size W, including item i will make the knapsack too large. So, the solution has to examine a knapsack of size W-wi.
Specifically, consider a knapsack of size W-wi that does not include item i. To decide if the item should be included in the knapsack, compare the values of the knapsack of size W that does not include the current item; and the value of a knapsack of size W-wi + the value of item i.
If the worth of the knapsack is increased by taking including the item, that item i will be included in the knapsack, and its overall value will be increased. (web.cs.ship.edu/~tbriggs)
*/
function solveKnapsack() {
  var prev = {};
  var maxWeight = parseInt(document.getElementById("maxWeight").value);
  var knapsackResult = getKnapsackMaxVal(items, prev, maxWeight);
  var selectedItems = getSelectedItems(maxWeight, prev);

  console.log('Max Value = ' + knapsackResult + ' by packing:');
  $.each(selectedItems, function(i, e) {
    console.log(e.Id);
  });

  // Pack items in backpack
  var backpack = document.getElementById("backpack");
  backpack.innerHTML = "";
  $.each(selectedItems, function(i, e) {
    backpack.innerHTML += "<img id=" + e.Id + i + "\" src=\"images/" + e.Id + ".jpg\" height=\"75\">";
  });

  // Set weight and value counter
  document.getElementById("valueCounter").innerHTML = knapsackResult;
  document.getElementById("weightCounter").innerHTML = "";
}

// Algorithm to solve unbound Knapsack, using DynamicProgramming
function getKnapsackMaxVal(items, prev, maxWeight) {
  var K = new Array(maxWeight);

  // Init array with zeros
  $.each(K, function(i, e) {
    K[i] = 0
  })

  // Build LookupTable(/Array)
  for (w = 1; w <= maxWeight; w++) {
    var maxVal = 0; // (current) maximal value you get with capacity w

    // Loop over all avaiable items
    $.each(items, function(x, e) {
      var wi = e.Weight; // get weight and value of the current element e
      var vi = e.Value;

      if (wi <= w) {
        val = K[w - wi] + vi // the next (maybe maximal) value is the maxVal of the weight before the item + the value of the item itself
        if (val > maxVal) {
          maxVal = val;

          prev[w] = e; // Save element e, which maximizes K[w-wi]+v
        }
      }
    })
    K[w] = maxVal; // we save this element e, that maximizes K[w-wi]+vi for the current weight w
    console.log(K);
    console.log(prev);
  }
  return K[maxWeight] // return the last element of the array → thanks to DP this is the maximal value
}


function getSelectedItems(n, prev) {
  if (n == 0)
    return new Array();

  var results = getSelectedItems((n - prev[n].Weight), prev);
  results.push(prev[n])
  return results;
}
