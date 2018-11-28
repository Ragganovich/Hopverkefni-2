import { empty } from './helpers.js'; /* eslint-disable-line*/

export default class List {
  constructor() {
    this.container = document.querySelector('.list');
  }

  load() {
    empty(this.container);
  }
}
