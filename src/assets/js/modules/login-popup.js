const linkPopups = document.querySelectorAll('.link-popup');
const popup = document.querySelector('.popup');
const body = document.querySelector('.page-body');
const navToggle = document.querySelector('.header__menu-btn');
const menu = document.querySelector('.header__menu');

let reCaptcha;

if (popup) {
  const popupIn = popup.querySelector('.popup__wrapper--form');
  const popupSuccess = popup.querySelector('.popup__wrapper--success');
  const closeButtons = popup.querySelectorAll('.popup__close-btn');
  const persoLink = popup.querySelector('.perso-link');
  const popupPerso = popup.querySelector('.popup__wrapper--perso');
  const backLink = popup.querySelector('.back-btn');

  persoLink.addEventListener('click', function (evt) {
    evt.preventDefault();
    popupIn.classList.add('hide');
    popupPerso.classList.add('show');
  });

  backLink.addEventListener('click', function (evt) {
    evt.preventDefault();
    popupIn.classList.remove('hide');
    popupPerso.classList.remove('show');
  });

  linkPopups.forEach(linkPopup => {
    linkPopup.addEventListener('click', function (evt) {
      evt.preventDefault();
      popup.classList.add('popup--open');
      popup.classList.remove('popup--close');
      body.classList.add('page-body--no-scroll');
      menu.classList.remove('header__menu--open');
      navToggle.classList.remove('header__menu-btn--open');
      navToggle.classList.add('header__menu-btn--close');

      reCaptcha = document.querySelector('.grecaptcha-badge');
      reCaptcha.classList.add('grecaptcha-badge--active');
    });
  });

  closeButtons.forEach(closeButton => {
    closeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      closePopupHandler();
    });
  });

  window.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      if (popup.classList.contains('popup--open')) {
        evt.preventDefault();
        closePopupHandler();
      }
    }
  });

  popup.addEventListener('click', function (evt) {
    if (evt.target !== popupIn && evt.target !== popupSuccess) {
      closePopupHandler();
    }
  });

  function closePopupHandler() {
    popup.classList.remove('popup--open');
    popup.classList.add('popup--close');
    body.classList.remove('page-body--no-scroll');
    reCaptcha.classList.remove('grecaptcha-badge--active');
    setTimeout(() => {
      popupIn.classList.remove('hide');
      popupIn.classList.remove('_error');
      popupSuccess.classList.remove('show');
      popupPerso.classList.remove('show');
    }, 800);
  }

  popupIn.addEventListener('click', function (evt) {
    evt.stopPropagation();
  });

  popupSuccess.addEventListener('click', function (evt) {
    evt.stopPropagation();
  });

  popupPerso.addEventListener('click', function (evt) {
    evt.stopPropagation();
  });
}
