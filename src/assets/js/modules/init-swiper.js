// tabs

const sliderTabs = document.querySelector('.partners__tabs-swiper');
const tabs = ['Авто', 'Недвижимость', 'ЖКХ', 'Госуслуги'];

if (sliderTabs) {
  const sliderTabs = new Swiper('.partners__tabs-swiper', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + tabs[index] + '</span>';
      },
    },
    autoHeight: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    allowTouchMove: false,
  });
}

// examples-slider

const sliderExamples = document.querySelector('.examples__swiper');

if (sliderExamples) {
  const sliderExamples = new Swiper('.examples__swiper', {
    loop: true,
    autoHeight: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    speed: 1000,
    allowTouchMove: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}
