//black_box.js

// useful moves:
var appear = Raphael.animation({opacity:1.0}, 1);
var disappear = Raphael.animation({opacity:0.0}, 1);

window.onload = function() {
  // create paper and make drawing functions
  	var R = Raphael(0, 0, '100%', '100%');
	h = 480; //window.innerHeight
	w = 800; //window.innerWidth
	line = 360;

	var style = {
		fill: "#444",
		stroke: "#fff",
		"stroke-width": 3,
		"stroke-linejoin": "round"
	};

	var makeSandbox = function () {
		R.setStart();
		var sandbox1 = R.rect(0.1*w, line, 0.8*w, 100).attr(style),
		sandbox = R.setFinish();
		return (sandbox);
	};

	/*var makeScanners = function () {
		var ship1 = R.rect(0.15*w, 0.2*h, 0.2*w, 50).attr(style),
			ship2 = R.rect(0.15*w, 0.4*h, 0.2*w, 50).attr(style),
			ship3 = R.rect(0.65*w, 0.2*h, 0.2*w, 50).attr(style),
			ship4 = R.rect(0.65*w, 0.4*h, 0.2*w, 50).attr(style),
			butt1 = makeButton(ship1),
			butt2 = makeButton(ship2),
			butt3 = makeButton(ship3),
			butt4 = makeButton(ship4);

	//ship1.mouseover(function () {butt1.animate(appear)} );
			 ship2.onDragOver(function() {
				ship2.attr({fill: "blue"});

		var scnrs = R.set();
		scnrs.push(
			R.set(ship1, butt1),
			R.set(ship2, butt2),
			R.set(ship3, butt3),
			R.set(ship4, butt4));

		ship1.dblclick(function () {
			alert(this.attr('y'));
		});

		scnrs[1].dblclick(function () {
			alert(this.data('snap'));
		});
		scnrs.forEach(function(scnr) {
			scnr.drag(onSetMove(scnr), onSetStart(scnr), onSetStop(scnr))
			scnr[0].data({
				snap: 0,
				outside: 0,
				somethingelse: 0,
				scnr : 1 
			});
		});
		return (scnrs);
	};*/

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
    	R.setStart();
    	var opac = 1; //to allow easy change of opacity to represent scanner reliability as in the original adult version
    	var topBody = R.path(
        	"M" + x + "," + y + " c30,-100 170,-100 200,-2 c0,25 -200,25 -200,0").attr({
        	fill: "#2ac7d6",
            "stroke-width": 3,
        	stroke: "#24b7c5",
        	opacity: opac
    	}),
        	bottom = R.path(
        	"M" + (x + 60) + "," + (y + 18) + " c20,30 60,30 80,0 c-20,2 -60,2 -80,0 ").attr({
        	fill: "#e0f4f6",
            "stroke-width": 3,
        	stroke: "#ceebee",
        	opacity: opac
    	}),
        	dome = R.path(
        	"M" + (x + 60) + "," + (y - 60) + " c20,-55 60,-55 80,0 c-20,-10 -60,-10 -80 0").attr({
        	fill: "#e0f4f6",
            "stroke-width": 3,
        	stroke: "#ceebee",
        	opacity: opac
    	}),
        num = 25, //to move location of each star to the right
        fillColor = "#e1c222"; //to make empty stars (out of 5) for reliabilities
        for (i = 0; i < 5; i += 1) {
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
    	var lig=R.path("M" + x + "," + y + " l200,0 l0,100 l-200,0z").attr({
        	fill: "#2418df",
        	opacity: 0 		//to be changed when the scan button is pressed
    	});
    	var ufo = R.setFinish();
    	//ufo.transform("s"+String(size)); //need to fix scaling
    	var ufoConditions=[size, stars];
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
		var conds = new Array();
		for (var i = 0; i < 4; i++) {
        	var num1 = parseInt(Math.random() * (4-i)); //as array length decreases
        	var num2 = parseInt(Math.random() * (4-i));
        	var siz = randomSizes[num1];
        	var star = randomStars[num2];
        	conds.push([siz, star]);
       		randomSizes.splice(num1,1);    //at index num1, remove 1 item
        	randomStars.splice(num2,1);
    		}
		var ship0 = makeUfo(0.15*w, 0.2*h, conds[0][0], conds[0][1]),
			ship1 = makeUfo(0.15*w, 0.4*h, conds[1][0], conds[1][1]),
			ship2 = makeUfo(0.65*w, 0.2*h, conds[2][0], conds[2][1]),
			ship3 = makeUfo(0.65*w, 0.4*h, conds[3][0], conds[3][1]);

		var scanners=R.set(ship0, ship1, ship2, ship3);

		scanners.forEach(function(scanner) {
			scanner.drag(onSetMove(scanner), onSetStart(scanner), onSetStop(scanner))
			scanner[0].data({
				snap: 0,
				outside: 0,
				somethingelse: 0,
				scanner : 1 
			});
		});

		return scanners;
	};

	var makeButton = function (scanner) {
		var box = scanner.getBBox(),
		button = R.rect(box.x2-20, box.y-20, 20, 20).attr({
			fill: '#093',
			'stroke-width': 2,
			stroke: '#fff',
			opacity: 0.0
		});
		return (button);

	};

	var makeClaw = function (x, y) {
		var carry = R.path('M' + x + ',' + y + 'm-70,0a70,70,0,1,0,140,0a70,70,0,1,0,-140,0z')
			.attr({
		//R.circle(x, 1.5 * y, 70).attr({
            	fill: '#000',
            	opacity: 0.2
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
	                stroke: '#060',
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
	        claw = R.set(carry, arm, arm2, ring, rring);
	        /*claw.data({
				snap: 0,
				outside: 0,
				somethingelse: 0 
			});
			claw.dblclick(function () {
				alert('splash screen');
		});*/
	    return (claw);
	};

	//draw things!
	var frame = R.rect(0,0,800,480),
		sandbox = makeSandbox(),
		conditions=[[0.0625, 0.125, 0.25, 0.5], [1,2,3,4]]
	    scanners = makeScanners(conditions),
		claw = makeClaw(0.5*w, 0.1*h);
		claw.drag(onSetMove(claw), onSetStart(claw), onSetStop(claw));
};

// drag functions! please see drag.js //
//----------------------------------------------------------------------------
function onStart(x, y, event) {
	start(this, x, y, event);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function onMove(dx, dy, x, y, event) {
	move(this, dx, dy, x, y, event);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function onStop(event) {
	stop(this, event);
};

//----------------------------------------------------------------------------
function onSetStart(object) {
	return function(x, y, event) {    // store reference to the set in the closure (there is no way of referencing it from Elements)
		start(object, x, y, event);
	}
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function onSetMove(object) {
	return function(dx, dy, x, y, event) {    // store reference to the set in the closure (there is no way of referencing it from Elements)
		setNow = object;
		setBox = setNow.getBBox();		//used in other drag fxns
		// slow and sticky parameters
		//offleft = (setBox.x) < 0 ? 1 : 0;
		//offright = (setBox.x2) > w ? 1 : 0;
		//offtop = (setBox.y) < 0 ? 1 : 0;
		offbot = (setBox.y2 + dy) > line ? 1 :0;
		move(object, dx, dy, x, y, event);
		
	};
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function onSetStop(object) {
	return function(event) {    // store reference to the set in the closure (there is no way of referencing it from Elements)
		stop(object, event);
	}
};
