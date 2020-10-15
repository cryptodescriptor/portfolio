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
var svgScreen = document.querySelector('#screen');
var scalingImg = document.querySelector('.scaling-img');

var imgWidth = 1960;
var imgHeight = 1800;

var screenWidth = 1616;
var screenHeight = 778;

var topOffset = 170;
var leftOffset = 152;

function setStyles(widthScale, heightScale) {
  if (widthScale === 1 && heightScale === 1) {
    svgScreen.style.width = screenWidth + 'px';
    svgScreen.style.height = screenHeight + 'px';
    svgScreen.style.top = scalingImg.getBoundingClientRect().top + topOffset + 'px';
    svgScreen.style.left = scalingImg.getBoundingClientRect().left + leftOffset + 'px';
  } else {
    svgScreen.style.width = screenWidth/widthScale + 'px';
    svgScreen.style.height = screenHeight/heightScale + 'px';
    svgScreen.style.top = scalingImg.getBoundingClientRect().top + (topOffset/heightScale) + 'px';
    svgScreen.style.left = scalingImg.getBoundingClientRect().left + (leftOffset/widthScale) + 'px';
  }
}

function scaleScreen(start) {
  var scaledImgWidth = scalingImg.width;
  var scaledImgHeight = scalingImg.height;
  var widthScale = imgWidth/scaledImgWidth;
  var heightScale = imgHeight/scaledImgHeight;

  setStyles(widthScale, heightScale);

  if (start) {
    svgScreen.style.visibility = 'visible';
  }
}

imagesLoaded(scalingImg, function() {
  scaleScreen(true);
  window.addEventListener('resize', function() { scaleScreen(false); });
});