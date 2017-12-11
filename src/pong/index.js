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

  constructor({document, id, viewport}) {
    this.document = document;
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext("2d");
    this.mouse.radius = viewport.w / 20;
    document.body.addEventListener("mousemove", e => {
      this.mouse.position.x = e.clientX;
      this.mouse.position.y = e.clientY;
    });

    document.body.addEventListener("touchstart", e => {
      this.mouse.position.x = e.changedTouches[0].clientX;
      this.mouse.position.y = e.changedTouches[0].clientY;
    }, false);

    document.body.addEventListener("touchmove", e => {
      e.preventDefault();
      this.mouse.position.x = e.targetTouches[0].clientX;
      this.mouse.position.y = e.targetTouches[0].clientY;
    }, false);

    document.body.addEventListener("touchend", e => {
      e.preventDefault();
      this.mouse.position.x = 0;
      this.mouse.position.y = 0;
    }, false);
  }

  init({viewport}) {
    this.viewport = viewport;
    this.canvas.width = viewport.w;
    this.canvas.height = viewport.h;
    const {context, document} = this;
    this.text = new Text({viewport, context, document});
    const paddle = new Paddle({viewport});
    this.ball = new Ball({viewport, context, paddle});
    this.mouse.radius = this.ball.particle.radius ;
    this.paddle = paddle;
    this.render();
  }

  render() {
    const {context, text, paddle, ball, viewport, mouse} = this;
    context.clearRect(0, 0, viewport.w, viewport.h);
    ball.render({context, viewport, paddle});
    paddle.render({context, ball, viewport});
    text.render({context, ball, mouse});
    requestAnimationFrame(this.render);

  }
}

export default Pong;

