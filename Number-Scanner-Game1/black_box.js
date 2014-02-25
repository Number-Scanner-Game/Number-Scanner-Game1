//////////////////
///black_box.js///
//////////////////

/* current status:
	* trial0 initializes with single target
	* moveables stay in frame, and stick to sandbox
	* scanners properly SCAN and display hits based on scanner attr
		(need to run diagnostics to check)
	* scanners only rudimentially indicate size (half ellipse gray shadow)

	need:
	* position reset
	* STAMP
	* sounds
	* tactile button
	* data consistency

	when drawing:
	* assign data to the first element of a set, i.e. set[0].data('i', i)
	* moveables might have to be a single, un-nested, set of paths (not rect, circle),
		with no transformations  (transformPath and set new path instead).
*/

window.onload = function() {
  // create paper and make drawing functions
  	var R = Raphael(0, 0, '100%', '100%');
	h = 640 //window.innerHeight 	//480
	w = 1024 //window.innerWidth	//800
	line = 0.75*h; //line height
	length = 0.66*w

	var style = {
		fill: "#444",
		stroke: "#fff",
		"stroke-width": 3,
		"stroke-linejoin": "round"
	};


	function makeSandbox () {
		/* /////////////////////
		  //// makeSandbox ////
		 /////////////////////
		 \ sandbox at height 'line' and width 'length'/
	      \ fills with sand at trial start 			 /
	       \ (can include object drop animation)   */
		 
        R.setStart();
        var outer = R.rect(0.5 * (w - length - 50), line - 25, length + 50, 150).attr({
	        	fill: '#093',
                stroke: '#050',
                'stroke-width': 3
 	       }),
            inner = R.rect(0.5 * (w - length), line, length, 100).attr({
	        	fill: '#083',
                stroke: '#050',
                'stroke-width': 3
  	      }),
            bottom = inner.clone().transform('s0.9,0.5').attr({
            //R.rect(0.5 * (w - length + 60), line + 20, length - 60, 60).attr({
	        	fill: '#083',
                stroke: '#050',
                'stroke-width': 3
    	    }),
    	    lines = R.path([
    	    	['M', inner.getBBox().x, inner.getBBox().y],
    	    	['L', bottom.getBBox().x, bottom.getBBox().y],
    	    	['M', inner.getBBox().x2, inner.getBBox().y],
    	    	['L', bottom.getBBox().x2, bottom.getBBox().y],
    	    	['M', inner.getBBox().x, inner.getBBox().y2],
    	    	['L', bottom.getBBox().x, bottom.getBBox().y2],
    	    	['M', inner.getBBox().x2, inner.getBBox().y2],
    	    	['L', bottom.getBBox().x2, bottom.getBBox().y2]	]).attr({
    	    		stroke: '#050',
    	    		'stroke-width': 3
    	    	});
            sand = bottom.clone().attr({
	            fill: '#FF9',
	            stroke: '#CC9',
	          	'stroke-width': 1,
	          	opacity: 1
   		    }).animate({
   		    	transform: 's0.992,0.94',
   		    }, 500,'<'),
   		    cover = sand.clone().attr({
   		    	transform: 's0.5,0'
   		    });
			sandbox = R.setFinish();
			sandbox[0].data = {
				which: 'sandbox'
			};
		return (sandbox);
	};

	/**
	 * Makes a single ufo with the given size (due to scaling with the Element.transform 
	 * method) and the given number of stars opaque out of 5 (the rest are just outlined). 
	 * ***THE SCALING CURRENTLY DOES NOT WORK---THE INDIVIDUAL PATHS SCALE, BUT NOT TOGETHER
	 * The scanning light of the ufo is currently 
	 * The ufo body is made up of many different paths and colors, so the singular ufo
	 * is returned at the end of the method as a set that can be called all together. 
	 * <p>
	 * @param 	x 		the initial x-position of the ufo
	 * 			y 		the initial y-position of the ufo
	 * 			size 	the horizontal proportion of the ufo to a normal size
	 * 			stars 	the number of stars (representing efficacy) 
	 * @returns 	the set of paths that make up one ufo
	 * 
	 * 
	 **/
	var makeUfo = function (x, y, size, stars) {
    	var opac = 1; //to allow easy change of opacity to represent scanner reliability as in the original adult version
    	var r = size*length*0.5;
    	R.setStart();
    	//holder for data; indicates scanner width
    	var ray = R.path([				//[0]
    		['M', x+100-r, y+100],
    		['h', 2*r],
    		['l', -r, -150],
    		['z']]).attr({
	    		fill: '#666',
    			opacity: 0.3
    		}), 
    		/*
    		lig=R.path("M" + x + "," + y + " l200,0 l0,100 l-200,0z").attr({
  		      	fill: "#555",
        		opacity: 0.0 		//to be changed when the scan button is pressed
    		}), // make this splay to size of scanner; some outline that fills when scanned perhaps
    		*/
        	bottom = R.path(		//[1]
	        	"M" + (x + 60) + "," + (y + 18) + " c20,30 60,30 80,0 c-20,2 -60,2 -80,0 ").attr({
	        	fill: "#e0f4f6",
	            "stroke-width": 3,
	        	stroke: "#ceebee",
	        	opacity: opac
    		});
	    bottom.attr({path: Raphael.transformPath(bottom.attr('path'), 's0.7,0.7t0,-5')});
    	var	topBody = R.path(		//[2]
        		"M" + x + "," + y + " c30,-100 170,-100 200,0 c0,25 -200,25 -200,0").attr({
        		fill: "#2ac7d6",
            	"stroke-width": 3,
        		stroke: "#24b7c5",
        		opacity: opac
    		}),
        	/*  //dome is now a button!
        	dome = R.path(		
	        	"M" + (x + 60) + "," + (y - 60) + " c20,-55 60,-55 80,0 c-20,-10 -60,-10 -80 0").attr({
	        	fill: "#093", //"#e0f4f6",
	            "stroke-width": 3,
	        	stroke: "#060", //#ceebee",
	        	opacity: 0.2
	    	}),	*/
        	num = 25, //to move location of each star to the right
        	fillColor = "#e1c222"; //to make empty stars (out of 5) for reliabilities
        for (i = 0; i < 5; i += 1) {		//[3]-[7]
        	R.path("M" + (x + num) + "," + (y - 20) + " l10,0 l5,-10 l5,10 l10,0 l-10,6 l7,11 l-12,-7 l-12,7 l7,-11z").attr({
            	fill: fillColor,
            	stroke: "#d6a719",
            	opacity: opac
        	});
        	if (i==stars-1)
        	{
            	fillColor="#e0f4f6";
        	}
        	num += 30;
    	}	
    	var button = R.path(			//[8]
	        	"M" + (x + 60) + "," + (y - 66) + " c10,-40 70,-40 80,0 c-20,8 -60,8 -80 0").attr({
	        	fill: "#093", //"#e0f4f6",
	            "stroke-width": 3,
	        	stroke: "#050", //#ceebee",
	        	opacity: 0.0
	    	});	
	    button.attr({path: Raphael.transformPath(button.attr('path'), 's0.01,0.01')});
    	var ufo = R.setFinish();
    	//ufo.transform("s"+String(size)); //need to fix scaling
    	var ufoConditions=[size, stars];
    	var box = ufo.getBBox();
    	ufo[0].data({
			which: 'ship',
			online: 0,
			reset: 0,
			snapped: 0,
			x: box.x,		//starting x-coordinate, top left
			y: box.y,		//starting y-coordinate, top left
    		size: size,
    		length: size*length,
    		eff: stars2eff(stars),
    		//beta: 1-stars2eff(stars) //see task.js
    	});    	
    	return ufo;
	};

	/**
	 *	Makes scanners in the shape of ufos with the given conditions for length
	 *  and number of stars (efficacy). Also lets scanners be dragged around 
	 *  screen. 
	 *  <p>
	 *  @para 		conditions for lengths and number of stars of scanners
	 *  @returns	the set of scanners
	 **/
	var makeScanners = function (conditions) {
		var randomSizes = conditions[0];
		var randomStars = conditions[1];
		conds = new Array();		//global
		for (var i = 0; i < 4; i++) {
        	var num1 = parseInt(Math.random() * (4-i)); //as array length decreases
        	var num2 = parseInt(Math.random() * (4-i));
        	var siz = randomSizes[num1];
        	var star = randomStars[num2];
        	conds.push([siz, star]);
       		randomSizes.splice(num1,1);    //at index num1, remove 1 item
        	randomStars.splice(num2,1);
    		}

    	starts = [					//global
    			[0.15*w, 0.2*h],
    			[0.15*w, 0.5*h],
    			[0.65*w, 0.2*h],
    			[0.65*w, 0.5*h]];

		var ship0 = makeUfo(starts[0][0], starts[0][1], conds[0][0], conds[0][1]),
			ship1 = makeUfo(starts[1][0], starts[1][1], conds[1][0], conds[1][1]),
			ship2 = makeUfo(starts[2][0], starts[2][1], conds[2][0], conds[2][1]),
			ship3 = makeUfo(starts[3][0], starts[3][1], conds[3][0], conds[3][1]);

		var scanners=R.set(ship0, ship1, ship2, ship3);

		scanners.forEach(function (scanner) {
			scanner.drag(onSetMove(scanner), onSetStart(scanner), onSetStop(scanner))
			scanner.dblclick(function () {
				// some debugging help
    			console.log(scanner.getBBox());
    			console.log('online: '+scanner[0].data('online')+' snapped: '+scanner[0].data('snapped')+'');
    		});

    		scanner[8].click(function () {
				//////// SCAN FUNCTION ////////////////////////
			   // would like to place outside makeScanners, //
			  // but it might be using internal variables  //
			 ///////////////////////////////////////////////
    			scanner[8].animate({		//responsive button grow
    				path: Raphael.transformPath(scanner[8].attr('path'), 's0.9,0.9')
    				}, 40, function () {
    					scanner[8].animate({
							path: Raphael.transformPath(scanner[8].attr('path'), 's1.11,1.11')
    					}, 40);
    				});
    			scanner[1].animate({		// flash bulb
    				fill:'#e1c222', 
    				stroke: '#d6a719'
    			}, 100, 'bounce', function () {
    				scanner[1].animate({
    					fill: '#e0f4f6', 
    					stroke: '#ceebee'
    				}, 900, 'bounce')
    			});
    			
    			SCAN(scanner); 
    			//// RESET for all scanners ////
    			scanners.forEach(function (scnr) {
    				RESET(scnr);
    			});
    			RESET(claw);
    		});
		});
		return scanners;
	};

	function RESET (guy) {
		// guy should be a set
		if (!(guy[0].data('reset'))) {
			var box = guy.getBBox();
		    var time = 500; 	//time to return to position
		    var delay = 1500;	//time to display result

			if (guy[0].data('which') == 'ship') {
				time = 500 / guy[0].data('eff');
			    	//this speed logic doesn't work because the speed depends on the distance the ship has to travel. could maybe get this from box.x - data('x') and some trig.

			    if (guy[0].data('button') == 1) {		// reset button
			   		var shrink = Raphael.animation({
				    	opacity: 0.0,
						path: Raphael.transformPath(guy[8].attr('path'), 's0.01,0.01')
						},200,'bounce');
			    	guy[0].data('button', 0);
			    	guy[8].animate(shrink.delay(delay - 1000));
				};
			};
    
			// reset each element in the guy set to original positions
			for (var i = 0; i < guy.length; i++) {
				// apply to each path element of the set:
			    var next = Raphael.pathToRelative(guy[i].attr('path'));
			    var Xoffset = next[0][1] - box.x;
			    next[0][1] = guy[0].data('x') + Xoffset;
			    var Yoffset = next[0][2] - box.y;
			    next[0][2] = guy[0].data('y') + Yoffset;

			    var reset = Raphael.animation({path: next}, time);
			    guy[i].animate(reset.delay(1000));
			}
		    guy[0].data('reset', 1);
		    guy[0].data('snapped', 0);
		    guy[0].data('online', 0);
		};
	};

	function SCAN (scanner) {
		//alert(scanner[0].data('online'));
		if (scanner[0].data('online')) {
			var x = scanner.getBBox().x,
				x2 = scanner.getBBox().x2,
				cx = (x2 - x)/2 + x,
				r = scanner.data('length') * 0.5,
				hit = number2position(target) >= x && number2position(target) <= x2,
				displayhit = (Math.random() < scanner[0].data('eff')) ? hit : !hit,
				
				stamp = [['M', cx - r, line],
					['h', 200],
					['v', 100],
					['h', 200],
					['z']];


			//alert('x:'+scannerx+' x2:'+scannerx2);
			console.log('hit: '+hit+' // displayhit: '+displayhit+' // eff: '+ scanner[0].data('eff')+'');
			if (displayhit) {
				scanner[0].animate({
					opacity:1,
					fill: '#06F' //"#2418df"
				},500,'<', function () {
					this.animate({
						opacity:0.2, 
						fill: '#555'
					},500,'<');
					R.path(stamp.toString()).attr({
						opacity: 1,
						stroke: '#03C',
						fill: '#06F'
					}).animate({
						opacity: 0.3
					}, 500, '>');
					scanner.toFront();
				});

			}
			else {
				scanner[0].animate({
					opacity:1,
					fill: '#F30'
				},500,'<', function () {
					this.animate({
						opacity:0.2, 
						fill: '#555'
					},500,'<');
					R.path(stamp.toString()).attr({		//not working currently
						opacity: 0,
						stroke: '#C30',
						fill: '#F30'
					}).animate({
						opacity: 0.3
					}, 500, '>');
					scanner.toFront();
				});
			};


			var scandata = {
				"trial": trial,		// check
				//"scan": end.output[trial].scans[0].scan + 1,		//number the scans?, maybe just use array position
				"target": target,
				"eff": scanner[0].data('eff'),
				"length": scanner[0].data('length'),
				"cx": Math.floor(position2number(cx)),
				"hit": hit,
				"displayhit": displayhit
			};
			end.output[trial].scans.push(scandata);
			console.log(scandata);

			return;
		}
		else {
			//fault?
			return;
		};
	};

	function makeClaw (x, y) {
		var carry = R.path('M' + x + ',' + y + 'm-70,0a70,70,0,1,0,140,0a70,70,0,1,0,-140,0z')
			.attr({
		//R.circle(x, 1.5 * y, 70).attr({
            	fill: '#000',
            	opacity: 0.0
        	}).toFront(),
	    	arm = R.path('M' + x + ',' + y + 'l30,60l-30,60l5,0l40,-60,l-30,-60').attr({
	            fill: '#999',
	            stroke: '#555',
	                'stroke-width': 3
	            }),
	        arm2 = R.path('M' + x + ',' + y + 'l-30,60l30,60l-5,0l-40,-60,l30,-60').attr({
	                fill: '#999',
	                stroke: '#555',
	                'stroke-width': 3
	            }),
	        ring = R.path('M' + x + ',' + y + 'm-15,0 a15,15,0,1,0,30,0a15,15,0,1,0,-30,0z')
	        	.attr({
	        //R.circle(x, y, 15).attr({
	                fill: '#093',
	                stroke: '#050',
	                'stroke-width': 3
	            }),
	        rring = R.path('M' + x + ',' + y + 'm-5,0 a5,5,0,1,0,10,0a5,5,0,1,0,-10,0z')
	        	.attr({
	        //R.circle(x, y, 5).attr({
	                fill: '#999',
	                stroke: '#555',
	                'stroke-width': 2
	            }),
	        //pull = R.path('M' + (x - 15) + ',' + y + 'l0,-' + 2*h + 'm30,0l0,' + 2*h + 'z').attr({fill: '#111', stroke: '#333',  'stroke-width': 2}),
	        claw = R.set(carry, arm, arm2, ring, rring),
	        box = claw.getBBox();
	    claw.data({
				which: 'claw',
				online: 0,
				reset: 1,		// to original position
				snapped: 0,		// to height of 'line'
				x: box.x,		//starting x-coordinate, top left
				y: box.y,		//starting y-coordinate, top left
				button: 0,		// to appear when 'snapped'
				guess: 0,
				hit: 0,
				fault: 0
			});
		claw.dblclick(function () {
				console.log(claw.getBBox());
				console.log('online: '+claw[0].data('online')+' snapped: '+claw[0].data('snapped')+'');
				//alert(claw[0].data('online'));
				GUESS(claw);
		});
		claw.drag(onSetMove(claw), onSetStart(claw), onSetStop(claw));
	    return (claw);
	};

	function GUESS (claw) {
		// if (claw[0].data('button') { or 'snapped'
		if (claw[0].data('online')) {
			var clawx = claw.getBBox().x,
				clawx2 = claw.getBBox().x2,
				guess = (clawx2 - clawx) * 0.5,
				hit = number2position(target) >= clawx && number2position(target) <= clawx2;
			claw[0].data('guess', (clawx2 - clawx) * 0.5);
			claw[0].data('hit', hit);
			console.log('hit: ' + hit);

			claw.animate({
				transform: 't0,50'
			},500, 'backIn', function () {
				claw.animate({
					transform: 't0,-'+(line+100)+''
				},1000, '>', function () {
					alert('splashscreen: ' + hit +'');
				})
			});
		}
		else {console.log('hit: ' + hit);};
		initializeTrial(conditions);
		return ;
	};

	function initializeTrial (conditions) {
		// all global variables;
		trial = trial + 1;  //move this to end trial
		sandbox = makeSandbox();
		scanners = makeScanners(conditions);
		claw = makeClaw(0.5*w, 0.3*h);
		target = setTarget(1);
		end.output.push({
			"trial": trial,
			"conditions": conditions,
			"target": target,
			"guess": null,
			//time: time,
			"scans": [],		//scandata = end.output[trial].[scans][scan#]
			"correct": null
		});
		return;
	};

	function initializeSession (userID) {
		end = {"user": userID, "output":[]};
		trial = -1;		//cludge
		target = null;
		return;
	}

	//draw things!
	var frame = R.rect(0,0,w,h).attr({
		'stroke-width':2
	});

	initializeSession('testID');
	//alert(end.user);
	conditions=[[0.0625, 0.125, 0.25, 0.5], [1,2,3,4]]; //sizes, stars
	initializeTrial(conditions);
	sandbox.dblclick(function () {
		alert(end.output[0].target);
	});
	sandbox[5].toFront();
};

////////////////////////
/// helper functions ///
////////////////////////

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
	var target = Math.floor(Math.random() * 100 + 1);
	// number from 1 to 100
	// not doing anything with range yet;
	// could use fewer than 100 numbers
	return target;
}

function stars2eff (stars) {
	var eff = 0.375 + 0.125 * stars;
	return eff;
}

// useful moves:
var appear = Raphael.animation({opacity:1.0}, 1);
var disappear = Raphael.animation({opacity:0.0}, 1);
var online = 0;
var unsnap = 0;
/*
var grow = Raphael.animation({		
			opacity: 1.0,
			path: Raphael.transformPath(this.attr('path'), 's100,100')
		},200,'bounce');
var shrink = Raphael.animation({
			opacity: 0.0,
			path: Raphael.transformPath(this.attr('path'), 's0.01,0.01')
		},200,'backIn');
*/