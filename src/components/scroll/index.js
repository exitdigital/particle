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
import 'rxjs/add/operator/switchMap';


import autobind from 'autobind-decorator';

const
  wheelEvent = 'onwheel' in document ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';


const noop = () => {
};
@autobind
class Scroll {
  current = 0;
  isScrolling = false;
  isFreeScrolling = false;
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

  createSubscription() {
    const length = this.offsets.length - 1;
    const wrapMinMax = v => {
      if (v < 0) {
        return 0;
      } else if (v >= length) {
        return length;
      }
      return v;
    };


    const wheel$ = Observable
      .fromEvent(this.document, wheelEvent, e => e, {passive: false})
      .map(e => {
        const value = e.wheelDelta || -e.deltaY || -e.detail;
        return {direction: Math.max(-1, Math.min(1, value)) * -1, e, source: 'wheel'}
      });


    const createTouchMove$ = originalY => {
      return Observable.fromEvent(this.document, 'touchmove', {passive: false})
        .map(e=> {
          const currentY = e.touches[0].clientY;
          return {
            direction: currentY < originalY ? 1 : -1,
            e,
            source: 'touchmove',
            currentY,
            originalY,
          }
        });
    };

    const touchMove$ =
      Observable.fromEvent(this.document, 'touchstart')
        .switchMap(e => createTouchMove$(e.touches[0].clientY))


    const keyDown$ = Observable
      .fromEvent(this.document, 'keydown')
      .filter(e => {
        return [33, 34, 38, 40].indexOf(e.keyCode) !== -1;
      })
      .map(e => {
        return {
          source: 'keydown',
          direction: [33, 38].indexOf(e.keyCode) !== -1 ? -1 : 1,
          e
        }
      });


    const focusToggles = document.getElementsByClassName('no-scroll-focus');
    Array.prototype.forEach.call(focusToggles, el => {
      el.addEventListener('focus', () => {
        this.isFreeScrolling = true;
      });
      el.addEventListener('blur', () => {
        this.isFreeScrolling = false;
      });
    });
    Observable
      .merge(wheel$, keyDown$, touchMove$)
      .subscribe(({e, direction, source}) => {
        return;
        const current = this.current,
          next = wrapMinMax(current + direction),
          currentOffset = this.offsets[current],
          nextOffset = this.offsets[next],
          scrollTop = this.getScrollTop(),
          heightOffset = this.offsets[wrapMinMax(current + 1)],
          currentHeight = this.heights[current];

        if (currentHeight > this.viewport.h && current !== 0) {
          const distance = (scrollTop + (this.viewport.h * direction) - nextOffset);
          if ((direction === 1 && distance > 0) || (direction === -1 && distance < 0)) {
            this.isFreeScrolling = false;
            e.preventDefault();
          } else {

            this.isFreeScrolling = true;
          }
        } else {
          if (current === 0 && next === 0) {

            this.isFreeScrolling = true;
          } else {
            this.isFreeScrolling = false;
            e.preventDefault();
          }
        }
      });

    const mapNext = ({e, direction, source}) => {
      return {v: wrapMinMax(this.current + direction), source};
    };

    const throttledKeyDown$ = keyDown$
      .throttleTime(500)
      .map(mapNext);

    const throttledTouchMove$ = touchMove$.throttleTime(500)
      .map(mapNext);


    const debouncedScroll$ = Observable
      .fromEvent(this.document, 'scroll')
      .debounceTime(500)
      .map(e => {
        return {v: this.getCurrent(), source: 'scroll'}
      });

    const throttledWheel$ = wheel$
      .throttleTime(500)
      .map(mapNext);

    this.subscription = Observable
      .merge(throttledWheel$, throttledKeyDown$, throttledTouchMove$)
      .distinctUntilChanged()
      .subscribe(({v, source}) => {
        return;
        const {current, isFreeScrolling, isScrolling} = this;
        if (!this.isFreeScrolling && !this.isScrolling && v !== this.current) {
          this.isScrolling = true;
          this.scrollTo(v);
        }
      });
  }

  init({viewport}) {
    this.viewport = viewport;
    this.sections = [];
    this.offsets = [];
    this.heights = [];
    const elements = this.document.getElementsByClassName(this.className);
    Array.prototype.forEach.call(elements, el => {
      const rect = el.getBoundingClientRect();
      this.sections.push(el);
      this.offsets.push(this.getScrollTop() + rect.top)
      this.heights.push(el.offsetHeight);
      if (!el.classList.contains('no-min-height')) {
        el.setAttribute('style', 'min-height:' + viewport.h + 'px');
      }
    });

    if (!this.subscription) {
      this.createSubscription();
    }

    this.scrollTo(this.getCurrent());

  }

  getCurrent() {
    const
      top = document.documentElement['scrollTop'] || document.body['scrollTop'],
      max = this.offsets.length;
    let i = 1,
      closest = 0,
      prev = Math.abs(this.offsets[0] - top),
      diff;

    if (this.getScrollTop() > this.offsets[this.offsets.length - 2]) {
      return this.offsets.length - 1;
    }
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
      duration: 500,
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

