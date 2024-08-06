const header = document.querySelector('.header');
const navToggle = header.querySelector('.header__menu-btn');
const menu = header.querySelector('.header__menu');
const navLinks = header.querySelectorAll('.header__menu-link');
const body = document.querySelector('.page-body');

navLinks.forEach(navLink => {
  navLink.addEventListener('click', function () {
    menu.classList.remove('header__menu--open');
    navToggle.classList.remove('header__menu-btn--open');
    navToggle.classList.add('header__menu-btn--close');
    body.classList.remove('page-body--no-scroll');
  });
});

navToggle.addEventListener('click', function () {
  if (menu.classList.contains('header__menu--open')) {
    menu.classList.remove('header__menu--open');
    navToggle.classList.remove('header__menu-btn--open');
    navToggle.classList.add('header__menu-btn--close');
    body.classList.remove('page-body--no-scroll');
  } else {
    menu.classList.add('header__menu--open');
    navToggle.classList.add('header__menu-btn--open');
    navToggle.classList.remove('header__menu-btn--close');
    body.classList.add('page-body--no-scroll');
  }
});

window.addEventListener('click', function (evt) {
  if (evt.target !== menu && evt.target !== navToggle && !header.contains(evt.target)) {
    menu.classList.remove('header__menu--open');
    navToggle.classList.remove('header__menu-btn--open');
    navToggle.classList.add('header__menu-btn--close');
    body.classList.remove('page-body--no-scroll');
  }
});

menu.addEventListener('click', function (evt) {
  evt.stopPropagation();
});
