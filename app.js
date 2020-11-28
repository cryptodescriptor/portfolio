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

var scalingImg = document.querySelector('.scaling-img');

// compute vector index from matrix one
function ivect(ix, iy, w) {
    // byte array, r,g,b,a
    return((ix + w * iy) * 4);
}

function bilinear(srcImg, destImg, scale) {
    // c.f.: wikipedia english article on bilinear interpolation
    // taking the unit square, the inner loop looks like this
    // note: there's a function call inside the double loop to this one
    // maybe a performance killer, optimize this whole code as you need
    function inner(f00, f10, f01, f11, x, y) {
        var un_x = 1.0 - x; var un_y = 1.0 - y;
        return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
    }
    var i, j;
    var iyv, iy0, iy1, ixv, ix0, ix1;
    var idxD, idxS00, idxS10, idxS01, idxS11;
    var dx, dy;
    var r, g, b, a;
    for (i = 0; i < destImg.height; ++i) {
        iyv = i / scale;
        iy0 = Math.floor(iyv);
        // Math.ceil can go over bounds
        iy1 = ( Math.ceil(iyv) > (srcImg.height-1) ? (srcImg.height-1) : Math.ceil(iyv) );
        for (j = 0; j < destImg.width; ++j) {
            ixv = j / scale;
            ix0 = Math.floor(ixv);
            // Math.ceil can go over bounds
            ix1 = ( Math.ceil(ixv) > (srcImg.width-1) ? (srcImg.width-1) : Math.ceil(ixv) );
            idxD = ivect(j, i, destImg.width);
            // matrix to vector indices
            idxS00 = ivect(ix0, iy0, srcImg.width);
            idxS10 = ivect(ix1, iy0, srcImg.width);
            idxS01 = ivect(ix0, iy1, srcImg.width);
            idxS11 = ivect(ix1, iy1, srcImg.width);
            // overall coordinates to unit square
            dx = ixv - ix0; dy = iyv - iy0;
            // I let the r, g, b, a on purpose for debugging
            r = inner(srcImg.data[idxS00], srcImg.data[idxS10],
                srcImg.data[idxS01], srcImg.data[idxS11], dx, dy);
            destImg.data[idxD] = r;

            g = inner(srcImg.data[idxS00+1], srcImg.data[idxS10+1],
                srcImg.data[idxS01+1], srcImg.data[idxS11+1], dx, dy);
            destImg.data[idxD+1] = g;

            b = inner(srcImg.data[idxS00+2], srcImg.data[idxS10+2],
                srcImg.data[idxS01+2], srcImg.data[idxS11+2], dx, dy);
            destImg.data[idxD+2] = b;

            a = inner(srcImg.data[idxS00+3], srcImg.data[idxS10+3],
                srcImg.data[idxS01+3], srcImg.data[idxS11+3], dx, dy);
            destImg.data[idxD+3] = a;
        }
    }
}

var loadCan = document.getElementById("load-canvas");
var dispCan = document.getElementById("disp-canvas");

var loadCtx = loadCan.getContext("2d");
var dispCtx = dispCan.getContext("2d");

