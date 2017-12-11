import Scroll from './src/scroll';
import Pong from './src/pong';


import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';


if (typeof window !== 'undefined') {

  const init = () => {
    console.log('init');
    const viewport = {
      w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    };

    const scroll = new Scroll({document, className: 'section'});
    const pong = new Pong({document, id: 'pong', viewport});

    scroll.init();
    pong.init({viewport});
    pong.render();
  };

  window.onload = () => {
    init();
    Observable.fromEvent(window, 'resize').debounceTime(100).subscribe(init);
  };
}