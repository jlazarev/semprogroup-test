// price slider
const sliderPrice = document.getElementById('range-slider-price');

if (sliderPrice) {
  noUiSlider.create(sliderPrice, {
    start: 350000,
    connect: 'lower',
    step: 10000,
    range: {
      min: 350000,
      max: 3000000,
    },
    format: wNumb({
      decimals: 0,
      thousand: ' ',
      suffix: ' ₽',
    }),
  });

  const inputPrice = document.getElementById('input-price');

  sliderPrice.noUiSlider.on('update', function (values, handle) {
    inputPrice.value = values[handle];
  });

  inputPrice.addEventListener('change', function () {
    sliderPrice.noUiSlider.set(this.value);
  });
}

// month slider
const sliderMonth = document.getElementById('range-slider-month');

if (sliderMonth) {
  noUiSlider.create(sliderMonth, {
    start: 1,
    connect: 'lower',
    step: 1,
    range: {
      min: 1,
      max: 36,
    },
    format: wNumb({
      decimals: 0,
      thousand: '',
      suffix: ' месяц',
    }),
  });

  const inputMonth = document.getElementById('input-month');

  sliderMonth.noUiSlider.on('update', function (values, handle) {
    inputMonth.value = values[handle];
  });

  inputMonth.addEventListener('change', function () {
    sliderMonth.noUiSlider.set(this.value);
  });
}

// payment slider
const sliderPayment = document.getElementById('range-slider-payment');

if (sliderPayment) {
  noUiSlider.create(sliderPayment, {
    start: 50000,
    connect: 'lower',
    step: 10000,
    range: {
      min: 50000,
      max: 200000,
    },
    format: wNumb({
      decimals: 0,
      thousand: ' ',
      suffix: ' ₽',
    }),
  });

  const inputPayment = document.getElementById('input-payment');

  sliderPayment.noUiSlider.on('update', function (values, handle) {
    inputPayment.value = values[handle];
  });

  inputPayment.addEventListener('change', function () {
    sliderPayment.noUiSlider.set(this.value);
  });
}
