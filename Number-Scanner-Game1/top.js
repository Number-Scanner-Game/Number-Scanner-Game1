//Only loads to top.html, and contains the global variables top_index and bottom_index, that are used to keep track of the
//state of the tutorial. Also loads the first tutorial element in the top frame.

var top_index=1;
var bottom_index=1;

var conditions = null;

var userID = null;
var cond = null;
var trial = 0;
var data = [];

var correct = 0;
var current_trial = 0;
var total_trials = 6;

var familiarization_order = shuffle([0,1,2,3]);

var found_target = null;
var certainty = null; //rewrite this on every go.

var output = null;

parent.topframe.document.getElementById("tutorial").innerHTML=instructions[top_index];
parent.bottomframe.location = "index.html"; //to bypass instructions1.html

//"instructions"+parent.topframe.bottom_index.toString()+".html";
