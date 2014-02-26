
function number2position (num) {
	// 1:100 --> x-coordinate
	var pos = Math.floor(0.5*(w - length) + 0.01* num * length);
	return pos;
}

function position2number (pos) {
	// x-coordinate --> 1:100
	var num = (pos - 0.5 * (w - length)) * 100 / length;
	return num;
}

function setTarget (range) {
	var target = [];
	// will be array of targets over trials
	var center = Math.floor(Math.random() * 100); + 1
	// number from 1 to 100
	// not doing anything with range yet;
	// could use fewer than 100 numbers
	target.push(center)
	return target;
}

function stars2eff (stars) {
	var eff = 0.375 + 0.125 * stars;
	return eff
}

function scan (scanner) {
	// 
	//if (scanner.data())
}

/*
//// scan ////
* scan functionality of the scanner ships, upon clicking of ship button
* check if scan okay
* get x,x2 coordinates
* convert to numberline coordinates (1-100?)
* hit target: 1/0
* pull ship reliability
* random number logic etc
*  look at pedro's code?
* if scan hit
* 	green; else red
* STAMP - draw this
* animation: return scanners to start
*/

function guess (claw) {

}

/*
//// claw ////
* check if guess okay: 1,0
* pull position
* convert to numberline
* hit target: 1,0
* if guess hit
*	win screen
*	else try again screen
* NEW TRIAL (or end)
*

//// data ////
* trial # {1:6}
* 	target
*	condition: lengths, crossed, etc
*	numscans
*		(if >1, guess = 1)
* 	scan # {1: numscans}
*		posiion
*		target hit/miss (actual)
*		scan hit/miss (displayed)
*		time stamp
*		fault?
*	guess hit: 1,0
*	fault?
* finished
* fault?

data = {
	'user':0
}
[user
	id:
	[trial
		trial#:
		[scan
			x:
			x2:
			]
		]]

//// global ////
* guess okay: 1,0
* scan okay: 1,0
* target: #
* trial: 1:6
* 


how does parent work?

*/