function initTouchInputHandling() {
  x0 = null;
  xy = null;
  /**
   * Detect the starting coordinate of the touch gesture
   */
  function handleTouchStart(evt) {
    const touch = evt.touches[0];
    x0 = touch.clientX;
    y0 = touch.clientY;
  }

  /**
   * Figure out the direction of the gesture from the delta
   */
  function handleTouchMove(evt) {
    if (x0 == null || y0 == null) return;

    const x1 = evt.touches[0].clientX;
    const y1 = evt.touches[0].clientY;
    const xD = x0 - x1;
    const yD = y0 - y1;

    if (Math.abs(xD) > Math.abs(yD)) {
      if (xD > 0) Game.move("ArrowLeft");
      else Game.move("ArrowRight");
    } else {
      if (yD > 0) Game.move("ArrowUp");
      else Game.move("ArrowDown");
    }
    x0 = null;
    y0 = null;

    evt.preventDefault();
  }

  const app = document.getElementById("app");

  app.addEventListener("touchstart", handleTouchStart, false);
  app.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });
}

initTouchInputHandling();
