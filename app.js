import Scroll from './src/scroll';
import Header from './src/header';
import Pong from './src/pong';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import styles from './app.scss';
import ScrollReveal from 'scrollreveal';


if (typeof window !== 'undefined') {

  const getViewport = () => {
    return {
      w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    };
  };

  const setBodyFontSize = viewport => {
    const baseSize = 16,
      baseWidth = 1920,
      ratio = Math.max(1, baseWidth / viewport.w),
      size = baseSize / ratio,
      el = window.document.getElementsByTagName("HTML")[0];
    el.style.display = 'none';
    el.style.fontSize = size + 'px';
    window.getComputedStyle(el);
    el.style.display = '';
  };

  const init = viewport => {
    const header = new Header({el: document.getElementById('header')});
    setBodyFontSize(viewport);
    const begin = (last, next) => {
      if (next === 0) {
        header.hide();
      }
    };

    const complete = (last, next) => {
      if (next !== 0) {
        header.show();
      }
    };

    const scroll = new Scroll(
      {
        document,
        className: 'section',
        begin,
        complete
      });
    const pong = new Pong({document, id: 'pong', viewport});

    pong.init({viewport});
    pong.render();

    console.log(header.isVisible, scroll.current);
    if (!header.isVisible && scroll.current > 0) {
      header.show();
    }
  };

  window.onload = () => {
    const sr = ScrollReveal();
    sr.reveal('.reveal');
    init(getViewport());
    Observable.fromEvent(window, 'resize')
      .debounceTime(100)
      .map(() => getViewport())
      .subscribe(init);
  };
}