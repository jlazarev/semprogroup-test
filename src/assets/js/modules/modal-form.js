const form = document.querySelector('.popup__form');
const inputContainers = form.querySelectorAll('.input-box');

// Делаем placeholder со сдвигом.
inputContainers.forEach(container => {
  const input = container.querySelector('[id^="input"]');
  const placeholder = container.querySelector('.placeholder');

  input.addEventListener('change', () => {
    if (input.value === '') {
      placeholder.classList.remove('placeholder--active');
    } else {
      placeholder.classList.add('placeholder--active');
    }
  });
});

// Отправка данных
const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const PHONE_REGEXP = /^\+7 [0-9][0-9][0-9] [0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/iu;

const popup = document.querySelector('.popup');
const popupIn = popup.querySelector('.popup__wrapper--form');
const popupSuccess = popup.querySelector('.popup__wrapper--success');

/**
 * Здесь необходимо подставить url для отправка запроса с данными пользователя
 * TODO: подставить url
 */
const URL_UPLOAD = 'https://kazna.tprs.ru/form';

form.addEventListener('submit', formSendHandle);

async function formSendHandle(evt) {
  evt.preventDefault();

  popupIn.classList.remove('_error');

  let error = formValidate(form);

  if (error !== 0) return;

  const formData = new FormData(form);

  grecaptcha.ready(function () {
    grecaptcha
      .execute('6LeuUcsoAAAAALIjo1cUSFVp8Q39WjFbHzhobIoN', {action: 'submit'})
      .then(async function (token) {
        popupIn.classList.add('_sending');

        formData.append('g-recaptcha-response', token);

        let response = await fetch(URL_UPLOAD, {
          method: 'POST',
          body: formData,
        });

        let data = await response.json();

        if (response.ok && data.status) {
          // Код который отрабатывает в случае успешной отправки формы.
          form.reset();
          inputContainers.forEach(container => {
            const placeholder = container.querySelector('.placeholder');
            placeholder.classList.remove('placeholder--active');
          });
          popupIn.classList.remove('_sending');
          popupIn.classList.add('hide');
          popupSuccess.classList.add('show');
        } else {
          // Код который отрабатывает в случае, если сервер вернёт ошибку.
          popupIn.classList.remove('_sending');
          popupIn.classList.add('_error');
        }
      });
  });
}

function formValidate() {
  let error = 0;

  inputContainers.forEach(container => {
    const input = container.querySelector('[id^="input"]');
    const errorMessage = container.querySelector('.error-message');
    formRemoveError(input);

    switch (input.id) {
      case 'input-email':
        if (input.value === '') {
          formAddError(input);
          errorMessage.textContent = 'Заполните поле';
          error++;
        } else if (!isValidValue(input.value, EMAIL_REGEXP)) {
          formAddError(input);
          errorMessage.textContent = 'Поле заполнено неверно';
          error++;
        }

        input.addEventListener('blur', () => {
          blurInputWithValidationHandler(input, EMAIL_REGEXP);
          if (input.value === '') {
            formAddError(input);
            errorMessage.textContent = 'Заполните поле';
          }
        });
        break;
      case 'input-tel':
        if (input.value === '') {
          formAddError(input);
          errorMessage.textContent = 'Заполните поле';
          error++;
        } else if (!isValidValue(input.value, PHONE_REGEXP)) {
          formAddError(input);
          errorMessage.textContent = 'Поле заполнено неверно';
          error++;
        }

        input.addEventListener('blur', () => {
          blurInputWithValidationHandler(input, PHONE_REGEXP);
          if (input.value === '') {
            formAddError(input);
            errorMessage.textContent = 'Заполните поле';
          }
        });
        break;
      default:
        if (input.value === '') {
          formAddError(input);
          error++;
        }

        input.addEventListener('blur', () => {
          blurInputHahdler(input);
        });
    }
  });

  return error;
}

function formAddError(input) {
  input.parentElement.classList.add('_error');
  input.classList.add('_error');
}

function formRemoveError(input) {
  input.parentElement.classList.remove('_error');
  input.classList.remove('_error');
}

function isValidValue(value, regExp) {
  return regExp.test(value);
}

function blurInputHahdler(input) {
  if (input.value !== '') {
    formRemoveError(input);
  } else {
    formAddError(input);
  }
}

// Устанавливаем валидацию для телефона и почты до отправки формы
const inputPhone = form.querySelector('#input-tel');
const inputEmail = form.querySelector('#input-email');

inputPhone.addEventListener('blur', () => {
  blurInputWithValidationHandler(inputPhone, PHONE_REGEXP);
});
inputEmail.addEventListener('blur', () => {
  blurInputWithValidationHandler(inputEmail, EMAIL_REGEXP);
});

function blurInputWithValidationHandler(input, regExp) {
  if (input.value === '') {
    formRemoveError(input);
  } else if (!isValidValue(input.value, regExp)) {
    formAddError(input);
    const errorMessage = input.parentElement.querySelector('.error-message');
    errorMessage.textContent = 'Поле заполнено неверно';
  } else {
    formRemoveError(input);
  }
}

// Устанавливаем маску для телефона
IMask(document.getElementById('input-tel'), {
  mask: '+{7} 000 000-00-00',
});
