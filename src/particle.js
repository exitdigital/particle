import Vector from './vector';

class Particle {
  position = null;
  velocity = null;
  mass = null;
  friction = 1;
  gravity = 0;
  bounce = 0;
  vx = 0;
  vy = 0;
  originX = 0;
  originY = 0;

  constructor({
    x = 0,
    y = 0,
    speed = 0,
    direction = 0,
    gravity = 0,
  }) {
    this.originX = x;
    this.originY = y;
    this.position = new Vector(x, y);
    this.setGravity(gravity);
    this.setVelocity(speed, direction);
    this.setGravity(gravity);
    this.bounce = -1;
  }

  setVelocity(speed, direction) {
    this.velocity = new Vector(0, 0);
    this.velocity.setLength(speed);
    this.velocity.setAngle(direction);
  }

  setGravity(gravity) {
    this.gravity = new Vector(0, gravity);
  }

  accelerate(accel) {
    this.velocity.addTo(accel);
  }

  update() {
    this.velocity.multiplyBy(this.friction);
    this.velocity.addTo(this.gravity);
    this.position.addTo(this.velocity);
  }

  angleTo(p2) {
    return Math.atan2(p2.position.getY() - this.position.getY(), p2.position.getX() - this.position.getX());
  }

  distanceTo(p2) {
    var dx = p2.position.getX() - this.position.getX(),
      dy = p2.position.getY() - this.position.getY();

    return Math.sqrt(dx * dx + dy * dy);
  }

  gravitateTo(p2) {
    var grav = new Vector(0, 0),
      dist = this.distanceTo(p2);

    grav.setLength(p2.mass / (dist * dist));
    grav.setAngle(this.angleTo(p2));
    this.velocity.addTo(grav);
  }
}

export default Particle;