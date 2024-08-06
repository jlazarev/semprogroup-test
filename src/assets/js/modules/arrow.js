const HEIGHT_MARKER = 66;
const items = document.querySelectorAll('.connection__item');

const getCoordinateItemCenter = item => {
  const rect = item.getBoundingClientRect();
  const scrollTop = window.scrollY + rect.y;
  const itemHeight = rect.height;
  const itemCenter = scrollTop + itemHeight / 2;

  return itemCenter;
};

function setHeightArrows() {
  items.forEach((item, index, items) => {
    const arrow = item.querySelector('.arrow');

    if (arrow) {
      if (document.documentElement.clientWidth > 979) {
        const prevItemCenter = getCoordinateItemCenter(item);
        const nextItemCenter = getCoordinateItemCenter(items[index + 1]);
        const heightArrow = nextItemCenter - prevItemCenter - HEIGHT_MARKER;

        arrow.style.height = heightArrow + 'px';
      } else {
        arrow.style.height = 'calc(100% - 61px)';
      }
    }
  });
}

setHeightArrows();

window.addEventListener('resize', setHeightArrows);
