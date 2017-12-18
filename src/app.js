import Scroll from './components/scroll';
import Header from './components/header';
import Pong from './components/pong';
import Menu from './components/menu';
import Form from './components/form';


import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import styles from './style/app.scss';


if (typeof window !== 'undefined') {

  const getViewport = () => {
    return {
      w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    };
  };

  const init = ({scroll, pong, form, header}) => {
    const viewport = getViewport();
    form.init();
    pong.init({viewport});
    scroll.init({viewport});

    if (!header.isVisible && scroll.current > 0) {
      header.show();
    }

  };

  window.onload = () => {
    const
      form = new Form({document}),
      header = new Header({el: document.getElementById('header')}),
      begin = (last, next) => {
        console.log("begin scroll", last, next);
        if (next === 0) {
          header.hide();
        }
      },
      complete = (last, next) => {
        console.log("end scroll", last, next);
        if (next !== 0) {
          header.show();
        }
      },
      scroll = new Scroll({document, className: 'section', begin, complete}),
      pong = new Pong({document, id: 'pong', scroll}),
      menu = new Menu(
        {
          toggles: document.getElementsByClassName('menu-toggle'),
          el: document.getElementById('menu'),
          scroll,
          document
        });

    init({scroll, pong, menu, header, form});


    Observable.fromEvent(window, 'resize')
      .debounceTime(100)
      .subscribe(() => init({scroll, form, pong, menu, header}));
  };
}