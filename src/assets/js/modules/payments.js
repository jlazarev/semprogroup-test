const infoAutosBlocks = document.querySelectorAll('.info-autos');
const infoRealtyBlocks = document.querySelectorAll('.info-realty');

const infoAutosPics = document.querySelectorAll('.info-autos-pic');
const infoRealtyPics = document.querySelectorAll('.info-realty-pic');

const hoverInfo = (infoBlock, infoPics) => {
  infoBlock.addEventListener('mouseover', () => {
    infoPics.forEach(pic => {
      pic.classList.add('info-pic-active');
    });
  });

  infoBlock.addEventListener('mouseout', () => {
    infoPics.forEach(pic => {
      pic.classList.remove('info-pic-active');
    });
  });
};

infoAutosBlocks.forEach(infoAutos => {
  hoverInfo(infoAutos, infoAutosPics);
});

infoRealtyBlocks.forEach(infoRealty => {
  hoverInfo(infoRealty, infoRealtyPics);
});
