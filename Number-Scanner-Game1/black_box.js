//////////////////
///black_box.js///
//////////////////

/* current status:
	* trial0 initializes with single target
	* moveables stay in frame, and stick to sandbox
	* scanners properly SCAN and display hits based on scanner attr
	* scanners and claw all return to position after SCAN

	need:
	* STAMP
	* claw button
	* sounds?
	* data consistency

	when drawing:
	* assign data to the first element of a set, i.e. set[0].data('i', i)
	* moveables might have to be a single, un-nested, set of paths (not rect, circle),
		with no transformations  (transformPath and set new path instead).
*/

window.onload = function() {
  // create paper and make drawing functions
  	var R = Raphael(0, 0, '100%', '100%');
	h = window.innerHeight 	//480 //640
	w = window.innerWidth	//800 //1024
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
		 \ sandbox at height 'line' and width 'length'	  /
	      \ fills with sand at trial start 			 	 /
	       \ (future: include object drop animation)   */
		 
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
    		['M', x+100-r, y+60],
    		['h', 2*r],
    		['l', -r, -90],
    		['z']]).attr({
	    		fill: '#666',
    			opacity: 0.3
    		}), 

        	bottom = R.path(			//[1]
	        	"M" + (x + 60) + "," + (y + 18) + " c20,30 60,30 80,0 c-20,2 -60,2 -80,0 ").attr({
	        	fill: "#e0f4f6",
	            "stroke-width": 3,
	        	stroke: "#ceebee",
	        	opacity: opac
    		});
	    bottom.attr({path: Raphael.transformPath(bottom.attr('path'), 's0.7,0.7t0,-5')});
    	
    	var	topBody = R.path(			//[2]
        		"M" + x + "," + y + " c30,-100 170,-100 200,0 c0,25 -200,25 -200,0").attr({
        		fill: "#2ac7d6",
            	"stroke-width": 3,
        		stroke: "#24b7c5",
        		opacity: opac
    		}),

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
	        	opacity: 0.5
	    	});	
	    button.attr({
	    	path: Raphael.transformPath(button.attr('path'), 's0.01,0.01'),
	    	opacity: 0
	    });
    	var ufo = R.setFinish();

    	var ufoConditions=[size, stars];
    	var box = ufo.getBBox();

    	ufo[0].data({
			which: 'ship',
			reset: 1,
			snapped: 0,
			button: 0,
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
    			console.log(' snapped: '+scanner[0].data('snapped')+' button: '+scanner[0].data('button')+'');
    		});

    		// flash when moused over
			scanner[8].hover(function () {
				if (scanner[0].data('button')) {
					scanner[8].animate({
						fill: '#3C3'
					},40,'elastic', function () {
						scanner[8].animate({
							fill: '#093'
						},500, '<')
					});
				};
			});

			//////// SCAN FUNCTION ////////////////////////
		   //  button click --> scanning ray --> stamp 	//
		  //   button shrink --> reset all objects	   //
		 ///////////////////////////////////////////////
    		scanner[8].click(function () {
    			if (!scanner[0].data('button')) {
    				return;
    			}

    			else {
    				// button reaction
    				var oldpath = scanner[8].attr('path');
    				scanner[8].animate({
						fill: '#060', //'#050' outline
						path: Raphael.transformPath(oldpath, 's0.9,0.9')
					 }, 100, 'elastic', function () {
					 	scanner[8].animate({
					 		fill: '#093',
					 		path: oldpath
					 	}, 50, function () {

					 		// SCAN and RESET
					 		SCAN(scanner);
					 	});
					});

			 		// flash bulb
			 		scanner[1].animate({
	    				fill:'#e1c222', 
	    				stroke: '#d6a719'
	    			}, 100, 'bounce', function () {
	    				scanner[1].animate({
	    					fill: '#e0f4f6', 
	    					stroke: '#ceebee'
	    				}, 500, 'bounce');
					});
    			};
    		});
		});
		return scanners;
	};

	function resetALL () {
		scanners.forEach(function (scnr) {
			if (scnr[0].data('button')) {
				scnr[0].data('button', 0);	// reset button
    			var oldpath = scnr[8].attr('path');
    			scnr[8].animate({
					path: Raphael.transformPath(oldpath, 's0.01,0.01'),
					opacity: 0
				 }, 200, 'bounce', function () {
			 		RESET(scnr);		// return to position
				 });
    		}
    		else {
				RESET(scnr);
			};
			RESET(claw);
		});
		return;
	}

	function RESET (object) {
		// object is set of paths
		if (!(object[0].data('reset'))) {
			var box = object.getBBox();
		    var time = 500; 	//time to return to position
		    var delay = 1500;	//time to display result

			//time = 500 / guy[0].data('eff');
		    	//this speed logic doesn't work because the speed depends on the distance the ship has to travel. could maybe get this from box.x - data('x') and some trig.

			// reset each element in the object to original positions
			for (var i = 0; i < object.length; i++) {
			    var next = Raphael.pathToRelative(object[i].attr('path'));
			    var Xoffset = next[0][1] - box.x;
			    next[0][1] = object[0].data('x') + Xoffset;
			    var Yoffset = next[0][2] - box.y;
			    next[0][2] = object[0].data('y') + Yoffset;

			    var reset = Raphael.animation({path: next}, time);
			    object[i].animate(reset.delay(1000));
			}
		    object[0].data('reset', 1);
		    object[0].data('snapped', 0);
		    //object[0].data('nogrow', 1);
		};
		return ;
	};

	function SCAN (scanner) {
		if (scanner[0].data('snapped') && scanner[0].data('button')) {
			var x = scanner.getBBox().x,
				x2 = scanner.getBBox().x2,
				cx = (x2 - x)/2 + x,
				r = scanner.data('length') * 0.5,
				hit = (number2position(target) >= x) && (number2position(target) <= x2),
				displayhit = (Math.random() < scanner[0].data('eff')) ? hit : !hit,
				//stamp not currently working
				stamp = [['M', cx - r, line],
					['h', 2*r],
					['v', 100],
					['h', -2*r],
					['z']];

			console.log('hit: '+hit+' displayhit: '+displayhit+' eff: '+ scanner[0].data('eff')+'');
			if (displayhit) {
				scanner[0].animate({
					opacity:1,
					fill: '#06F' //"#2418df"
				},500,'<', function () {
					this.animate({
						opacity:0.2, 
						fill: '#555'
					},500,'<');
					R.path(stamp).attr({		//stamp blue
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
					R.path(stamp).attr({		//stamp red
						opacity: 0,
						stroke: '#C30',
						fill: '#F30'
					}).animate({
						opacity: 0.3
					}, 500, '>');
					scanner.toFront();
				});
			};

			resetALL();
			//// RESET for all objects ////


			//// push data to [scans] ////
			var scandata = {
				"trial": trial,		
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
				console.log('snapped: '+claw[0].data('snapped')+' button: '+claw[0].data('button'));
				GUESS(claw);
		});
		claw.drag(onSetMove(claw), onSetStart(claw), onSetStop(claw));
	    return (claw);
	};

	function GUESS (claw) {
		// need claw button
		if (claw[0].data('snapped')) {
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
		else {console.log('not online')};
		//splash screen, erase everything, then:
		//trial = trial + 1;
		//initializeTrial(conditions);
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