// Disable :hover events if touch device
// https://stackoverflow.com/a/30303898

function watchForHover() {
  // lastTouchTime is used for ignoring emulated mousemove events
  let lastTouchTime = 0;

  function enableHover() {
    if (new Date() - lastTouchTime < 500) return;
    document.body.classList.add('hasHover');
  }

  function disableHover() {
    document.body.classList.remove('hasHover');
  }

  function updateLastTouchTime() {
    lastTouchTime = new Date();
  }

  document.addEventListener('touchstart', updateLastTouchTime, true);
  document.addEventListener('touchstart', disableHover, true);
  document.addEventListener('mousemove', enableHover, true);

  enableHover();
}

watchForHover();

// forEach polyfill

if (window.NodeList && !NodeList.prototype.forEach) {
   NodeList.prototype.forEach = Array.prototype.forEach;
}

// Set nav link to active based on window location

var links = document.querySelectorAll('.nav-link');

function setNavlinkActive() {
  var loc = window.location.hash.replace('#', '');

  if (!loc) {
    links[0].classList.add('active');
  } else {
    document.querySelector('a[href="#'+loc+'"]').classList.add('active');
  }
}

function unsetNavLinkActive() {
  links.forEach(function(e) {
    e.classList.remove('active');
    e.blur();
  });
}

// Set initial active

setNavlinkActive();

// Nav link click event listener

links.forEach(function(e) {
  e.addEventListener('click', function() {
    unsetNavLinkActive();
    e.classList.add('active');
  });
});

// Update active link on state change

window.onpopstate = function() {
  unsetNavLinkActive();
  setNavlinkActive();
};