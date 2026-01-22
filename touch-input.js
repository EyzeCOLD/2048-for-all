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
  handleTouchStart(e) {
    const touch = e.touches;
    this.x0 = touch.clientX;
    this.y0 = touch.clientY;
  },

  /**
   * Figure out the direction of the gesture from the delta
   */
  handleTouchMove(e) {
    if (!this.x0 || !this.y0) return;

    const x1 = e.touches[0].clientX;
    const y1 = e.touches[0].clientY;
    const xD = this.x0 - x1;
    const yD = this.y0 - y1;

    if (Math.abs(xD) > Math.abs(yD)) {
      if (xD > 0) Game.move("ArrowLeft");
      else Game.move("ArrowRight");
    } else {
      if (yD > 0) Game.move("ArrowUp");
      else Game.move("ArrowDown");
    }
    this.x0 = null;
    this.y0 = null;

    e.preventDefault();
  },
};
