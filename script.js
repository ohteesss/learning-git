'use strict';

///////////////////////////////////////
// Selectors
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
///////////////////////////////////////
// Implementing home page click
// nav.querySelector('.nav__logo').style.cursor = 'pointer';
// nav.addEventListener('click', function (e) {
//   if (e.target.classList.contains('nav__logo')) {
//     document.querySelector('header').scrollIntoView({
//       behavior: 'smooth',
//     });
//   }
// });
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());

  // console.log('Current scroll(X/Y)', window.pageXOffset, pageYOffset);
  // console.log(
  //   'height/width of viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );
  // Scrolling
  // window.scrollTo(s1coords.x, s1coords.y);
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation

// document.querySelectorAll('.nav__link').forEach(link =>
//   link.addEventListener('click', e => {
//     e.preventDefault();
//     document
//       .querySelector(`${link.getAttribute('href')}`)
//       .scrollIntoView({ behavior: 'smooth' });
//   })
// );

// Event Delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(`${e.target.getAttribute('href')}`)
      .scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

// tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  // Remove active tabs
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tc => tc.classList.remove(`operations__content--active`));
  // Guard clause
  if (!clicked) return;

  // Active tab
  clicked.classList.add('operations__tab--active');
  // const activeTab = e.target.getAttribute('data-tab');

  // Implementing change of content
  // tabsContent.forEach(tc => tc.classList.remove(`operations__content--active`));
  // [...tabsContent]
  //   .find(tc => tc.classList.contains(`operations__content--${activeTab}`))
  //   .classList.add('operations__content--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade Animation
const handleHover = function (opacityValue, e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav__links').querySelectorAll('.nav__link');
    // console.log(siblings);
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacityValue;
    });
    logo.style.opacity = opacityValue;
  }
};
nav.addEventListener('mouseover', function (e) {
  handleHover(0.5, e);
});
nav.addEventListener('mouseout', function (e) {
  handleHover(1, e);
});

// Sticky navigation, the scroll event
// const topFeature =this.section1.getBoundingClientRect().top;
// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > section1.getBoundingClientRect().top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });
// Sticky navigation, the intersection observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  entry.isIntersecting
    ? nav.classList.remove('sticky')
    : nav.classList.add('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// removing elements on scroll
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  // section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loading = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (entry.isIntersecting) {
    // console.log(entry.target.dataset.src);
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  }
};
const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 1,
  rootMargin: '100px',
});
imgTargets.forEach(img => imgObserver.observe(img));

// Building a slider component
const sliderFunction = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  // const dots = document.querySelectorAll('.dots__dot');
  // console.log(dots);

  let curSlide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.5) translateX(-800px)';
  // slider.style.overflow = 'visible';

  // functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide ="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = slide => {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    // slides.forEach((s, i, arr) => {
    //   // if (curSlide > arr.length - 1) {
    //   //   curSlide = 0;
    //   // }
    //   s.style.transform = `translateX(${100 * (i - curSlide)}%)`;
    // });
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  init();
  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    else if (e.key === 'ArrowLeft') prevSlide();
  });
  dotContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  });
};
sliderFunction();
// Lecture

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree buitl!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();

//   console.log(e);
//   e.returnValue = '';
// });

// DOM Traversing

// const h1 = document.querySelector('h1');

// // Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// Going upwards; PARENT
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

/////////////////
// Event propagation
// rgb(255,255,255)
// const randomInt = (min, max) => {
//   return Math.round(Math.random() * (max - min)) + min;
// };
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LInk li', e.target, e.currentTarget);
//   console.log(e.currentTarget === this); //true

// Stop propagation
// e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LInk ul', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('LInk lnav', e.target, e.currentTarget.style.backgroundColor);
//   }
//   // true capturing set it to true
// );

// adding and removing eventlisteners
// const h1 = document.querySelector('h1');
// const alertH1 = function (e) {
//   alert('addEvenlistener: Great! You are reading the heading :D');

//   h1.removeEventListener('mouseenter', alertH1);
// };
// h1.addEventListener('mouseenter', alertH1);

// h1.onmouseenter = function (e) {
//   alert('mouseenter: Great! You are reading the heading :D');
// };

// Selecting Elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// // Creating and inserting elements

// // .insertAdjacentHtml('afterBegin', html);
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent =
// //   'We use cookies for improved functionality and performance!';
// message.innerHTML =
//   'We use cookies for improved functionality and performance! <button class = "btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
// // header.append(message);

// // header.append(message.cloneNode(true));
// // header.before(message);
// // header.after(message);

// // Delete elements
// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
//   message.remove();
//   // message.parentElement.removeChild(message);
// });

// // Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.color);
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.src);
// console.log(logo.alt);
// console.log(logo.className);

// logo.alt = 'Beautiful Minimalist logo';

// // Non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('Company', 'ohteesss');

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.twitter-link');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('c', 'j', 'k');
// logo.classList.remove('c', 'j', 'k');
// logo.classList.toggle('c', 'j', 'k');
// logo.classList.contains('c', 'j', 'k');

// // Dont use
// logo.className = 'Oluwatobi'; // Only allows one class and overides others
// const factorial = function (n) {
//   let result = 1;
//   for (; n > 1; n--) {
//     result *= n;
//   }
//   return result;
// };

// console.log(factorial(4));

// const sum = function (n) {
//   let result = 1;
//   const arr = Array.from({ length: n }, (cur, i) => i + 1);
//   arr.forEach(ar => (result *= ar));
//   console.log(result);
// };
// sum(3);

// const fibonacci = function (n) {
//   // let arr = Array.from({ length: n }, (_, i) => i);
//   let n1 = 0,
//     n2 = 1,
//     nextTerm;
//   for (let i = 1; i <= n; i++) {
//     console.log(n1);
//     nextTerm = n1 + n2;
//     n1 = n2;
//     n2 = nextTerm;
//   }
// };
// fibonacci(8);
// const fibonnacci = function (n) {
//   let arr = [0, 1];
//   for (let i = 2; i < n; i++) {
//     arr[i] = arr[i - 2] + arr[i - 1];
//   }
//   console.log(arr);
// };
// fibonnacci(8);

// Codewars
// function alphabetPosition(text) {
//   // return text;
//   let arr = [
//     'a',
//     'b',
//     'c',
//     'd',
//     'e',
//     'f',
//     'g',
//     'h',
//     'i',
//     'j',
//     'k',
//     'l',
//     'm',
//     'n',
//     'o',
//     'p',
//     'q',
//     'r',
//     's',
//     't',
//     'u',
//     'v',
//     'w',
//     'x',
//     'y',
//     'z',
//   ];
//   const newArr = [];
//   const out = text.split(' ').join('').toLowerCase().split('');
//   console.log(out);
//   out.forEach(ou => {
//     if (arr.indexOf(ou) === -1) {
//       return;
//     } else {
//       newArr.push(arr.indexOf(ou) + 1);
//     }
//   });
//   console.log(newArr.join(' '));
// }
// alphabetPosition("The sunset sets at twelve o' clock.");

// const div = function (x, y) {
//   if (y == 0) {
//     throw new RangeError("Can't divide by 0");
//   }
//   return x / y;
// };
// // console.log(div(24 / 0));
// // ('let x= 10');
// // console.log(x);
// // const x = 10;
// // ocnsole.log(x);
// // x += 10;
// // console.time('Counter');
// // console.timeEnd('Counter');

// // let test = prompt('Run', 'code');
// // const a = 'bsns';
// // const mes = 'I do not {a}';

// let x = [10, 20, 30, 40];
// let y = [50, 60];
// x.reverse().push(y);
