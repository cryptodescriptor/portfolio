Array.prototype.rotate = function(n) {
  return this.slice(n, this.length).concat(this.slice(0, n));
}

window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

const galleryContainer = document.querySelector('.gallery-container');
const galleryItems = document.querySelectorAll('.gallery-item');
const githubSVG = './images/github.svg';
const websiteSVG = './images/website.svg';
const urlPostfixes = ['tribute-page', 'documentation-page', 'product-landing-page', 'survey-form', 'portfolio'];

class Carousel {
  constructor(items) {
    this.carouselArray = [...items];
    this.carouselArrayTemp = [];
  }

  btnEvent(source, target, ind) {
    if (target.parentElement.classList[1] !== 'gallery-item-selected') return;
    let url = (source) ? 'https://github.com/cryptodescriptor/' : 'https://cryptodescriptor.github.io/';
    window.open(url + urlPostfixes[ind], '_blank');
  }

  addBtnEvents(parent, ind) {
    parent.querySelector('.github-btn-svg').addEventListener('click', e => {
      this.btnEvent(true, e.target, ind);
    });

    parent.querySelector('.website-btn-svg').addEventListener('click', e => {
      this.btnEvent(false, e.target, ind);
    });
  }

  addBtnElements(parent) {
    parent.innerHTML += 
    '<img src="' + githubSVG + '" alt="Github Button" class="github-btn-svg btn-svg">' +
    '<img src="' + websiteSVG + '" alt="Website Button" class="website-btn-svg btn-svg">';
  }

  setInitialState() {
    // Assign initial css classes for gallery and nav items
    this.carouselArray[0].classList.add('gallery-item-first');
    this.carouselArray[1].classList.add('gallery-item-previous');
    this.carouselArray[2].classList.add('gallery-item-selected');
    this.carouselArray[3].classList.add('gallery-item-next');
    this.carouselArray[4].classList.add('gallery-item-last');

    document.querySelector('.gallery-nav').childNodes[0].className = 'gallery-nav-item gallery-item-first';
    document.querySelector('.gallery-nav').childNodes[1].className = 'gallery-nav-item gallery-item-previous';
    document.querySelector('.gallery-nav').childNodes[2].className = 'gallery-nav-item gallery-item-selected';
    document.querySelector('.gallery-nav').childNodes[3].className = 'gallery-nav-item gallery-item-next';
    document.querySelector('.gallery-nav').childNodes[4].className = 'gallery-nav-item gallery-item-last';

    // Add buttons
    this.carouselArray.forEach((item) => {
      // Buttons are already added in HTML for .gallery-item-selected
      if (item.classList[1] !== 'gallery-item-selected') {
        this.addBtnElements(item);
      }
    });

    // Add corresponding event listeners
    this.carouselArray.forEach((item, ind) => {
      this.addBtnEvents(item, ind);
    });

    // Only use animation on devices other than Mobile and Tablets
    if (!window.mobileAndTabletCheck()) {
      var styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.innerText = '.gallery-item { transition: all 0.2s ease-in-out; }';
      document.head.appendChild(styleSheet);
    }

    return document.querySelectorAll('.gallery-nav-item');
  }

  // Update the order state of the carousel with css classes
  setCurrentState(target) {
    if (target.className === 'next') {
      this.carouselArrayTemp = this.carouselArray.rotate(-1);
    } else if (target.className === 'previous') {
      this.carouselArrayTemp = this.carouselArray.rotate(1);
    }

    let tempClassList = [];

    this.carouselArrayTemp.forEach(item => {
      tempClassList.push(item.classList[1]);
    });

    [this.carouselArray, galleryNavItems].forEach(elements => {
      elements.forEach((item, ind) => {
        item.classList.remove(item.classList[1]);
        item.classList.add(tempClassList[ind]);
      });
    });
  }

  // Construct the carousel navigation
  setNav() {
    galleryContainer.appendChild(document.createElement('ul')).className = 'gallery-nav';

    this.carouselArray.forEach(item => {
      const nav = galleryContainer.lastElementChild;
      nav.appendChild(document.createElement('li'));
    });
  }
 
  // Add a click event listener to trigger setCurrentState method to rearrange carousel
  useControls() {
    const triggers = [document.querySelector('.previous'),
    document.querySelector('.next')];

    triggers.forEach(control => {
      control.addEventListener('click', () => {
        const target = control;
        this.setCurrentState(target);
      });
    });
  }
}

const exampleCarousel = new Carousel(galleryItems);

exampleCarousel.setNav();
const galleryNavItems = exampleCarousel.setInitialState();
exampleCarousel.useControls();