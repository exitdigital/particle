import Velocity from 'velocity-animate';
import autobind from 'autobind-decorator';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/merge';

@autobind
class Menu {
  document = null;
  scroll = null;
  scrollTop = 0;
  current = 0;

  constructor({document, el, scroll, toggles}) {
    this.document = document;
    this.el = el;
    this.toggles = toggles;
    this.scroll = scroll;
    let stream$ = Observable.empty();

    Array.prototype.forEach.call(toggles, el => {
      stream$ = stream$.merge(Observable.fromEvent(el, 'click'));
    });

    stream$.subscribe(this.toggle);
  }

  toggle(e) {
    if (!this.el.classList.contains('active')) {
      e.preventDefault();
    }
    this.el.classList.toggle('active');
  }
}

export default Menu;

