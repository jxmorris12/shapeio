// 
// created by Jack Morris, May 2016
//
//
// arrows: left 37, up 38, right 39, down 40
//
var KEY_PRESSED = {
  LEFT:   false,
  UP:     false,
  RIGHT:  false,
  DOWN:   false
};
//
window.onload = function() {
//
//
//
document.addEventListener('keydown', function(event) {
  // console.log('keydown which',event.which);
  switch(event.which) {
    case 37:
      KEY_PRESSED . LEFT = true;
      break;
    case 38:
      KEY_PRESSED . UP = true;
      break;
    case 39:
      KEY_PRESSED . RIGHT = true;
      break;
    case 40:
      KEY_PRESSED . DOWN = true;
      break;
    default:
      break;
  }
}, false);
//
//
//
document.addEventListener('keyup', function(event) {
  // console.log('keyup which',event.which);
  switch(event.which) {
    case 37:
      KEY_PRESSED . LEFT  = false;
      break;
    case 38:
      KEY_PRESSED . UP    = false;
      break;
    case 39:
      KEY_PRESSED . RIGHT = false;
      break;
    case 40:
      KEY_PRESSED . DOWN  = false;
      break;
    default:
      break;
  }
}, false);
//
//
//
};