const $list = document.querySelector('.card-list');

const clone = $list.querySelector('.card').cloneNode(true);
const queue = createNotificationQueue({
  container: '.card-list',
  target: '.card',
  removeTarget: '.close',
});

queue
  .beforeRemove(function removeCard(
    { target, relatedTargets, container },
    end
  ) {
    queue.addItem(clone.cloneNode(true));

    target.classList.add('remove');
    target.addEventListener('transitionend', fireAnimation);

    function fireAnimation() {
      target.removeEventListener('transitionend', fireAnimation);

      requestAnimationFrame(() => {
        prepareAnimation();
        requestAnimationFrame(startAnimation);

        /**
         * The target is just removed visually, but it's still in the DOM
         * being animated with the others cards.
         */
        target.addEventListener('transitionend', () =>
          requestAnimationFrame(endAnimation)
        );
      });
    }

    function prepareAnimation() {
      const startPositions = relatedTargets.map(i => i.getBoundingClientRect());

      target.classList.add('removed');

      relatedTargets.forEach(($item, index) => {
        const endPosition = $item.getBoundingClientRect();
        const x = startPositions[index].left - endPosition.left;
        const y = startPositions[index].top - endPosition.top;
        $item.style.transform = `translate(${x}px, ${y}px)`;
      });
    }

    function startAnimation() {
      relatedTargets.forEach(i => (i.style.transform = ''));
      container.classList.add('removing-card');
    }

    function endAnimation() {
      container.classList.remove('removing-card');

      /**
       * The end function lets us remove the target from the DOM,
       * only after our animation is finished.
       */
      requestAnimationFrame(end);
    }
  })
  .afterAdd(function addCard({ target, container }, end) {
    /**
     * The target is already in the DOM, but it's visible
     */

    target.classList.add('add');

    requestAnimationFrame(() => {
      container.classList.add('adding-card');
      target.classList.remove('add');

      target.addEventListener('transitionend', function transitionend() {
        target.removeEventListener('transitionend', transitionend);

        requestAnimationFrame(() => {
          container.classList.remove('adding-card');
          end();
        });
      });
    });
  });

$list.addEventListener('click', function (e) {
  if (!e.target.matches('.close')) return;
  queue.removeItem(e.target.closest('.card'));
});

function createNotificationQueue({ container, target }) {
  const $container = document.querySelector(container);

  const notificationQueue = {
    addItem,
    removeItem,
    beforeAdd: addListener.bind(undefined, 'beforeAdd'),
    afterAdd: addListener.bind(undefined, 'afterAdd'),
    beforeRemove: addListener.bind(undefined, 'beforeRemove'),
    afterRemove: addListener.bind(undefined, 'afterRemove'),
  };

  const queue = createQueue('add', 'remove');
  let state = 'idle';

  let listenerSet = {
    beforeAdd: null,
    afterAdd: null,
    beforeRemove: null,
    afterRemove: null,
  };

  function removeItem(item) {
    if (!item || !item.parentElement) return;

    if (state !== 'idle') {
      if (queue.has('remove', item)) return;
      return queue.enqueue('remove', item);
    }

    state = 'removing-item';

    const event = {
      target: item,
      relatedTargets: Array.from($container.querySelectorAll(target)),
      container: $container,
    };

    fireListeners('beforeRemove', event, () => {
      item.remove();
      fireListeners('afterRemove', event, () => {
        state = 'idle';
        if (!queue.empty('remove')) return removeItem(queue.dequeue('remove'));
        if (!queue.empty('add')) return addItem(queue.dequeue('add'));
      });
    });
  }

  function addItem(item) {
    if (state !== 'idle') {
      if (queue.has('add', item)) return;
      return queue.enqueue('add', item);
    }

    state = 'adding-item';

    const event = {
      target: item,
      relatedTargets: Array.from($container.querySelectorAll(target)),
      container: $container,
    };

    fireListeners('beforeAdd', event, () => {
      $container.insertAdjacentElement('beforeend', item);
      fireListeners('afterAdd', event, () => {
        state = 'idle';
        if (!queue.empty('add')) return addItem(queue.dequeue('add'));
        if (!queue.empty('remove')) return removeItem(queue.dequeue('remove'));
      });
    });
  }

  function addListener(listener, cb) {
    if (typeof listener != 'string' || typeof cb != 'function')
      return notificationQueue;

    if (!(listener in listenerSet)) return notificationQueue;
    if (listenerSet[listener] == null) listenerSet[listener] = [];
    listenerSet[listener].push(cb);

    return notificationQueue;
  }

  function fireListeners(name, ...args) {
    if (typeof name != 'string') return;

    const endCallback =
      typeof args[args.length - 1] == 'function' ? args.pop() : null;
    if (!listenerSet[name]) return endCallback && endCallback();

    let finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      endCallback && endCallback();
    }

    try {
      args.push(finish);

      for (const listener of listenerSet[name]) {
        if (finished) break;
        listener.apply(null, args);
      }
    } catch (err) {
      console.error(err);
      finish();
    }
  }

  return notificationQueue;
}

function createQueue(...queues) {
  const queueSet = {};

  (function init() {
    queues.forEach(setQueue);
  })();

  function setQueue(name) {
    if (name in queueSet) return;
    queueSet[name] = [];
  }

  function getQueue(name) {
    return queueSet[name];
  }

  function enqueue(name, ...rest) {
    if (!(name in queueSet)) return;
    queueSet[name].push.apply(queueSet[name], rest);
  }

  function dequeue(name) {
    if (!(name in queueSet)) return;
    return queueSet[name].pop();
  }

  function has(name, item) {
    if (!(name in queueSet)) return false;
    return ~queueSet[name].indexOf(item);
  }

  function empty(name) {
    return !(name in queueSet) || queueSet[name].length === 0;
  }

  return {
    has,
    empty,
    enqueue,
    dequeue,
    get: getQueue,
    set: setQueue,
  };
}
