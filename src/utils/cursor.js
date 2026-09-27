import { isEqual } from "lodash-es";

const lerp = (a, b, n) => {
  if (Math.round(a) === b) {
    return b;
  }

  return (1 - n) * a + n * b;
};

const cursorInit = () => new Cursor();

class Cursor {
  constructor() {
    this.pos = {
      curr: null,
      prev: null,
    };
    this.animationFrame = null;
    this.destroyed = false;

    this.handleMouseMove = (event) => {
      if (this.pos.curr === null) {
        this.move(
          event.clientX - 8,
          event.clientY - 8,
        );
      }

      this.pos.curr = {
        x: event.clientX - 8,
        y: event.clientY - 8,
      };
      this.cursor.classList.remove("hidden");
      this.render();
    };
    this.handleMouseEnter = () =>
      this.cursor.classList.remove("hidden");
    this.handleMouseLeave = () =>
      this.cursor.classList.add("hidden");
    this.handleMouseDown = () =>
      this.cursor.classList.add("active");
    this.handleMouseUp = () =>
      this.cursor.classList.remove("active");

    this.create();
    this.bind();
  }

  move(left, top) {
    this.cursor.style.left = `${left}px`;
    this.cursor.style.top = `${top}px`;
  }

  create() {
    this.cursor = document.createElement("div");
    this.cursor.id = "cursor";
    this.cursor.classList.add("xs-hidden", "hidden");
    document.body.append(this.cursor);

    this.style = document.createElement("style");
    this.style.textContent =
      `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'><circle cx='4' cy='4' r='4' fill='white' /></svg>") 4 4, auto !important}`;
    document.body.append(this.style);
  }

  bind() {
    document.addEventListener(
      "mousemove",
      this.handleMouseMove,
    );
    document.addEventListener(
      "mouseenter",
      this.handleMouseEnter,
    );
    document.addEventListener(
      "mouseleave",
      this.handleMouseLeave,
    );
    document.addEventListener(
      "mousedown",
      this.handleMouseDown,
    );
    document.addEventListener(
      "mouseup",
      this.handleMouseUp,
    );
  }

  render() {
    if (
      this.destroyed ||
      this.animationFrame !== null
    ) {
      return;
    }

    const animate = () => {
      this.animationFrame = null;

      if (this.destroyed || !this.pos.curr) {
        return;
      }

      if (this.pos.prev) {
        this.pos.prev.x = lerp(
          this.pos.prev.x,
          this.pos.curr.x,
          0.35,
        );
        this.pos.prev.y = lerp(
          this.pos.prev.y,
          this.pos.curr.y,
          0.35,
        );
        this.move(
          this.pos.prev.x,
          this.pos.prev.y,
        );
      } else {
        this.pos.prev = { ...this.pos.curr };
      }

      if (!isEqual(this.pos.curr, this.pos.prev)) {
        this.animationFrame =
          window.requestAnimationFrame(animate);
      }
    };

    this.animationFrame =
      window.requestAnimationFrame(animate);
  }

  destroy() {
    this.destroyed = true;

    if (this.animationFrame !== null) {
      window.cancelAnimationFrame(
        this.animationFrame,
      );
    }

    document.removeEventListener(
      "mousemove",
      this.handleMouseMove,
    );
    document.removeEventListener(
      "mouseenter",
      this.handleMouseEnter,
    );
    document.removeEventListener(
      "mouseleave",
      this.handleMouseLeave,
    );
    document.removeEventListener(
      "mousedown",
      this.handleMouseDown,
    );
    document.removeEventListener(
      "mouseup",
      this.handleMouseUp,
    );

    this.style?.remove();
    this.cursor?.remove();
  }
}

export default cursorInit;
