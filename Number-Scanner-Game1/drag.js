//----------------------------------------------------------------------------
// drag.js //
// paths and circles/rects don't move exactly together
// for now, i'm changing everything to paths

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
	switch(object.type) {
		case 'circle': {
			// get offsets of object within set
			var offcx = object.attr('cx') - setBox.x,
				offcy = object.attr('cy') - setBox.y;
				rx = object.attr('rx'),
				//ry = object.attr('ry'),
			//these deltas could be carried through the fxns instead of defining it here
			dx = (x - object.attr('cx')) - object.x;
			dy = (y - object.attr('cy')) - object.y;

			// set lx,ly = new object coordinates
			if (setBox.x  + dx < 0) {lx = 0 + offcx;}
			else if (setBox.x2 + dx  > w) {
				lx = w + offcx - setBox.width;}
			else {lx = object.attr('cx') + dx;}

			if (setBox.y  + dy < 0) {ly = 0 + offcy;}
			else if (setBox.y + dy > line -100) {ly = line + offcy - setBox.height;}
			//(setBox.y2 + dy  > line)
			else {ly = object.attr('cy') + dy;}

			object.attr({cx: lx, cy: ly});
		}
		break;
		case 'path': {
			// get offsets of object within set
			//var box = object.getBBox(),
			//	offx = box.x - setBox.x,
			//	offy = box.y - setBox.y;

			dx = (x - object.getBBox().x) - object.x;
			dy = (y - object.getBBox().y) - object.y;

			if (setBox.x + dx < 0) {lx = 0;}
			else if (setBox.x2 + dx  > w) {lx = 0;}
			else {lx = dx;}

			if (setBox.y + dy < 0) {ly = 0;}
			else if (setBox.y2 + dy > line + 100) {ly = 0;}
			else {ly = dy;}
/*
			if (offleft) {lx = 0;}
			else if (offright) {lx = 0;}
			else {lx = dx;}

			if (offtop) {ly = 0;}
			else if (offbot) {ly = 0;}
			else {ly = dy;}
*/
			object.attr({path: Raphael.transformPath(object.attr('path'), '...T' + lx + ',' + ly)});
			}
		break;
		default: {
			// get offsets of object within set
			var offx = object.attr('x') - setBox.x,
				offy = object.attr('y') - setBox.y,
				//offx2 = object.attr('x2') - setBox.x2,
				//offy2 = object.attr('y2') - setBox.y2,
				//width = object.attr('width'),
				//height = object.attr('height');

			dx = (x - object.attr('x')) - object.x;
			dy = (y - object.attr('y')) - object.y;

			// set lx, ly = new object coordinates
			if (setBox.x  + dx < 0) {lx = 0 + offx;}
			else if (setBox.x2 + dx  > w) {lx = w + offx - setBox.width;}
			else {lx = object.attr('x') + dx;}

			//y direction has other fxns
			if (setBox.y + dy > line) {
				if (setNow[0].data('scnr')) {
					//do SCAN functions
					setNow[1].animate(appear)		
				};
				ly = line + offy - setBox.height;
			}
			else {
				if (setNow[0].data('scnr')) {
					//undo SCAN functions
					setNow[1].animate(disappear)	
				};
				if (setBox.y  + dy < 0) {ly = 0 + offy;} //offtop
				else {ly = object.attr('y') + dy;}	//free movement
				}; 	
			object.attr({x: lx, y: ly});
		};
	};
};

//----------------------------------------------------------------------------
//	on place to move our set or simple objects
function start(object, x, y, event) {
	switch(object.type) {
		case 'set': {
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
			online = setBox.y2 > line;
			if (online) {
				object[0].data('online', 1)
				if (object[0].data('which') == 'scanner') {
					object[9].animate(appear);
				};
			}
			else {
				if (object[0].data('which') == 'scanner') {
					object[9].animate(disappear);
				};
			};
			// slow and sticky parameters
			//offleft = (setBox.x) < 0 ? 1 : 0;
			//offright = (setBox.x2) > w ? 1 : 0;
			//offtop = (setBox.y) < 0 ? 1 : 0;
			//offbot = (setBox.y2 + dy) > line ? 1 :0;
			//online2 = setBox.y2 + dy> line - 100;
			for (var ndx = 0; ndx < object.length; ndx++) {
				updateObjectAttr(object[ndx], x, y);
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