function scaleCanvas(srcImg, scale) {
  var newWidth = Math.ceil(image_var.width*scale);
  var newHeight = Math.ceil(image_var.height*scale);
  dispCan.width = newWidth;
  dispCan.height = newHeight;
  dispCan.setAttribute("width", newWidth);
  dispCan.setAttribute("height", newHeight);
  var destImg = dispCtx.createImageData(newWidth, newHeight);
  bilinear(srcImg, destImg, scale);

  dispCtx.putImageData(destImg, 0, 0);
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

function scaleScreen(srcImg, start) {
  var welcomeWidth = welcome.offsetWidth;
  var welcomeHeight = welcome.offsetHeight-60;

  var imageRatio = imgWidth/imgHeight;
  var coverRatio = welcomeWidth/welcomeHeight;

  if (welcomeWidth >= imgWidth && welcomeHeight >= imgHeight) {
    var scale = 1;
  } else if (imageRatio >= coverRatio) {
    // The Height is our constant
    var scale = imgWidth/welcomeWidth;
    console.log('1) ' + welcomeWidth/imgWidth);
  } else {
    // The Width is our constant
    var scale = imgHeight/welcomeHeight;
    console.log('2) ' + welcomeHeight/imgHeight);
  }

  console.log(scale);

  scaleCanvas(srcImg, scale);

  setStyles(scale, welcomeWidth, welcomeHeight);

  if (start) {
    screen.style.visibility = 'visible';
    document.body.classList.remove('animations-paused');
  }
}

var image_var = new Image();
image_var.onload  = function () {
  loadCan.setAttribute("width", image_var.width);
  loadCan.setAttribute("height", image_var.height);
  loadCan.style.position = "fixed"; /* can remove? */
  loadCan.width  = image_var.width;
  loadCan.height = image_var.height;
  loadCtx.drawImage(image_var, 0, 0, image_var.width, image_var.height);

  // getImageData : Chrome & FF: Unable to get image data from canvas because the canvas
  // has been tainted by cross-origin data.
  // when served from localhost, dev laptop
  var srcImg = loadCtx.getImageData(0, 0, image_var.width, image_var.height);

  scaleScreen(srcImg, true);
  window.addEventListener('resize', function() { scaleScreen(srcImg, false); });
}
image_var.src = "no-webkit.png";

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

var animationEvent = whichAnimationEvent();

var whichTransitionEvent = function() {
  var t;
  var el = document.createElement("fakeelement");
  var transitions = {
    transition: "transitionend",
    OTransition: "oTransitionEnd",
    MozTransition: "transitionend",
    WebkitTransition: "webkitTransitionEnd"
  };
  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

var transitionEvent = whichTransitionEvent();

var lastMaskPath = document.querySelector('#mask path:nth-child(6)'),
  programmingSVG = document.querySelector('#programming-svg'),
  codingSVG = document.querySelector('#coding-svg'),
  seamlessSVG = document.querySelector('#seamless-svg'),
  cogsSVG = document.querySelector('#cogs-svg'),
  cogsGroup = document.querySelector('#cogs-svg > g'),
  lastCog = document.querySelector('#cog6');

lastMaskPath.addEventListener(animationEvent, restartAnimation);

function addRotateTransform(target_id, dur, dir) {
  var my_element = cogsSVG.getElementById(target_id);
  my_element.style.animation = 'none'; /* Fix Firefox bug */
  var a = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
  var bb = my_element.getBBox();
  var cx = bb.x + bb.width/2;
  var cy = bb.y + bb.height/2;
  a.setAttributeNS(null, 'attributeName', 'transform');
  a.setAttributeNS(null, 'attributeType', 'XML');
  a.setAttributeNS(null, 'type', 'rotate');
  a.setAttributeNS(null, 'dur', dur + 's');
  a.setAttributeNS(null, 'from', '0 '+cx+' '+cy);
  a.setAttributeNS(null, 'to', 360*dir+' '+cx+' '+cy);
  my_element.appendChild(a);
  a.beginElement();
}

function startCogRotations() {
  addRotateTransform('cog1', 3, -1);
  addRotateTransform('cog2', 3, 1);
  addRotateTransform('cog3', 3, -1);
  addRotateTransform('cog4', 3, 1);
  addRotateTransform('cog5', 3, 1);
  addRotateTransform('cog6', 3, -1);
}

function fadeOutCogs() {
  seamlessSVG.style.opacity = '1';
  seamlessSVG.classList.remove('fadeIn');
  seamlessSVG.classList.add('fadeOut1');
  cogsSVG.classList.add('fadeOut1');
}

function revealAndSpinCogs() {
  // Wait for programming SVG's to fade out
  programmingSVG.addEventListener(animationEvent, function() {
    // Set up listeners to occur after entrance animations
    lastCog.addEventListener(animationEvent, startCogRotations);
    seamlessSVG.addEventListener(animationEvent, fadeOutCogs);

    // Reveal text and cogs
    seamlessSVG.classList.add('fadeIn');
    cogsGroup.classList.remove('animations-paused');
  });
}

function fadeOutCoding() {
  programmingSVG.classList.add('fadeOut');
  codingSVG.classList.add('fadeOut');
}

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

  // Insert new mask to start animation on group2
  mask.parentNode.replaceChild(newMask, mask);
  mask = document.querySelector('#mask');

  // Wait for last mask to finish Animating
  lastMaskPath = mask.lastElementChild;

  lastMaskPath.addEventListener(animationEvent, function() {
    fadeOutCoding();
    revealAndSpinCogs();
  });

  // Only reveal when mask is initialised
  group2.style.opacity = '1';

  // Cleanup
  lastMaskPath.removeEventListener(animationEvent, restartAnimation);
}