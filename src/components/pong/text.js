import autobind from 'autobind-decorator';

import Particle from './particle';

@autobind
class Text {
  ratio = 533.9 / 218.12;
  scrollDownRatio = 331 / 31;
  friction = 0.95;
  ease = 0.19;
  spacing = 4;
  size = 4;
  color = "#400ddd";
  particles = [];

  constructor({viewport, context, document}) {
    this.viewport = viewport;
    this.source = document.getElementById('logo-text');
    this.scrollDown = document.getElementById('scroll-down');
    this.particles = [];
    this.width = viewport.w * 0.5;
    this.height = this.width / this.ratio;
    this.size = Math.max(2, Math.floor((this.width * this.height) / 27564));
    this.spacing = this.size;
    this.x = viewport.w / 2 - this.width * .5;
    this.y = viewport.h / 2 - this.height * .5;

    if (this.height > this.viewport.h / 2) {
      this.height = this.viewport.h / 2;
      this.width = this.height * this.ratio;
      this.size = Math.max(2, Math.floor((this.width * this.height) / 27564));
      this.spacing = this.size;
      this.x = viewport.w / 2 - this.width * .5;
      this.y = viewport.h / 2 - this.height * .5;
    }

    context.drawImage(this.source, this.x, this.y, this.width, this.height);
    var pixels = context.getImageData(0, 0, viewport.w, viewport.h).data;
    var index;
    var x, y;

    for (y = 0; y < viewport.h; y += this.spacing) {
      for (x = 0; x < viewport.w; x += this.spacing) {
        index = (y * viewport.w + x) * 4;
        if (pixels[++index] > 0) {
          this.particles.push(new Particle({x, y}));
        }
      }
    }

    context.clearRect(0, 0, viewport.w, viewport.h);
  }


  updateParticle(p, item) {

    const itemX = item.position.x;
    const itemY = item.position.y;
    const itemRadius = Math.pow(item.radius, 2);
    const x = p.position.getX();
    const y = p.position.getY();
    const rx = itemX - x;
    const ry = itemY - y;
    const distance = rx * rx + ry * ry;
    const force = -itemRadius / distance;
    if (distance < itemRadius) {
      const angle = Math.atan2(ry, rx);
      p.vx += force * Math.cos(angle);
      p.vy += force * Math.sin(angle);
    }
    p.position.x += (p.vx *= this.friction) + (p.originX - p.position.x) * this.ease;

    p.position.y += (p.vy *= this.friction) + (p.originY - p.position.y) * this.ease;
  };


  render({context, viewport, ball, paddle, mouse}) {

    const bottom = this.y + this.height,
      scrollWidth = Math.max(120, this.width * 0.5),
      scrollHeight = scrollWidth / this.scrollDownRatio;
    const top = bottom + ((viewport.h - bottom) / 2) - (scrollHeight / 2) - (paddle.height / 2);
    this.scrollDown.setAttribute("style", "opacity:1;top: " + top + "px; height:" + scrollHeight + 'px; width:' + scrollWidth + 'px')
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      context.fillStyle = this.color;
      context.fillRect(p.position.getX(), p.position.getY(), this.size, this.size);
      this.updateParticle(p, ball.particle);
      this.updateParticle(p, mouse);
    }

  }
}

export default Text;

