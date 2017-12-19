import autobind from 'autobind-decorator';
import Text from './text';
import Ball from './ball';
import Paddle from './paddle';


@autobind
class Pong {
  mouse = {
    position: {x: 0, y: 0},
    radius: 100
  };

  constructor({document, id, scroll}) {
    this.document = document;
    this.scroll = scroll;
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext("2d");
    document.body.addEventListener("mousemove", e => {
      this.mouse.position.x = e.clientX;
      this.mouse.position.y = e.clientY;
    });

  }

  init({viewport}) {
    this.viewport = viewport;
    this.canvas.width = viewport.w;
    this.canvas.height = viewport.h;
    const {context, document} = this;
    const text = new Text({viewport, context, document});
    const paddle = new Paddle({viewport, text});
    this.ball = new Ball({viewport, context, paddle, text});

    this.text = text;
    this.mouse.radius = this.ball.particle.radius;
    this.paddle = paddle;

    this.render();
  }

  render() {
    const {context, text, paddle, ball, viewport, mouse} = this;

    if (this.scroll.getScrollTop() === 0) {
      context.clearRect(0, 0, viewport.w, viewport.h);
      ball.render({context, viewport, paddle});
      paddle.render({context, ball, viewport});
      text.render({context, ball, mouse, viewport, paddle});
    }
    requestAnimationFrame(this.render);

  }
}

export default Pong;

