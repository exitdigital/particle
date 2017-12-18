import Velocity from 'velocity-animate';
import autobind from 'autobind-decorator';

const {fetch} = require('fetch-ponyfill')();

@autobind
class Form {
  el = null;
  fields$ = {};
  submit = null;
  success = null;
  wasSubmitted = false;
  hasError = false;

  constructor({document}) {
    ['email', 'message', 'name'].forEach(field => {
      const el = document.getElementById('f_' + field);

      this.fields$[field] = el;

      el.addEventListener('keyup', () => {
        this.validateField(field);
      });

      el.addEventListener('invalid', () => {
        this.wasSubmitted = true;
        this.validateField(field);
      });

    });
    this.el = document.getElementById('form');
    this.submit = document.getElementById('f_submit');
    this.success = document.getElementById('form-success');

    this.el.addEventListener('submit', e => {
      this.wasSubmitted = true;
      e.preventDefault();
      this.doSubmit();


    });


  }

  init() {
    this.height = this.el.offsetHeight;
    console.log(this.height);
  }

  getField(name) {
    return this.fields$[name];
  }

  forEach(fn) {
    Object.keys(this.fields$).forEach(fn);
  }

  map(fn) {
    return Object.keys(this.fields$).map(fn);
  }

  reduce(fn, seed) {
    return Object.keys(this.fields$).reduce(fn, {});

  }

  validateField(name) {
    const field = this.getField(name);
    if (typeof field.value !== 'string' || field.value.length == 0) {
      field.classList.add('error');
      this.hasError = true;
    } else {
      field.classList.remove('error');
    }
  }


  doSubmit() {
    this.hasError = false;
    this.forEach(this.validateField);
    if (this.hasError) {
      return;
    } else {
      const body = JSON.stringify(this.reduce((agg, x) => {
        return {...agg, [x]: this.getField(x).value};
      }, {}));


      const onDone = r => {
        const {status} = r;

        return r.json().then(response => {
          console.log(response);
          this.el.classList.add('inactive');
          this.success.setAttribute('style', 'height:' + this.height + 'px');
          this.success.classList.add('active');
        })
      };

      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };


      const uri = window.location.protocol + '//' + window.location.host + '/form.php';
      return fetch(uri, {method: 'POST', body, headers}).then(onDone);

    }
  }
}

export default Form;

