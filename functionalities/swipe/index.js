const box = document.querySelector('.box');
const container = document.querySelector('.container');

const boxTouch = createTouchListener(box, 200);

boxTouch
  .on('left', () => {
    container.classList.add('left');
    container.classList.remove('right');
  })
  .on('left', target => (target.textContent = 'left'))
  .on('right', () => {
    container.classList.add('right');
    container.classList.remove('left');
  })
  .on('right', target => (target.textContent = 'right'));

boxTouch
  .on('up', () => {
    container.classList.add('up');
    container.classList.remove('down');
  })
  .on('up', target => (target.textContent = 'up'))
  .on('down', () => {
    container.classList.add('down');
    container.classList.remove('up');
  })
  .on('down', target => (target.textContent = 'down'));

function createTouchListener(element, timeout = 500) {
  const client = {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  };

  const observers = {
    left: [],
    right: [],
    up: [],
    down: [],
  };

  let startedTimestamp = 0;

  element.addEventListener('touchstart', e => {
    Object.assign(client.start, {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });

    startedTimestamp = e.timeStamp;
  });

  element.addEventListener('touchmove', e => {
    Object.assign(client.end, {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  });

  element.addEventListener('touchend', handleTouchEnd);

  function handleTouchEnd(e) {
    const cantHandleEnd = e.timeStamp - startedTimestamp >= timeout;
    if (cantHandleEnd) return;

    if (!client.start.x || !client.start.y) return;

    const direction = getSwipeDirection(getPositionDiff(client));
    observers[direction].forEach(cb => cb(e.target));

    client.start.x = null;
    client.start.y = null;
  }

  function getPositionDiff(client) {
    return {
      x: client.start.x - client.end.x,
      y: client.start.y - client.end.y,
    };
  }

  function getSwipeDirection(diff) {
    let result = '';

    const isHorizontallySwiped = Math.abs(diff.x) > Math.abs(diff.y);
    if (isHorizontallySwiped) {
      result = diff.x > 0 ? 'left' : 'right';
      return result;
    }

    result = diff.y > 0 ? 'up' : 'down';
    return result;
  }

  return {
    on(observerName, cb) {
      if (!(observerName in observers)) return this;
      observers[observerName].push(cb);
      return this;
    },

    off(observerName, targetCb) {
      if (!(observerName in observers)) return this;
      observers[observerName] = observers[observerName].filter(
        cb => cb !== targetCb
      );
    },
  };
}
