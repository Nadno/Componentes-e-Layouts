import getItems from './api.js';

const $list = document.querySelector('.list');
let lastItemIndex = 0;

const requestItems = throttle(async () => {
  const itemsPerRequest = 5;
  const items = await getItems(lastItemIndex, itemsPerRequest);

  items.forEach(({ item, index }) => {
    $list.insertAdjacentHTML('beforeend', `<li class="list-item">${item}</li>`);
    lastItemIndex = index + 1;
  });
}, 250);

requestItems();
createScrollEndListener('.list', requestItems);

function createScrollEndListener(elementQuery, callback) {
  const $list = document.querySelector(elementQuery);

  const handleScrollEnd = throttle(e => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    if (scrollTop + offsetHeight >= scrollHeight - 140) {
      callback(e.target);
    }
  }, 1000);

  $list.addEventListener('scroll', handleScrollEnd);
}

function throttle(fn, ms) {
  let wait = false;

  return function () {
    if (wait) return;

    fn.apply(this, arguments);

    wait = !wait;
    setTimeout(() => (wait = !wait), ms);
  };
}
