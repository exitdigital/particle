import Velocity from 'velocity-animate';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';


import autobind from 'autobind-decorator';

const
  wheelEvent = 'onwheel' in document ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';


const noop = () => {
};
@autobind
class Scroll {
  current = 0;
  isScrolling = false;
  className = null;
  document = null;
  sections = [];
  offsets = [];
  subscription = null;
  begin = null;
  complete = null;

  constructor({document, className, begin = noop, complete = noop}) {
    this.className = className;
    this.document = document;
    this.begin = begin;
    this.complete = complete;
    this.body = document.getElementsByTagName("BODY")[0];
  }

  getScrollTop() {
    return this.document.documentElement['scrollTop'] || this.document.body['scrollTop'];
  }

  init() {
    if (this.subscription) {
      this.subscription.cancel();
    }
    const elements = this.document.getElementsByClassName(this.className);
    Array.prototype.forEach.call(elements, el => {
      const rect = el.getBoundingClientRect();
      this.sections.push(el);
      this.offsets.push(this.getScrollTop() + rect.top)
    });

    this.scrollTo(this.calculateNearest());

    const length = this.offsets.length - 1;

    const wrapMinMax = v => {
      if (v < 0) {
        return 0;
      } else if (v >= length) {
        return length;
      }
      return v;
    };

    const filter = v => {
      return v !== this.current && !this.isScrolling;
    };

    const wheel$ = Observable
      .fromEvent(this.document, wheelEvent)
      .do(e => {
        e.preventDefault();
      })
      .throttleTime(500)
      .map(e => {
        const value = e.wheelDelta || -e.deltaY || -e.detail;
        const direction = Math.max(-1, Math.min(1, value)) * -1;
        return wrapMinMax(this.current + direction);
      });

    const keyDown$ = Observable
      .fromEvent(this.document, 'keydown')
      .filter(e => {
        return [33, 34, 38, 40].indexOf(e.keyCode) !== -1;
      })
      .do(e => {
        e.preventDefault();
      })
      .throttleTime(500)
      .map(e => {
        const direction = [33, 38].indexOf(e.keyCode) !== -1 ? -1 : 1;
        return wrapMinMax(this.current + direction);
      });

    const scroll$ = Observable
      .fromEvent(this.document, 'scroll')
      .do(e => {
        e.preventDefault();
      })
      .debounceTime(250)
      .map(e => {
        return this.calculateNearest();
      });


    this.subscription = Observable
      .merge(wheel$, keyDown$, scroll$)
      .filter(filter)
      .distinctUntilChanged()
      .subscribe(v => {
        if (this.isScrolling) {
          return false;
        }
        this.isScrolling = true;
        this.scrollTo(v);
      })
    this.current = this.calculateNearest();
  }


  calculateNearest() {
    const
      top = document.documentElement['scrollTop'] || document.body['scrollTop'],
      max = this.offsets.length;
    let i = 1,
      closest = 0,
      prev = Math.abs(this.offsets[0] - top),
      diff;

    for (; i < max; i++) {
      diff = Math.abs(this.offsets[i] - top);
      if (diff < prev) {
        prev = diff;
        closest = i;
      }
    }
    return closest;
  }


  getSection(i) {
    return this.sections[i];
  }

  scrollTo(i) {
    const last = this.current;
    const next = i;
    this.begin(last, next);
    const options = {
      duration: 1100,
      mobileHA: false,
      easing: "easeOutExpo",
      complete: () => {
        this.current = i;
        this.isScrolling = false;
        this.complete(last, next);
      }
    };
    Velocity(this.getSection(i), 'scroll', options);
  }

  next() {

  }

  prev() {

  }
}

export default Scroll;

