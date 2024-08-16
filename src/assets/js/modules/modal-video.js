const videoBtn = document.querySelector('.about__video-btn');
const modalVideo = document.querySelector('.video');
const body = document.querySelector('.page-body');

if (modalVideo) {
  const modalIn = modalVideo.querySelector('.video__wrapper');
  const video = modalIn.querySelector("#video");

  videoBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    modalVideo.classList.add('video--open');

    if (video.requestFullscreen) {
        video.requestFullscreen(); // Chrome
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen(); // Safari
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen(); // IE/Edge
    };

    video.play();
  });

  modalVideo.addEventListener('click', function (evt) {
    if (evt.target !== modalIn) {
      modalVideo.classList.remove('video--open');
      video.pause();
    }
  });

  modalIn.addEventListener('click', function (evt) {
    evt.stopPropagation();
  });
}
