const pLinks = document.querySelectorAll(`.pNumber`);

// кодируем телефон
const pNumber = `tel:88002003346`;
var encode = window.btoa(pNumber);
var decode = window.atob(encode);

for (let pLink of pLinks) {
  pLink.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = decode;
  });
}
