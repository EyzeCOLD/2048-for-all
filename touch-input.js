document.addEventListener("touchstart", TouchInput.handleTouchStart, false);
document.addEventListener("touchmove", TouchInput.handleTouchMove, {
  passive: false,
});

const TouchInput = {
  x0: null,
  y0: null,

  /**
   * Detect the starting coordinate of the touch gesture
   */
  handleTouchStart(evt) {
    const touch = evt.touches[0];
    TouchInput.x0 = touch.clientX;
    TouchInput.y0 = touch.clientY;
  },

  /**
   * Figure out the direction of the gesture from the delta
   */
  handleTouchMove(evt) {
    if (!TouchInput.x0 || !TouchInput.y0) return;

    const x1 = evt.touches[0].clientX;
    const y1 = evt.touches[0].clientY;
    const xD = TouchInput.x0 - x1;
    const yD = TouchInput.y0 - y1;

    if (Math.abs(xD) > Math.abs(yD)) {
      if (xD > 0) Game.move("ArrowLeft");
      else Game.move("ArrowRight");
    } else {
      if (yD > 0) Game.move("ArrowUp");
      else Game.move("ArrowDown");
    }
    TouchInput.x0 = null;
    TouchInput.y0 = null;

    evt.preventDefault();
  },
};
