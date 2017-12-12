import Velocity from 'velocity-animate';

import autobind from 'autobind-decorator';

@autobind
class Header {
  el = null;
  isVisible = false;

  constructor({el}) {
    this.el = el;
  }


  hide() {
    if (!this.isVisible) {
      return;
    }
    Velocity(this.el, 'fadeOut', {
      duration: 50, complete: () => {
        this.isVisible = false;
      }
    });
  }

  show() {

    if (this.isVisible) {
      return;
    }
    Velocity(this.el, 'fadeIn', {
      duration: 750, complete: () => {
        this.isVisible = true;
      }
    });
  }

}

export default Header;

