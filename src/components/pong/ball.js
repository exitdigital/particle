import autobind from 'autobind-decorator';
import Particle from './particle';

@autobind
class Ball {

  logoRatio = 533.9 / 18.185;

  constructor({viewport, paddle, text}) {
    this.radius = text.width / this.logoRatio;
    const options = {
      x: viewport.w / 2,
      y: viewport.h - paddle.height - this.radius,
      speed: Math.max(2, Math.min(7, Math.ceil((viewport.w * viewport.h) / 100000))),
      direction: 0.8 * Math.PI * 2
    };
    this.particle = new Particle(options);
    this.particle.radius = this.radius + 10;

  }

  render({context, viewport, paddle}) {
    const {particle} = this;
    particle.update();

    context.beginPath();
    context.arc(particle.position.getX(), particle.position.getY(), this.radius, 0, Math.PI * 2, false);
    context.fillStyle = '#ff0000';
    context.fill();
    context.closePath();

    if (particle.position.getX() + this.radius > viewport.w) {
      particle.position.setX(viewport.w - this.radius);
      particle.velocity.setX(particle.velocity.getX() * particle.bounce);
    }
    if (particle.position.getX() - this.radius < 0) {
      particle.position.setX(this.radius);
      particle.velocity.setX(particle.velocity.getX() * particle.bounce);
    }
    if (particle.position.getY() + this.radius + paddle.height > viewport.h) {
      particle.position.setY(viewport.h - this.radius - paddle.height);
      particle.velocity.setY(particle.velocity.getY() * particle.bounce);
    }
    if (particle.position.getY() - this.radius < 0) {
      particle.position.setY(this.radius);
      particle.velocity.setY(particle.velocity.getY() * particle.bounce);
    }


  }
}

export default Ball;

