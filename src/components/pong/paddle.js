import autobind from 'autobind-decorator';
import Particle from './particle';

@autobind
class Paddle {

  ratio = 533.9 / 218.12;
  logoRatio = 218.12 / 29.01;

  constructor({viewport, text}) {

    this.height = text.height / this.logoRatio;
    this.width = this.height * 5.5;
    const options = {
      x: viewport.w / 2 - (this.width / 2),
      y: viewport.h - this.height,
    };

    this.particle = new Particle(options);
  }

  render({context, ball, viewport}) {
    const {particle} = this;

    context.beginPath();
    context.fillStyle = '#400ddd';
    context.fillRect(particle.position.getX(), particle.position.getY(), this.width, this.height);
    context.closePath();

    particle.position.setX(ball.particle.position.getX() - (this.width / 2));

    if (particle.position.getX() < 0) {
      particle.position.setX(0);
    }

    if (particle.position.getX() + this.width > viewport.w) {
      particle.position.setX(viewport.w - this.width);
    }
  }
}

export default Paddle;

