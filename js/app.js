// SVG scaling accoring to where the screen is.

var welcome = document.querySelector('#welcome-section');
var screen = document.querySelector('#screen');

if (!isWebKit) {
  var imgWidth = 1960;
  var imgHeight = 1800;

  var screenWidth = 1618;
  var screenHeight = 780;

  var topOffset = 168;
  var leftOffset = 150;
} else {
  /* We have to decrement some values due to bilinear scaling process. */
  imgWidth = 1950;
  imgHeight = 1791;

  screenWidth = 1610;
  screenHeight = 776;
  
  topOffset = 167;
  leftOffset = 149;
}

function setStyles(scale, welcomeWidth, welcomeHeight) {
  screen.style.left = (welcomeWidth-imgWidth*scale)/2 + (leftOffset*scale) + 'px';
  screen.style.top = (welcomeHeight-imgHeight*scale)/2 + (topOffset*scale) + 60 + 'px';
  screen.style.width = screenWidth*scale + 'px';
  screen.style.height = screenHeight*scale + 'px';
}

function scaleScreen(start) {
  var welcomeWidth = welcome.offsetWidth;
  var welcomeHeight = welcome.offsetHeight-60;

  var imageRatio = imgWidth/imgHeight;
  var coverRatio = welcomeWidth/welcomeHeight;

  if (imageRatio >= coverRatio) {
    // Scale by width
    var scale = welcomeWidth/imgWidth;
  } else {
    // Scale by height
    var scale = welcomeHeight/imgHeight;
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
  lastCog = document.querySelector('#cog6'),
  viewSVG = document.querySelector('#view-svg'),
  reducePaddingElem = document.querySelector(
    '#screen > .scaling-svg-container-wrapper:nth-child(1) > .scaling-svg-container'
  ),
  projectsAnchor = document.querySelector('a[href="#projects"]');

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
  addRotateTransform('cog1', 2.7, -1);
  addRotateTransform('cog2', 2.7, 1);
  addRotateTransform('cog3', 2.7, -1);
  addRotateTransform('cog4', 2.7, 1);
  addRotateTransform('cog5', 2.7, 1);
  addRotateTransform('cog6', 2.7, -1);
}

function startViewSVGListeners() {
  window.addEventListener('keyup', function() {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13 && document.activeElement === viewSVG) {
      projectsAnchor.click();
    }
  });

  viewSVG.addEventListener('click', function() {
    projectsAnchor.click();
  });
}

function revealViewProjectsBtn(e) {
  if (e.animationName === 'fadeOut') {
    // Reduce padding on element above so btn is higher up
    reducePaddingElem.style.paddingBottom = '5%';

    startViewSVGListeners();
    viewSVG.classList.add('cursor-pointer');
    viewSVG.classList.add('fadeIn');
    cogsSVG.removeEventListener(animationEvent, revealViewProjectsBtn);
  }
}

function fadeOutCogs() {
  seamlessSVG.style.opacity = '1';
  seamlessSVG.classList.remove('fadeIn');
  seamlessSVG.classList.add('fadeOut1');
  cogsSVG.addEventListener(animationEvent, revealViewProjectsBtn);
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