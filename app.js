// forEach polyfill

if (window.NodeList && !NodeList.prototype.forEach) {
   NodeList.prototype.forEach = Array.prototype.forEach;
}

var links = document.querySelectorAll('.nav-link');

// Set nav link to active based on window location

var loc = window.location.hash.replace('#', '');

if (!loc) {
  links[0].classList.add('active');
} else {
  document.querySelector('a[href="#'+loc+'"]').classList.add('active');
}

// Nav link click event listener

links.forEach(function(e) {
  e.addEventListener('click', function() {
    links.forEach(function(e) {
      e.classList.remove('active');
    });
    e.classList.add('active');
  });
});

// SVG scaling accoring to where the screen is.

var welcome = document.querySelector('#welcome-section');
var screen = document.querySelector('#screen');

var imgWidth = 1960;
var imgHeight = 1800;

var screenWidth = 1618;
var screenHeight = 780;

var topOffset = 168;
var leftOffset = 150;

if (isWebKit) {
  /* We have to decrement some values due to bilinear scaling process. */
  imgWidth = 1950;
  imgHeight = 1791;

  screenWidth = 1610;
  screenHeight = 776;
  
  topOffset = 167;
  leftOffset = 149;
}

function setStyles(scale, welcomeWidth, welcomeHeight) {
  if (scale === 1) {
    screen.style.left = (welcomeWidth-imgWidth)/2 + leftOffset + 'px';
    screen.style.top = (welcomeHeight-imgHeight)/2 + topOffset + 60 + 'px';
    screen.style.width = screenWidth + 'px';
    screen.style.height = screenHeight + 'px';
  } else {
    screen.style.left = (welcomeWidth-imgWidth/scale)/2 + (leftOffset/scale) + 'px';
    screen.style.top = (welcomeHeight-imgHeight/scale)/2 + (topOffset/scale) + 60 + 'px';
    screen.style.width = screenWidth/scale + 'px';
    screen.style.height = screenHeight/scale + 'px';
  }
}

function scaleScreen(start) {
  var welcomeWidth = welcome.offsetWidth;
  var welcomeHeight = welcome.offsetHeight-60;

  var imageRatio = imgWidth/imgHeight;
  var coverRatio = welcomeWidth/welcomeHeight;

  if (welcomeWidth >= imgWidth && welcomeHeight >= imgHeight) {
    var scale = 1;
  } else if (imageRatio >= coverRatio) {
    // The Height is our constant
    var scale = imgWidth/welcomeWidth;
  } else {
    // The Width is our constant
    var scale = imgHeight/welcomeHeight;
  }

  setStyles(scale, welcomeWidth, welcomeHeight);

  if (start) {
    screen.style.visibility = 'visible';
    document.body.classList.remove('animations-paused');
  }
}

imagesLoaded(scalingImg, function() {
  scaleScreen(true);
  window.addEventListener('resize', function() { scaleScreen(false); });
});


// Coding Animation

function whichAnimationEvent(){
  var t,
      el = document.createElement("fakeelement");

  var animations = {
    "animation"      : "animationend",
    "OAnimation"     : "oAnimationEnd",
    "MozAnimation"   : "animationend",
    "WebkitAnimation": "webkitAnimationEnd"
  }

  for (t in animations){
    if (el.style[t] !== undefined){
      return animations[t];
    }
  }
}

var lastMaskPath = document.querySelector('#mask path:nth-child(6)'),
  animationEvent = whichAnimationEvent();

lastMaskPath.addEventListener(animationEvent, restartAnimation);

function restartAnimation() {
  var group1 = document.querySelector('#group1'),
    group2 = document.querySelector('#group2'),
    mask = document.querySelector('#mask');

  // Remove mask from current group
  group1.removeAttribute('mask');

  // Set mask on next group
  group2.setAttribute('mask', 'url(#mask)');

  // Clone mask
  var newMask = mask.cloneNode(true);

  // Set "delayed" class
  newMask.setAttribute('class', 'delayed');

  // Insert new mask to start animation on group2
  mask.parentNode.replaceChild(newMask, mask);
  mask = document.querySelector('#mask');

  // Only reveal when mask is initialised
  group2.style.opacity = '1';

  // Cleanup
  lastMaskPath.removeEventListener(animationEvent, restartAnimation);
}