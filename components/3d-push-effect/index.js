const threeDCard = document.getElementById('ThreeDCard');

threeDCard.addEventListener('mousemove', throttle(handleMouseMove, 200));
threeDCard.addEventListener('mouseleave', handleMouseLeave);

function handleMouseMove(e) {
  const target = e.target.matches('#ThreeDCard')
    ? e.target
    : e.target.closest('#ThreeDCard');

  requestAnimationFrame(() => {
    const { x, y } = splitSquare(target);
    target.style.transform = `scale(1.5) rotateY(${x}deg) rotateX(${y}deg)`;
  });

  function splitSquare() {
    const rect = target.getBoundingClientRect();

    // De cima para baixo da esquerda para direita
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midWidth = Math.floor(rect.width / 2);
    const midHeight = Math.floor(rect.height / 2);

    let finalX, finalY;

    /**
     * Makes the beginning of X be on the center.
     */

    const newRange = { min: 0, max: 32 };

    if (x > midWidth) {
      finalX = limitRange(
        newRange,
        {
          min: 0,
          max: midWidth,
        },
        x - midWidth
      );
    } else {
      finalX = -limitRange(
        newRange,
        {
          min: 0,
          max: midWidth,
        },
        midWidth - x
      );
    }

    if (y > midHeight) {
      finalY = -limitRange(
        newRange,
        {
          min: 0,
          max: midHeight,
        },
        y - midHeight
      );
    } else {
      finalY = limitRange(
        newRange,
        {
          min: 0,
          max: midHeight,
        },
        midHeight - y
      );
    }

    return { x: finalX, y: finalY };
  }

  function limitRange(newRange, oldRange, value) {
    return (
      ((value - oldRange.min) * (newRange.max - newRange.min)) /
        (oldRange.max - oldRange.min) +
      0
    );
  }
}

function handleMouseLeave(e) {
  const target = e.target.matches('#ThreeDCard')
    ? e.target
    : e.target.closest('#ThreeDCard');

    target.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
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
