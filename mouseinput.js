// 
// created by Jack Morris, May 2016
//
//

var MX, MY;

MX = 0;
MY = 0;

window.onload = function() {

  document.addEventListener('mousemove', function(evt) {
    MX = evt.pageX;
    MY = evt.pageY;
  });

};

// velocity
var MOUSE_EPSILON = 2.0;
var MOUSE_SPEED_CONSTANT = 7.5;
var get_mouse_v = function(x, y) {
  // x & y distances
  var DMX = MX - x;
  var DMY = MY - y;
  // total distance to mouse
  var dxy = Math . sqrt( (DMX * DMX) + (DMY * DMY) );
  if(dxy < MOUSE_EPSILON) return 0;
  // return distance times a constant 
    // (pixels per second per pixel of distance)
  else return MOUSE_SPEED_CONSTANT * Math.sqrt( dxy ) ;
}

// direction 
var get_mouse_t = function(x, y) {
  // x & y distances
  var DMX = MX - x;
  var DMY = MY - y;
  // return angle
  return Math.atan2( DMY,DMX );
}
