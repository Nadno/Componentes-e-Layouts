const threeDCard = document.getElementById('ThreeDCard');
addPushEffectListener(threeDCard);

function addPushEffectListener(element) {
  element.addEventListener('mousemove', throttle(pushEffect, 200));
  element.addEventListener('mouseleave', resetPushEffect);

  function pushEffect(e) {
    const target = e.target.matches('#ThreeDCard')
      ? e.target
      : e.target.closest('#ThreeDCard');

    const rect = target.getBoundingClientRect();
    const relativeClient = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const splitted = splitCoordinates(rect, relativeClient);
    const transform = coordinatesToTransformValues(splitted);

    requestAnimationFrame(() => {
      target.style.transform = `
        scale(1.5) 
        rotateY(${transform.rotateY}deg)
        rotateX(${transform.rotateX}deg)
      `;
    });
  }

  function splitCoordinates(rect, relativeClient) {
    const halfWidth = Math.floor(rect.width / 2);
    const halfHeight = Math.floor(rect.height / 2);

    const isRightSide = relativeClient.x > halfWidth,
      isBottomSide = relativeClient.y > halfHeight;

    /**
     * Split de X and Y axle into 2, and makes the coordinates
     * start from de center of each axle.
     * So, either from center to left or right, initiates with 0
     * and finishes with the half element width.
     */
    const splittedX = isRightSide
      ? relativeClient.x - halfWidth
      : halfWidth - relativeClient.x;

    const splittedY = isBottomSide
      ? relativeClient.y - halfHeight
      : halfHeight - relativeClient.y;

    return {
      isRightSide,
      isBottomSide,
      width: halfWidth,
      height: halfHeight,
      client: { x: splittedX, y: splittedY },
    };
  }

  function coordinatesToTransformValues(splitted) {
    const overlapped = overlapCoordinatesRange({ min: 0, max: 32 }, splitted);

    /**
     * The negative coordinates lets us to use them to push the
     * element (using transform property) to the current side that the cursos it's positioned.
     */
    return {
      rotateX: splitted.isBottomSide ? -overlapped.y : overlapped.y,
      rotateY: splitted.isRightSide ? overlapped.x : -overlapped.x,
    };
  }

  function overlapCoordinatesRange(range, splitted) {
    const axleXRange = { min: 0, max: splitted.width };
    const axleYRange = { min: 0, max: splitted.height };

    return {
      x: limitRange(range, axleXRange, splitted.client.x),
      y: limitRange(range, axleYRange, splitted.client.y),
    };
  }

  /**
   * Create a new range for the value passed given a
   * old and the new range {min, max}.
   * @param {Object} newRange
   * @param {number} newRange.min
   * @param {number} newRange.max
   * @param {Object} oldRange
   * @param {number} oldRange.min
   * @param {number} oldRange.max
   * @param {number} value - The value to be limited
   */
  function limitRange(newRange, oldRange, value) {
    return (
      ((value - oldRange.min) * (newRange.max - newRange.min)) /
        (oldRange.max - oldRange.min) +
      0
    );
  }

  function resetPushEffect(e) {
    const target = e.target.matches('#ThreeDCard')
      ? e.target
      : e.target.closest('#ThreeDCard');

    target.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
  }
}

function throttle(callback, limit) {
  var waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(function () {
        waiting = false;
      }, limit);
    }
  };
}
