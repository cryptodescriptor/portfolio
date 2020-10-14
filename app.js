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

var screenWidth = 1616;
var screenHeight = 778;

var topOffset = 169;
var leftOffset = 151;

function setStyles(scale, welcomeWidth, welcomeHeight) {
  if (scale === 0) {
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

function scaleScreen() {
  var welcomeWidth = welcome.offsetWidth;
  var welcomeHeight = welcome.offsetHeight-60;

  var imageRatio = imgWidth/imgHeight;
  var coverRatio = welcome.offsetWidth/welcomeHeight;

  if (welcomeWidth >= imgWidth && welcomeHeight >= imgHeight) {
    var scale = 0;
  } else if (imageRatio <= coverRatio) {
    // The Width is our constant
    var scale = imgHeight/welcomeHeight;
  } else {
    // The Height is our constant
    var scale = imgWidth/welcomeWidth;
  }

  setStyles(scale, welcomeWidth, welcomeHeight);
}

scaleScreen();

window.addEventListener('resize', scaleScreen);