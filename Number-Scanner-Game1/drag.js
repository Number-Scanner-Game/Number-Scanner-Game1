//----------------------------------------------------------------------------
// drag.js //
// only works consistently for untransformed paths.
// if transformations needed, use:
// object.attr({path: Raphael.transformPath(object.attr('path'), 'transformation string')}) 

function setObjectXY(object, x, y) {
	switch(object.type) {
		case 'circle': {
			object.x = (x - object.attr('cx'));
			object.y = (y - object.attr('cy'));
			//console.log('circle.x='+object.x);
		}
		break;
		case 'path': {
			object.x = (x - object.getBBox().x);
			object.y = (y - object.getBBox().y);
			//console.log('path.x='+object.x);
		}
		break;
		default: {
			object.x = (x - object.attr('x'));
			object.y = (y - object.attr('y'));
			//console.log('rect.x='+object.x);
		}
	}
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function updateObjectAttr(object, x, y) {
			dx = (x - object.getBBox().x) - object.x;
			dy = (y - object.getBBox().y) - object.y;

			if (setBox.x + dx < 0) {lx = 0;}
			else if (setBox.x2 + dx  > w) {lx = 0;}
			else {lx = dx;}

			switch(setNow[0].data('which')) {
				case 'ship': {
					if (setBox.y + dy < 0) {	// limit at ceiling
						ly = 0;
						setNow[0].data('snapped', 0)}
					else if (setBox.y2 + dy > line - 60) {
						if (!object.data('snapped')) {	// snap to box
						    setNow[0].data('snapped', 1);
						    var next = Raphael.pathToRelative(object.attr('path'));
						    var offset = next[0][2] - setBox.y;
						    next[0][2] = line - setBox.height + offset;
						    object.attr({'path' : next});
						};		
						ly = 0;
					}
					else {ly = dy;
						setNow.data('snapped', 0)}
				}
				break;

				case 'claw': {
					if (setBox.y + dy < 0) {ly = 0;
						setNow[0].data('snapped', 0)}
					else if (setBox.y2 + dy > line) {
					    if (!object.data('snapped')) {
					    	var next = Raphael.pathToRelative(object.attr('path'));
					    	next[0][2] = line - 60;
					    	object.attr({'path' : next});
					    	setNow[0].data('snapped', 1);
					    };
					    ly = 0;
					}

					else {ly = dy;
						setNow.data('snapped', 0)};
				}
				break;
				default: {
					if (setBox.y + dy < 0) {ly = 0;}
					else if (setBox.y2 + dy > h) {ly = 0;}
					else {ly = dy;}
				};
			};

			object.attr({
				path: Raphael.transformPath(object.attr('path'), '...T' + lx + ',' + ly)});
};

//---------------------------------------------------------------------------
function start(object, x, y, event) {
	object.toFront();
	switch(object.type) {
		case 'set': {
			object[0].data('reset', 0);			//allow for position reset
			for (var ndx = 0; ndx < object.length; ndx++) {
				setObjectXY(object[ndx], x, y);
			}
		}
		break;
		default: {
			setObjectXY(object, x, y);
		}
	}
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function move(object, dx, dy, x, y, event) {
	switch(object.type) {
		case 'set': {
			setNow = object;
			setBox = setNow.getBBox();		//used in element drag fxns

			for (var i = 0; i < object.length; i++) {
				updateObjectAttr(object[i], x, y);
			}
			
		}
		break;
		default: {
			updateObjectAttr(object, x, y);
		}
	}
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function stop(object, event) {
	if ((object[0].data('which') == 'ship') 
		&& (object[0].data('snapped')) 
		&& !(object[0].data('button'))) {
			object[0].data('button', 1);
			object[8].animate({		//button appears
				opacity: 1,
				path: Raphael.transformPath(object[8].attr('path'), 's100,100')
			},200,'bounce');		
	}

	else if ((object[0].data('which') == 'ship') 
		&& !(object[0].data('snapped')) 
		&& (object[0].data('button'))) {
			object[0].data('button', 0);		
			object[8].animate({			//button disappears
				opacity: 0,
				path: Raphael.transformPath(object[8].attr('path'), 's0.01,0.01')
			},200,'bounce');
	};
};

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
		move(object, dx, dy, x, y, event);
	}
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function onSetStop(object) {
	return function(event) {    // store reference to the set in the closure (there is no way of referencing it from Elements)
		stop(object, event);
	}
};


